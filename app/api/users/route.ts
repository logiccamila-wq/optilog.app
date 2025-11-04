import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    let query = 'SELECT id, name, email, role, status, created_at, last_login FROM users WHERE 1=1';
    const params: string[] = [];
    
    if (role) {
      params.push(role);
      query += ` AND role = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await sql.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, status, phone, cpf } = body;
    
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await sql`
      INSERT INTO users (name, email, password, role, status, phone, cpf, created_at)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, ${status || 'active'}, ${phone || null}, ${cpf || null}, NOW())
      RETURNING id, name, email, role, status, created_at
    `;
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}