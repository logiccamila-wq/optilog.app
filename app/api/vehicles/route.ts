import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { publishEvent } from '@/lib/integration';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plateRaw = (body?.plate || '').trim();
    const model = (body?.model || '').trim();
    const year = body?.year != null && body.year !== '' ? parseInt(String(body.year), 10) : null;
    const odometer =
      body?.odometer != null && body.odometer !== '' ? parseInt(String(body.odometer), 10) : null;
    const chassisRaw = (body?.chassis || '').trim().toUpperCase();
    const renavamDigits = (body?.renavam || '').replace(/\D/g, '');
    const color = (body?.color || '').trim();
    const brand = (body?.brand || '').trim();
    const cost_center = (body?.cost_center || '').trim();
    const goal_desc = (body?.goal || '').trim();
    const axles_count =
      body?.axles_count != null && body.axles_count !== ''
        ? parseInt(String(body.axles_count), 10)
        : null;
    const tire_type = (body?.tire_type || '').trim();
    const tire_dimensions = (body?.tire_dimensions || '').trim();
    const purchase_value =
      body?.purchase_value != null && body.purchase_value !== ''
        ? parseFloat(String(body.purchase_value))
        : null;
    const ownershipRaw = (body?.ownership || '').trim().toLowerCase();
    const ownershipAllowed = ['financiado', 'proprio', 'alugado', 'agregado', 'autonomo'];
    const ownership = ownershipRaw
      ? ownershipAllowed.includes(ownershipRaw)
        ? ownershipRaw
        : null
      : null;
    // novos campos de preset de eixos
    const axle_config_name = (body?.axle_config_name || '').trim() || null;
    const axle_weights = Array.isArray(body?.axle_weights) ? body.axle_weights : null;
    const gross_weight_estimated =
      body?.gross_weight_estimated != null && body.gross_weight_estimated !== ''
        ? parseFloat(String(body.gross_weight_estimated))
        : null;
    // capacidade em toneladas
    const capacity_ton =
      body?.capacity_ton != null && body.capacity_ton !== ''
        ? parseFloat(String(body.capacity_ton))
        : null;

    const plate = plateRaw.toUpperCase();
    if (!plate) {
      return NextResponse.json({ error: 'plate é obrigatório' }, { status: 400 });
    }
    // validação de placa (Brasil: padrão antigo AAA0000 ou Mercosul AAA0A00)
    const isPlateValid =
      /^[A-Z]{3}[0-9]{4}$/.test(plate) || /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate);
    if (!isPlateValid) {
      return NextResponse.json(
        { error: 'Placa inválida (use AAA0000 ou AAA0A00)' },
        { status: 400 }
      );
    }
    const nowYear = new Date().getFullYear();
    if (year !== null && (year < 1900 || year > nowYear + 1)) {
      return NextResponse.json({ error: 'Ano inválido' }, { status: 400 });
    }
    if (odometer !== null && odometer < 0) {
      return NextResponse.json({ error: 'Hodômetro inválido' }, { status: 400 });
    }
    // VIN/chassi: 17 caracteres, sem I/O/Q
    const chassis = chassisRaw.replace(/[^A-HJ-NPR-Z0-9]/g, '');
    if (chassis && !/^[A-HJ-NPR-Z0-9]{17}$/.test(chassis)) {
      return NextResponse.json({ error: 'Chassi inválido (VIN 17 caracteres)' }, { status: 400 });
    }
    // RENAVAM: 11 dígitos
    if (renavamDigits && renavamDigits.length !== 11) {
      return NextResponse.json({ error: 'RENAVAM deve ter 11 dígitos' }, { status: 400 });
    }
    if (axles_count !== null && axles_count < 0) {
      return NextResponse.json({ error: 'Número de eixos inválido' }, { status: 400 });
    }
    if (purchase_value !== null && purchase_value < 0) {
      return NextResponse.json({ error: 'Valor de compra inválido' }, { status: 400 });
    }
    if (ownershipRaw && !ownership) {
      return NextResponse.json({ error: 'Tipo de posse inválido' }, { status: 400 });
    }
    if (capacity_ton !== null && capacity_ton <= 0) {
      return NextResponse.json({ error: 'capacity_ton deve ser > 0' }, { status: 400 });
    }

    const sql = getSql();
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
      axle_config_name text,
      axle_weights jsonb,
      gross_weight_estimated numeric,
      tire_type text,
      tire_dimensions text,
      purchase_value numeric,
      ownership text,
      capacity_ton numeric,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )`;
    // garantir colunas em bases existentes
    await sql('alter table if exists vehicles add column if not exists chassis text');
    await sql('alter table if exists vehicles add column if not exists renavam text');
    await sql('alter table if exists vehicles add column if not exists color text');
    await sql('alter table if exists vehicles add column if not exists brand text');
    await sql('alter table if exists vehicles add column if not exists cost_center text');
    await sql('alter table if exists vehicles add column if not exists goal_desc text');
    await sql('alter table if exists vehicles add column if not exists axles_count int');
    await sql('alter table if exists vehicles add column if not exists axle_config_name text');
    await sql('alter table if exists vehicles add column if not exists axle_weights jsonb');
    await sql(
      'alter table if exists vehicles add column if not exists gross_weight_estimated numeric'
    );
    await sql('alter table if exists vehicles add column if not exists tire_type text');
    await sql('alter table if exists vehicles add column if not exists tire_dimensions text');
    await sql('alter table if exists vehicles add column if not exists purchase_value numeric');
    await sql('alter table if exists vehicles add column if not exists ownership text');
    await sql('alter table if exists vehicles add column if not exists capacity_ton numeric');
    await sql`create unique index if not exists idx_vehicles_plate_unique on vehicles (lower(plate))`;
    await sql`create unique index if not exists idx_vehicles_renavam_unique on vehicles (renavam) where renavam is not null`;
    await sql`create unique index if not exists idx_vehicles_chassis_unique on vehicles (chassis) where chassis is not null`;

    try {
      const rows =
        await sql`insert into vehicles (plate, model, year, odometer, chassis, renavam, color, brand, cost_center, goal_desc, axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership, capacity_ton)
                             values (${plate}, ${model || null}, ${year}, ${odometer}, ${chassis || null}, ${renavamDigits || null}, ${color || null}, ${brand || null}, ${cost_center || null}, ${goal_desc || null}, ${axles_count}, ${axle_config_name}, ${axle_weights}, ${gross_weight_estimated}, ${tire_type || null}, ${tire_dimensions || null}, ${purchase_value}, ${ownership}, ${capacity_ton})
                             returning id, plate, model, year, odometer, chassis, renavam, color, brand, cost_center, goal_desc, axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership, capacity_ton, created_at, updated_at`;
      const vehicle = Array.isArray(rows) ? rows[0] : rows?.[0];
      try {
        await publishEvent({ entity: 'vehicle', action: 'create', data: vehicle });
      } catch {}
      return NextResponse.json({ ok: true, vehicle }, { status: 201 });
    } catch (e: any) {
      if (e?.code === '23505') {
        return NextResponse.json(
          { error: 'Conflito: placa/chassi/renavam já cadastrados' },
          { status: 409 }
        );
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
      axle_config_name text,
      axle_weights jsonb,
      gross_weight_estimated numeric,
      tire_type text,
      tire_dimensions text,
      purchase_value numeric,
      ownership text,
      capacity_ton numeric,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )`;

    const where = q
      ? sql`WHERE plate ILIKE ${'%' + q + '%'} OR model ILIKE ${'%' + q + '%'} OR brand ILIKE ${'%' + q + '%'}`
      : sql``;

    const totalRows = await sql`SELECT count(*)::int as total FROM vehicles ${where}`;
    const total = Array.isArray(totalRows)
      ? (totalRows[0]?.total ?? 0)
      : (totalRows?.[0]?.total ?? 0);

    const rows = q
      ? await sql`SELECT id, plate, model, year, odometer, chassis, renavam, color, brand, cost_center, goal_desc, axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership, capacity_ton, created_at, updated_at
                  FROM vehicles
                  WHERE plate ILIKE ${'%' + q + '%'} OR model ILIKE ${'%' + q + '%'} OR brand ILIKE ${'%' + q + '%'}
                  ORDER BY created_at DESC
                  LIMIT ${pageSize} OFFSET ${offset}`
      : await sql`SELECT id, plate, model, year, odometer, chassis, renavam, color, brand, cost_center, goal_desc, axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership, capacity_ton, created_at, updated_at
                  FROM vehicles
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
