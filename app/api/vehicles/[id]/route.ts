import { NextRequest, NextResponse } from 'next/server';
import { getSql, isDatabaseConfigured } from '@/lib/db';
import { publishEvent } from '@/lib/integration';

export const runtime = 'nodejs';

// Compartilha mock com a rota principal (em ambiente sem DB)
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

async function ensureSchema(sql: any) {
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
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 });
    }

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
      const idx = mockVehicles.findIndex((v) => v.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
      }
      // Impede duplicação de placa
      if (mockVehicles.some((v) => v.plate === plate && v.id !== id)) {
        return NextResponse.json({ error: 'Placa já cadastrada' }, { status: 409 });
      }
      mockVehicles[idx] = {
        ...mockVehicles[idx],
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
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json({ ok: true, vehicle: mockVehicles[idx], _mock: true }, { status: 200 });
    }

    const sql = getSql();
    await ensureSchema(sql);

    try {
      const rows = await sql`update vehicles
                              set plate = ${plate},
                                  model = ${model || null},
                                  brand = ${brand || null},
                                  year = ${year},
                                  odometer = ${odometer},
                                  chassis = ${chassis},
                                  renavam = ${renavam},
                                  color = ${color},
                                  cost_center = ${cost_center},
                                  goal = ${goal},
                                  axles_count = ${axles_count},
                                  axle_config_name = ${axle_config_name},
                                  axle_weights = ${axle_weights ? JSON.stringify(axle_weights) : null},
                                  gross_weight_estimated = ${gross_weight_estimated},
                                  tire_type = ${tire_type},
                                  tire_dimensions = ${tire_dimensions},
                                  purchase_value = ${purchase_value},
                                  ownership = ${ownership},
                                  updated_at = now()
                              where id = ${id}
                              returning id, plate, model, brand, year, odometer, chassis, renavam, color, cost_center, goal,
                                        axles_count, axle_config_name, axle_weights, gross_weight_estimated, tire_type, tire_dimensions, purchase_value, ownership,
                                        created_at, updated_at`;
      const vehicle = Array.isArray(rows) ? rows[0] : rows?.[0];
      if (!vehicle) {
        return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
      }
      publishEvent({ entity: 'vehicle', action: 'update', data: vehicle }).catch(() => {
        // ignore integration errors
      });
      return NextResponse.json({ ok: true, vehicle }, { status: 200 });
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

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 });
    }

    if (!isDatabaseConfigured()) {
      const idx = mockVehicles.findIndex((v) => v.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
      }
      mockVehicles.splice(idx, 1);
      return NextResponse.json({ ok: true, _mock: true }, { status: 200 });
    }

    const sql = getSql();
    await ensureSchema(sql);

    const rows = await sql`delete from vehicles where id = ${id} returning id`;
    const deleted = Array.isArray(rows) ? rows[0] : rows?.[0];
    if (!deleted) {
      return NextResponse.json({ error: 'Veículo não encontrado' }, { status: 404 });
    }
    publishEvent({ entity: 'vehicle', action: 'delete', data: { id } }).catch(() => {
      // ignore integration errors
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 });
  }
}
