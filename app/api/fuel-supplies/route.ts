import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/fuel-supplies - Lista abastecimentos
export async function GET(request: NextRequest) {

  try {

    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get('vehicle_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let supplies;

    if (vehicle_id) {
      supplies = await sql`
        SELECT 
          fs.*,
          v.plate as vehicle_plate,
          d.name as driver_name
        FROM fuel_supplies fs
        LEFT JOIN vehicles v ON v.id = fs.vehicle_id
        LEFT JOIN drivers d ON d.id = fs.driver_id
        WHERE fs.vehicle_id = ${parseInt(vehicle_id)}
        ORDER BY fs.supply_date DESC
        LIMIT ${limit}
      `;
    } else {
      supplies = await sql`
        SELECT 
          fs.*,
          v.plate as vehicle_plate,
          d.name as driver_name
        FROM fuel_supplies fs
        LEFT JOIN vehicles v ON v.id = fs.vehicle_id
        LEFT JOIN drivers d ON d.id = fs.driver_id
        ORDER BY fs.supply_date DESC
        LIMIT ${limit}
      `;
    }

    return NextResponse.json(supplies);
  } catch (error: any) {
    console.error('Erro ao buscar abastecimentos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/fuel-supplies - Registrar abastecimento
export async function POST(request: NextRequest) {

  try {

    const sql = getDb();
    const body = await request.json();
    const {
      vehicle_id,
      driver_id,
      odometer,
      liters,
      unit_price,
      fuel_type,
      station_name,
      payment_method,
      notes
    } = body;

    if (!vehicle_id || !odometer || !liters || !unit_price) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: vehicle_id, odometer, liters, unit_price' },
        { status: 400 }
      );
    }

    const total_value = liters * unit_price;

    const [supply] = await sql`
      INSERT INTO fuel_supplies (
        vehicle_id, driver_id, odometer, liters, unit_price, total_value,
        fuel_type, station_name, payment_method, notes
      ) VALUES (
        ${vehicle_id}, ${driver_id || null}, ${odometer}, ${liters}, ${unit_price}, ${total_value},
        ${fuel_type || 'diesel'}, ${station_name || null}, ${payment_method || 'cash'}, ${notes || null}
      )
      RETURNING *
    `;

    // Atualizar odômetro do veículo
    await sql`
      UPDATE vehicles
      SET odometer = ${odometer}
      WHERE id = ${vehicle_id}
    `;

    return NextResponse.json({
      message: 'Abastecimento registrado com sucesso',
      supply
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao registrar abastecimento:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}