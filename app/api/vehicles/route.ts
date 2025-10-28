import { NextRequest, NextResponse } from 'next/server';
import { getSql, isDatabaseConfigured } from '@/lib/db';
import { publishEvent } from '@/lib/integration';

export const runtime = 'nodejs';

// Mock data quando DB não está configurado
const mockVehicles: any[] = [
  {
    id: 1,
    plate: 'ABC1D23',
    model: 'Actros 2651',
    brand: 'Mercedes-Benz',
    year: 2022,
    odometer: 124500,
    ownership: 'proprio',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    plate: 'XYZ9A88',
    model: 'FH 540',
    brand: 'Volvo',
    year: 2021,
    odometer: 210340,
    ownership: 'financiado',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    plate: 'JKL0B11',
    model: 'Constellation 31.280',
    brand: 'VW',
    year: 2020,
    odometer: 32210,
    ownership: 'alugado',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plate = String(body?.plate || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    const model = String(body?.model || '').trim();
    const brand = String(body?.brand || '').trim();
    const year = body?.year ?? null;
    const odometer = body?.odometer ?? null;
    const chassis = body?.chassis ? String(body.chassis).toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17) : null;
    const renavam = body?.renavam ? String(body.renavam).replace(/\D/g, '').slice(0, 11) : null;
    const color = body?.color ?? null;
    const cost_center = body?.cost_center ?? null;
    const goal = body?.goal ?? null;
    const axles_count = Number.isFinite(body?.axles_count) ? Number(body.axles_count) : null;
    const axle_config_name = body?.axle_config_name ?? null;
    const axle_weights = Array.isArray(body?.axle_weights) ? body.axle_weights : null;
    const gross_weight_estimated = Number.isFinite(body?.gross_weight_estimated)
      ? Number(body.gross_weight_estimated)
      : null;
    const tire_type = body?.tire_type ?? null;
    const tire_dimensions = body?.tire_dimensions ?? null;
    const purchase_value = Number.isFinite(body?.purchase_value) ? Number(body.purchase_value) : null;
    const ownership = body?.ownership ?? null;

    if (!plate) {
      return NextResponse.json({ error: 'plate é obrigatório' }, { status: 400 });
    }

    const plateRegexOld = /^[A-Z]{3}[0-9]{4}$/; // AAA0000
    const plateRegexMercosur = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/; // AAA0A00
    if (!(plateRegexOld.test(plate) || plateRegexMercosur.test(plate))) {
      return NextResponse.json({ error: 'Placa inválida (AAA0000 ou AAA0A00)' }, { status: 400 });
    }

    if (!isDatabaseConfigured()) {
      if (mockVehicles.some((v) => v.plate === plate)) {
        return NextResponse.json({ error: 'Placa já cadastrada' }, { status: 409 });
      }
      const newVehicle = {
        id: mockVehicles.length + 1,
        plate,
        model: model || null,
        brand: brand || null,
        year,
        odometer,
        chassis,
        renavam,
        color,
        cost_center,
        goal,
        axles_count,
        axle_config_name,
        axle_weights,
        gross_weight_estimated,
        tire_type,
        tire_dimensions,
        purchase_value,
        ownership,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockVehicles.unshift(newVehicle);
      return NextResponse.json({ ok: true, vehicle: newVehicle, _mock: true }, { status: 201 });
    }

    const sql = getSql();
    // Schema mínimo para veículos
    await sql`create table if not exists vehicles (
      id bigserial primary key,
      plate text not null,
      model text,
      brand text,
      year int,
      odometer int,
      chassis text,
      renavam text,
      color text,
      cost_center text,
      goal text,
      axles_count int,
      axle_config_name text,
      axle_weights jsonb,
      gross_weight_estimated numeric,
      tire_type text,
      tire_dimensions text,
      purchase_value numeric,
      ownership text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )`;
    await sql`create unique index if not exists idx_vehicles_plate_unique on vehicles (plate)`;

    try {
      const rows = await sql`insert into vehicles (
          plate, model, brand, year, odometer, chassis, renavam, color, cost_center, goal,
          axles_count, axle_config_name, axle_weights, gross_weight_estimated,
          tire_type, tire_dimensions, purchase_value, ownership
        ) values (
          ${plate}, ${model || null}, ${brand || null}, ${year}, ${odometer}, ${chassis}, ${renavam}, ${color}, ${cost_center}, ${goal},
          ${axles_count}, ${axle_config_name}, ${axle_weights ? JSON.stringify(axle_weights) : null}, ${gross_weight_estimated},
          ${tire_type}, ${tire_dimensions}, ${purchase_value}, ${ownership}
        ) returning id, plate, model, brand, year, odometer, chassis, renavam, color, cost_center, goal,
          axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership,
          created_at, updated_at`;
      const vehicle = Array.isArray(rows) ? rows[0] : rows?.[0];
      publishEvent({ entity: 'vehicle', action: 'create', data: vehicle }).catch(() => {
        // ignore integration errors
      });
      return NextResponse.json({ ok: true, vehicle }, { status: 201 });
    } catch (e: any) {
      if (e?.code === '23505') {
        return NextResponse.json({ error: 'Placa já cadastrada' }, { status: 409 });
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

    if (!isDatabaseConfigured()) {
      let filtered = mockVehicles;
      if (q) {
        const lower = q.toLowerCase();
        filtered = mockVehicles.filter(
          (v) =>
            String(v.plate || '').toLowerCase().includes(lower) ||
            String(v.model || '').toLowerCase().includes(lower) ||
            String(v.brand || '').toLowerCase().includes(lower)
        );
      }
      const total = filtered.length;
      const paginated = filtered.slice(offset, offset + pageSize);
      const resp = new NextResponse(JSON.stringify(paginated), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Total-Count': String(total),
          'X-Mock-Data': 'true',
        },
      });
      return resp;
    }

    const sql = getSql();
    await sql`create table if not exists vehicles (
      id bigserial primary key,
      plate text not null,
      model text,
      brand text,
      year int,
      odometer int,
      chassis text,
      renavam text,
      color text,
      cost_center text,
      goal text,
      axles_count int,
      axle_config_name text,
      axle_weights jsonb,
      gross_weight_estimated numeric,
      tire_type text,
      tire_dimensions text,
      purchase_value numeric,
      ownership text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )`;

    const where = q
      ? sql`WHERE plate ILIKE ${'%' + q + '%'} OR model ILIKE ${'%' + q + '%'} OR brand ILIKE ${'%' + q + '%'}`
      : sql``;
    const totalRows = await sql`SELECT count(*)::int as total FROM vehicles ${where}`;
    const total = Array.isArray(totalRows) ? totalRows[0]?.total ?? 0 : totalRows?.[0]?.total ?? 0;

    const rows = q
      ? await sql`SELECT id, plate, model, brand, year, odometer, chassis, renavam, color, cost_center, goal,
                    axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership,
                    created_at, updated_at
                  FROM vehicles
                  WHERE plate ILIKE ${'%' + q + '%'} OR model ILIKE ${'%' + q + '%'} OR brand ILIKE ${'%' + q + '%'}
                  ORDER BY created_at DESC
                  LIMIT ${pageSize} OFFSET ${offset}`
      : await sql`SELECT id, plate, model, brand, year, odometer, chassis, renavam, color, cost_center, goal,
                    axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership,
                    created_at, updated_at
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
