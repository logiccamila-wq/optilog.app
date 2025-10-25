import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { publishEvent } from '@/lib/integration';

export const runtime = 'nodejs';

async function ensureSchema(sql: any) {
  await sql`create table if not exists vehicles (
    id bigserial primary key,
    plate text not null,
    model text,
    year int,
    odometer int,
    chassis text,
    renavam text,
    color text,
    brand text,
    cost_center text,
    goal_desc text,
    axles_count int,
    tire_type text,
    tire_dimensions text,
    purchase_value numeric,
    ownership text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`;
  // garante colunas em bases existentes
  await sql('alter table if exists vehicles add column if not exists updated_at timestamptz default now()');
  await sql('alter table if exists vehicles add column if not exists year int');
  await sql('alter table if exists vehicles add column if not exists odometer int');
  await sql('alter table if exists vehicles add column if not exists chassis text');
  await sql('alter table if exists vehicles add column if not exists renavam text');
  await sql('alter table if exists vehicles add column if not exists color text');
  await sql('alter table if exists vehicles add column if not exists brand text');
  await sql('alter table if exists vehicles add column if not exists cost_center text');
  await sql('alter table if exists vehicles add column if not exists goal_desc text');
  await sql('alter table if exists vehicles add column if not exists axles_count int');
  await sql('alter table if exists vehicles add column if not exists tire_type text');
  await sql('alter table if exists vehicles add column if not exists tire_dimensions text');
  await sql('alter table if exists vehicles add column if not exists purchase_value numeric');
  await sql('alter table if exists vehicles add column if not exists ownership text');
  await sql`create unique index if not exists idx_vehicles_plate_unique on vehicles (lower(plate))`;
  await sql`create unique index if not exists idx_vehicles_renavam_unique on vehicles (renavam) where renavam is not null`;
  await sql`create unique index if not exists idx_vehicles_chassis_unique on vehicles (chassis) where chassis is not null`;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const model = (body?.model || '').trim();
    const year = body?.year != null && body.year !== '' ? parseInt(String(body.year), 10) : null;
    const odometer = body?.odometer != null && body.odometer !== '' ? parseInt(String(body.odometer), 10) : null;
    const color = (body?.color || '').trim();
    const brand = (body?.brand || '').trim();
    const cost_center = (body?.cost_center || '').trim();
    const goal_desc = (body?.goal || '').trim();
    const axles_count = body?.axles_count != null && body.axles_count !== '' ? parseInt(String(body.axles_count), 10) : null;
    const tire_type = (body?.tire_type || '').trim();
    const tire_dimensions = (body?.tire_dimensions || '').trim();
    const purchase_value = body?.purchase_value != null && body.purchase_value !== '' ? parseFloat(String(body.purchase_value)) : null;
    const ownershipRaw = (body?.ownership || '').trim().toLowerCase();
    const ownershipAllowed = ['financiado','proprio','alugado','agregado','autonomo'];
    const ownership = ownershipRaw ? (ownershipAllowed.includes(ownershipRaw) ? ownershipRaw : null) : null;
    // novos campos de preset de eixos
    const axle_config_name = (body?.axle_config_name || '').trim() || null;
    const axle_weights = Array.isArray(body?.axle_weights) ? body.axle_weights : null;
    const gross_weight_estimated = body?.gross_weight_estimated != null && body.gross_weight_estimated !== '' ? parseFloat(String(body.gross_weight_estimated)) : null;

    const sql = getSql();
    await sql`update vehicles set 
      model = ${model || null},
      year = ${year},
      odometer = ${odometer},
      color = ${color || null},
      brand = ${brand || null},
      cost_center = ${cost_center || null},
      goal_desc = ${goal_desc || null},
      axles_count = ${axles_count},
      axle_config_name = ${axle_config_name},
      axle_weights = ${axle_weights},
      gross_weight_estimated = ${gross_weight_estimated},
      tire_type = ${tire_type || null},
      tire_dimensions = ${tire_dimensions || null},
      purchase_value = ${purchase_value},
      ownership = ${ownership},
      updated_at = now()
      where id = ${id}`;

    const rows = await sql`select id, plate, model, year, odometer, chassis, renavam, color, brand, cost_center, goal_desc, axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership, created_at, updated_at from vehicles where id = ${id}`;
    const vehicle = Array.isArray(rows) ? rows[0] : rows?.[0];
    return NextResponse.json(vehicle, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao atualizar veículo', detail: err?.message || String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const sql = getSql();
    const rows = await sql`select id, plate, model, year, odometer, chassis, renavam, color, brand, cost_center, goal_desc, axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership, created_at, updated_at from vehicles where id = ${id}`;
    const vehicle = Array.isArray(rows) ? rows[0] : rows?.[0];
    if (!vehicle) return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
    return NextResponse.json(vehicle, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao buscar veículo', detail: err?.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 });
    }

    const sql = getSql();
    await ensureSchema(sql);

    const rows = await sql`delete from vehicles where id = ${id} returning id, plate`;
    const deleted = Array.isArray(rows) ? rows[0] : rows?.[0];
    if (!deleted) {
      return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
    }
    try { await publishEvent({ entity: 'vehicle', action: 'delete', data: deleted }); } catch {}
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}