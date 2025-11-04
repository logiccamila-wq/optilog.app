import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { jwtVerify } from 'jose';

// Tipo para usuário do banco
interface DBUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  cpf?: string;
  cnh?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  email_verified: boolean;
}

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

// GET /api/users - Listar usuários
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    
    // Apenas admins podem listar e gerenciar usuários
    // Managers podem visualizar mas não editar (futuro: implementar permissão de view-only)
    if (!auth.authorized || !['admin'].includes(auth.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Construir query dinâmica
    let query = 'SELECT id, name, email, role, status, phone, cpf, cnh, avatar_url, created_at, updated_at, last_login, email_verified FROM users WHERE deleted_at IS NULL';
    const params: any[] = [];
    let paramIndex = 1;

    if (role) {
      query += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Contar total
    const countQuery = query.replace('SELECT id, name, email, role, status, phone, cpf, cnh, avatar_url, created_at, updated_at, last_login, email_verified', 'SELECT COUNT(*) as total');
    const countResult = await db(countQuery, params);
    const total = parseInt(countResult[0]?.total || '0');

    // Adicionar paginação
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const users = await db(query, params);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/users - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    
    // Apenas admins podem criar usuários
    if (!auth.authorized || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, status = 'active', phone, cpf, cnh } = body;

    // Validações
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['admin', 'manager', 'driver', 'mechanic', 'operator'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Verificar se email já existe
    const existingUser = await db('SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // TODO CRITICAL: Substituir por bcrypt antes de produção
    // ATENÇÃO: Base64 NÃO é seguro! Apenas para desenvolvimento
    // Usar: import bcrypt from 'bcrypt'; const hash = await bcrypt.hash(password, 10);
    const passwordHash = Buffer.from(password).toString('base64');

    // Criar usuário
    const result = await db(
      `INSERT INTO users (name, email, password_hash, role, status, phone, cpf, cnh)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, role, status, phone, cpf, cnh, created_at`,
      [name, email, passwordHash, role, status, phone, cpf, cnh]
    );

    return NextResponse.json({ user: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
