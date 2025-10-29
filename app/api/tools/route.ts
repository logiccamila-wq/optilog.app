import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

export async function GET(request: NextRequest) {


  try {


    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    let query = 'SELECT * FROM tools WHERE 1=1';
    const params: any[] = [];

    if (q) {
      query += ` AND (LOWER(name) LIKE LOWER($${params.length + 1}) OR LOWER(code) LIKE LOWER($${params.length + 1}))`;
      params.push(`%${q}%`);
    }

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    // @ts-ignore - neon tagged query supports (text, params)
    const rows = await sql(query, params);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('GET /api/tools error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {


  try {


    const sql = getDb();
    const body = await request.json();
    const {
      code,
      name,
      category,
      status = 'disponivel',
      condition = 'boa',
      location,
      assigned_to,
      last_os_id,
      purchase_date,
      purchase_price,
      notes,
    } = body || {};

    if (!code || !name) {
      return NextResponse.json({ error: 'code e name são obrigatórios' }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO tools (code, name, category, status, condition, location, assigned_to, last_os_id, purchase_date, purchase_price, notes)
      VALUES (${code}, ${name}, ${category || null}, ${status}, ${condition}, ${location || null}, ${assigned_to || null}, ${last_os_id || null}, ${purchase_date || null}, ${purchase_price || null}, ${notes || null})
      RETURNING *
    `;

    return NextResponse.json(row, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/tools error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
