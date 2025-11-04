import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { jwtVerify } from 'jose';

// Verificar autenticação e permissões
async function verifyAuth(request: NextRequest): Promise<{ authorized: boolean; role?: string; userId?: number }> {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return { authorized: false };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
    const { payload } = await jwtVerify(token, secret);
    
    return { 
      authorized: true, 
      role: payload.role as string,
      userId: payload.userId as number
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authorized: false };
  }
}

// GET /api/users/:id - Obter detalhes do usuário
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);
    
    if (!auth.authorized || !['admin', 'manager'].includes(auth.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const users = await db(
      'SELECT id, name, email, role, status, phone, cpf, cnh, avatar_url, created_at, updated_at, last_login, email_verified FROM users WHERE id = $1 AND deleted_at IS NULL',
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/users/:id - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);
    
    // Apenas admins podem atualizar usuários
    if (!auth.authorized || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, role, status, phone, cpf, cnh } = body;

    // Verificar se usuário existe
    const existingUsers = await db(
      'SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL',
      [userId]
    );

    if (existingUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validar role se fornecido
    if (role && !['admin', 'manager', 'driver', 'mechanic', 'operator'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Validar status se fornecido
    if (status && !['active', 'inactive', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Se o email foi alterado, verificar se já existe
    if (email) {
      const emailCheck = await db(
        'SELECT id FROM users WHERE email = $1 AND id != $2 AND deleted_at IS NULL',
        [email, userId]
      );
      if (emailCheck.length > 0) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
    }

    // Construir query de atualização dinâmica
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }
    if (role !== undefined) {
      updates.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex}`);
      values.push(phone);
      paramIndex++;
    }
    if (cpf !== undefined) {
      updates.push(`cpf = $${paramIndex}`);
      values.push(cpf);
      paramIndex++;
    }
    if (cnh !== undefined) {
      updates.push(`cnh = $${paramIndex}`);
      values.push(cnh);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(userId);
    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id, name, email, role, status, phone, cpf, cnh, created_at, updated_at
    `;

    const result = await db(query, values);

    return NextResponse.json({ user: result[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/users/:id - Soft delete do usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);
    
    // Apenas admins podem deletar usuários
    if (!auth.authorized || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Verificar se usuário existe
    const existingUsers = await db(
      'SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL',
      [userId]
    );

    if (existingUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Soft delete - marcar como deletado
    await db(
      'UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = $1 WHERE id = $2',
      ['inactive', userId]
    );

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
