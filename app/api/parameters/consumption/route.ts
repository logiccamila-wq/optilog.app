import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export const runtime = 'nodejs';

async function ensureTable() {
  const sql = getSql();
  await sql`create table if not exists vehicle_consumption_params (
    id bigserial primary key,
    vehicle_type text, -- ex: cavalo, carreta, bitrem
    axle_config text,  -- ex: 4x2, 6x2, 6x4, 4x4
    fuel_type text,    -- ex: diesel, gasolina
    avg_consumption_kml numeric, -- km/l médio
    source text, -- ex: CONAB 2024 Boletim XYZ
    effective_date date,
    limits jsonb, -- json com faixas/condições oficiais
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;
}

export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10)));
    const offset = (page - 1) * pageSize;
    const q = (searchParams.get('q') || '').trim();
    const vehicle_type = (searchParams.get('vehicle_type') || '').trim();
    const axle_config = (searchParams.get('axle_config') || '').trim();

    const sql = getSql();
    const whereClauses: any[] = [];
    if (q)
      whereClauses.push(
        sql`(vehicle_type ILIKE ${'%' + q + '%'} OR axle_config ILIKE ${'%' + q + '%'} OR fuel_type ILIKE ${'%' + q + '%'} OR source ILIKE ${'%' + q + '%'})`
      );
    if (vehicle_type) whereClauses.push(sql`vehicle_type = ${vehicle_type}`);
    if (axle_config) whereClauses.push(sql`axle_config = ${axle_config}`);
    const where = whereClauses.length ? sql`WHERE ${sql.join(whereClauses, sql` AND `)}` : sql``;

    const totalRows =
      await sql`SELECT count(*)::int as total FROM vehicle_consumption_params ${where}`;
    const total = Array.isArray(totalRows)
      ? (totalRows[0]?.total ?? 0)
      : (totalRows?.[0]?.total ?? 0);

    const rows =
      await sql`SELECT id, vehicle_type, axle_config, fuel_type, avg_consumption_kml, source, effective_date, limits, created_at, updated_at
                           FROM vehicle_consumption_params ${where}
                           ORDER BY effective_date DESC NULLS LAST, created_at DESC
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

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const body = await req.json();
    const vehicle_type = (body?.vehicle_type || '').trim();
    const axle_config = (body?.axle_config || '').trim();
    const fuel_type = (body?.fuel_type || '').trim();
    const avg_consumption_kml =
      body?.avg_consumption_kml != null && body.avg_consumption_kml !== ''
        ? parseFloat(String(body.avg_consumption_kml))
        : null;
    const source = (body?.source || '').trim();
    const effective_date = (body?.effective_date || '').trim();
    const limits = body?.limits ?? null;

    if (!vehicle_type)
      return NextResponse.json({ error: 'vehicle_type é obrigatório' }, { status: 400 });
    if (!axle_config)
      return NextResponse.json({ error: 'axle_config é obrigatório' }, { status: 400 });
    if (!fuel_type) return NextResponse.json({ error: 'fuel_type é obrigatório' }, { status: 400 });
    if (avg_consumption_kml !== null && avg_consumption_kml <= 0)
      return NextResponse.json({ error: 'avg_consumption_kml deve ser > 0' }, { status: 400 });

    const sql = getSql();
    const rows =
      await sql`INSERT INTO vehicle_consumption_params (vehicle_type, axle_config, fuel_type, avg_consumption_kml, source, effective_date, limits)
                           VALUES (${vehicle_type}, ${axle_config}, ${fuel_type}, ${avg_consumption_kml}, ${source || null}, ${effective_date || null}, ${limits})
                           RETURNING id, vehicle_type, axle_config, fuel_type, avg_consumption_kml, source, effective_date, limits, created_at, updated_at`;
    return NextResponse.json(
      { ok: true, record: Array.isArray(rows) ? rows[0] : rows?.[0] },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureTable();
    const body = await req.json();
    const id = body?.id != null ? parseInt(String(body.id), 10) : null;
    if (!id)
      return NextResponse.json({ error: 'id é obrigatório para atualização' }, { status: 400 });

    const vehicle_type = body?.vehicle_type ?? null;
    const axle_config = body?.axle_config ?? null;
    const fuel_type = body?.fuel_type ?? null;
    const avg_consumption_kml =
      body?.avg_consumption_kml != null && body.avg_consumption_kml !== ''
        ? parseFloat(String(body.avg_consumption_kml))
        : null;
    const source = body?.source ?? null;
    const effective_date = body?.effective_date ?? null;
    const limits = body?.limits ?? null;

    const sql = getSql();
    const rows = await sql`UPDATE vehicle_consumption_params
                           SET vehicle_type = COALESCE(${vehicle_type}, vehicle_type),
                               axle_config = COALESCE(${axle_config}, axle_config),
                               fuel_type = COALESCE(${fuel_type}, fuel_type),
                               avg_consumption_kml = COALESCE(${avg_consumption_kml}, avg_consumption_kml),
                               source = COALESCE(${source}, source),
                               effective_date = COALESCE(${effective_date}, effective_date),
                               limits = COALESCE(${limits}, limits),
                               updated_at = now()
                           WHERE id = ${id}
                           RETURNING id, vehicle_type, axle_config, fuel_type, avg_consumption_kml, source, effective_date, limits, created_at, updated_at`;
    if (!rows || rows.length === 0)
      return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
    return NextResponse.json(
      { ok: true, record: Array.isArray(rows) ? rows[0] : rows?.[0] },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id é obrigatório para exclusão' }, { status: 400 });
    const idNum = parseInt(String(id), 10);

    const sql = getSql();
    const rows = await sql`DELETE FROM vehicle_consumption_params WHERE id = ${idNum} RETURNING id`;
    if (!rows || rows.length === 0)
      return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
    return NextResponse.json({ ok: true, id: idNum }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}
