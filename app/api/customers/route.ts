import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/customers - Lista clientes
export async function GET(request: NextRequest) {

  try {

    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let customers;
    
    if (search) {
      customers = await sql`
        SELECT * FROM customers
        WHERE name ILIKE ${'%' + search + '%'} 
           OR email ILIKE ${'%' + search + '%'}
        ORDER BY name
      `;
    } else {
      customers = await sql`
        SELECT * FROM customers
        ORDER BY created_at DESC
        LIMIT 100
      `;
    }

    return NextResponse.json(customers);
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/customers - Criar cliente
export async function POST(request: NextRequest) {

  try {

    const sql = getDb();
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const [customer] = await sql`
      INSERT INTO customers (name, email, phone)
      VALUES (${name}, ${email || null}, ${phone || null})
      RETURNING *
    `;

    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/customers/:id - Atualizar cliente
export async function PUT(request: NextRequest) {

  try {

    const sql = getDb();
    const body = await request.json();
    const { id, name, email, phone } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID e nome são obrigatórios' },
        { status: 400 }
      );
    }

    const [customer] = await sql`
      UPDATE customers
      SET name = ${name}, email = ${email || null}, phone = ${phone || null}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/customers/:id - Deletar cliente
export async function DELETE(request: NextRequest) {

  try {

    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM customers WHERE id = ${parseInt(id)}`;

    return NextResponse.json({ message: 'Cliente deletado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}