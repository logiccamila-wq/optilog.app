import { NextRequest, NextResponse } from 'next/server';
import { getSql, isDatabaseConfigured } from '@/lib/db';
import { publishEvent } from '@/lib/integration';

export const runtime = 'nodejs';

// Mock data (mesma lista da rota principal)
const mockDrivers = [
  { id: 1, name: 'João Silva', cnh: '12345678901', phone: '11987654321', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: 'Maria Santos', cnh: '98765432109', phone: '11912345678', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, name: 'Carlos Oliveira', cnh: '11122233344', phone: '11965432100', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

async function ensureSchema(sql: any) {
  await sql`create table if not exists drivers (
    id bigserial primary key,
    name text not null,
    cnh text not null,
    phone text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;
  // garante coluna em bases existentes
  await sql(
    'alter table if exists drivers add column if not exists updated_at timestamptz default now()'
  );
  await sql`create unique index if not exists idx_drivers_cnh_unique on drivers (cnh)`;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 });
    }

    const body = await req.json();
    const name = (body?.name || '').trim();
    const cnhRaw = (body?.cnh || '').trim();
    const phoneRaw = (body?.phone || '').trim();

    if (!name || !cnhRaw) {
      return NextResponse.json({ error: 'name e cnh são obrigatórios' }, { status: 400 });
    }

    // validações e normalização
    const cnhDigits = cnhRaw.replace(/\D/g, '');
    const phoneDigits = phoneRaw ? phoneRaw.replace(/\D/g, '') : '';
    if (cnhDigits.length !== 11) {
      return NextResponse.json({ error: 'CNH deve ter 11 dígitos' }, { status: 400 });
    }
    if (phoneDigits && phoneDigits.length < 10) {
      return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 });
    }

    // Fallback sem DB
    if (!isDatabaseConfigured()) {
      const idx = mockDrivers.findIndex((d) => d.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Motorista não encontrado' }, { status: 404 });
      }
      mockDrivers[idx] = {
        ...mockDrivers[idx],
        name,
        cnh: cnhDigits,
        phone: phoneDigits || null,
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json({ ok: true, driver: mockDrivers[idx], _mock: true }, { status: 200 });
    }

    const sql = getSql();
    await ensureSchema(sql);

    try {
      const rows = await sql`update drivers
                              set name = ${name},
                                  cnh = ${cnhDigits},
                                  phone = ${phoneDigits || null},
                                  updated_at = now()
                              where id = ${id}
                              returning id, name, cnh, phone, created_at, updated_at`;
      const driver = Array.isArray(rows) ? rows[0] : rows?.[0];
      if (!driver) {
        return NextResponse.json({ error: 'Motorista não encontrado' }, { status: 404 });
      }
      // publica evento de atualização
      publishEvent({ entity: 'driver', action: 'update', data: driver }).catch(() => {});
      return NextResponse.json({ ok: true, driver }, { status: 200 });
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

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 });
    }

    // Fallback sem DB
    if (!isDatabaseConfigured()) {
      const idx = mockDrivers.findIndex((d) => d.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Motorista não encontrado' }, { status: 404 });
      }
      mockDrivers.splice(idx, 1);
      return NextResponse.json({ ok: true, _mock: true }, { status: 200 });
    }

    const sql = getSql();
    await ensureSchema(sql);

    const rows = await sql`delete from drivers where id = ${id} returning id`;
    const deleted = Array.isArray(rows) ? rows[0] : rows?.[0];
    if (!deleted) {
      return NextResponse.json({ error: 'Motorista não encontrado' }, { status: 404 });
    }
    // publica evento de exclusão
    publishEvent({ entity: 'driver', action: 'delete', data: { id } }).catch(() => {});
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}
