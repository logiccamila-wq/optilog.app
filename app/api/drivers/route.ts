import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { publishEvent } from '@/lib/integration';

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

    // validações e normalização
    const cnhDigits = cnh.replace(/\D/g, '');
    const phoneDigits = phone ? phone.replace(/\D/g, '') : '';
    if (cnhDigits.length !== 11) {
      return NextResponse.json({ error: 'CNH deve ter 11 dígitos' }, { status: 400 });
    }
    if (phoneDigits && phoneDigits.length < 10) {
      return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 });
    }

    const sql = getSql();
    await sql`create table if not exists drivers (
      id bigserial primary key,
      name text not null,
      cnh text not null,
      phone text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )`;
    await sql`create unique index if not exists idx_drivers_cnh_unique on drivers (cnh)`;

    try {
      const rows = await sql`insert into drivers (name, cnh, phone)
                             values (${name}, ${cnhDigits}, ${phoneDigits || null})
                             returning id, name, cnh, phone, created_at, updated_at`;
      const driver = Array.isArray(rows) ? rows[0] : rows?.[0];
      // publica evento de criação (não bloqueia fluxo em caso de erro)
      publishEvent({ entity: 'driver', action: 'create', data: driver }).catch(() => {});
      return NextResponse.json({ ok: true, driver }, { status: 201 });
    } catch (e: any) {
      if (e?.code === '23505') {
        return NextResponse.json({ error: 'CNH já cadastrada' }, { status: 409 });
      }
      throw e;
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10)));
    const offset = (page - 1) * pageSize;
    const q = (searchParams.get('q') || '').trim();

    const sql = getSql();
    await sql`create table if not exists drivers (
      id bigserial primary key,
      name text not null,
      cnh text not null,
      phone text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )`;

    const where = q ? sql`WHERE name ILIKE ${'%' + q + '%'} OR cnh ILIKE ${'%' + q + '%'}` : sql``;
    const totalRows = await sql`SELECT count(*)::int as total FROM drivers ${where}`;
    const total = Array.isArray(totalRows)
      ? (totalRows[0]?.total ?? 0)
      : (totalRows?.[0]?.total ?? 0);

    const rows = q
      ? await sql`SELECT id, name, cnh, phone, created_at, updated_at
                  FROM drivers
                  WHERE name ILIKE ${'%' + q + '%'} OR cnh ILIKE ${'%' + q + '%'}
                  ORDER BY created_at DESC
                  LIMIT ${pageSize} OFFSET ${offset}`
      : await sql`SELECT id, name, cnh, phone, created_at, updated_at
                  FROM drivers
                  ORDER BY created_at DESC
                  LIMIT ${pageSize} OFFSET ${offset}`;

    const resp = new NextResponse(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'X-Total-Count': String(total) },
    });
    return resp;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}
