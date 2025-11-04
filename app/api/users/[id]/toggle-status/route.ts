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

// POST /api/users/:id/toggle-status - Alternar status do usuário (active <-> suspended)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);
    
    // Apenas admins podem alterar status
    if (!auth.authorized || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Buscar status atual
    const users = await db(
      'SELECT id, status FROM users WHERE id = $1 AND deleted_at IS NULL',
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentStatus = users[0].status;
    let newStatus: string;

    // Toggle status
    if (currentStatus === 'active') {
      newStatus = 'suspended';
    } else if (currentStatus === 'suspended' || currentStatus === 'inactive') {
      newStatus = 'active';
    } else {
      return NextResponse.json({ error: 'Invalid current status' }, { status: 400 });
    }

    // Atualizar status
    const result = await db(
      `UPDATE users 
       SET status = $1 
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING id, name, email, role, status, phone, cpf, cnh, created_at, updated_at`,
      [newStatus, userId]
    );

    return NextResponse.json({ 
      user: result[0],
      message: `User status changed from ${currentStatus} to ${newStatus}`
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
