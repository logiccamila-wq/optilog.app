import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body?.name || '').trim();
    const cnh = (body?.cnh || '').trim();
    const phone = (body?.phone || '').trim();

    if (!name || !cnh) {
      return NextResponse.json({ error: 'name e cnh são obrigatórios' }, { status: 400 });
    }

    const sql = getSql();
    await sql`create table if not exists drivers (
      id bigserial primary key,
      name text not null,
      cnh text not null,
      phone text,
      created_at timestamptz default now()
    )`;

    const rows = await sql`insert into drivers (name, cnh, phone)
                           values (${name}, ${cnh}, ${phone || null})
                           returning id, name, cnh, phone, created_at`;
    const driver = Array.isArray(rows) ? rows[0] : rows?.[0];
    return NextResponse.json({ ok: true, driver }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}