// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { Client } from 'pg';

export const runtime = 'nodejs';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id;

  try {
    const res = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id;
  const { name, email, role, status, phone, cpf } = await request.json();

  // Validation
  if (!name || !email || !role) {
    return NextResponse.json({ error: 'Validation Error: Name, email, and role are required.' }, { status: 400 });
  }

  try {
    const res = await client.query(
      'UPDATE users SET name = $1, email = $2, role = $3, status = $4, phone = $5, cpf = $6 WHERE id = $7',
      [name, email, role, status, phone, cpf, userId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id;

  try {
    const res = await client.query('UPDATE users SET status = $1 WHERE id = $2', ['inactive', userId]);
    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
