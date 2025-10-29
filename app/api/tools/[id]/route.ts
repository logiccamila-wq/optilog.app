import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {


  try {


    const sql = getDb();
    const id = parseInt(params.id);
    const [row] = await sql`SELECT * FROM tools WHERE id = ${id}`;
    if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (error: any) {
    console.error('GET /api/tools/[id] error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {


  try {


    const sql = getDb();
    const id = parseInt(params.id);
    const body = await request.json();
    const fields = [
      'code','name','category','status','condition','location','assigned_to','last_os_id','purchase_date','purchase_price','notes'
    ];

    // Monta update dinâmico
    const updates: string[] = [];
    const values: any[] = [];
    fields.forEach((key) => {
      if (key in body) {
        updates.push(`${key} = $${updates.length + 1}`);
        values.push(body[key]);
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 });
    }

    const query = `UPDATE tools SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $$${updates.length + 1} RETURNING *`;
    // @ts-ignore
    const [row] = await sql(query, [...values, id]);
    return NextResponse.json(row);
  } catch (error: any) {
    console.error('PUT /api/tools/[id] error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {


  try {


    const sql = getDb();
    const id = parseInt(params.id);
    await sql`DELETE FROM tools WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/tools/[id] error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
