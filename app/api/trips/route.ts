import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/trips - Listar viagens
export async function GET(request: NextRequest) {

  try {

    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const driver_name = searchParams.get('driver_name');
    const limit = parseInt(searchParams.get('limit') || '50');

    let trips;

    if (status && driver_name) {
      trips = await sql`
        SELECT * FROM trips
        WHERE status = ${status} AND driver_name = ${driver_name}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else if (status) {
      trips = await sql`
        SELECT * FROM trips
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else if (driver_name) {
      trips = await sql`
        SELECT * FROM trips
        WHERE driver_name = ${driver_name}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      trips = await sql`
        SELECT * FROM trips
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }

    return NextResponse.json(trips);
  } catch (error: any) {
    console.error('Erro ao buscar viagens:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/trips - Criar viagem
export async function POST(request: NextRequest) {

  try {

    const sql = getDb();
    const body = await request.json();
    const {
      trip_number,
      customer_name,
      vehicle_plate,
      driver_name,
      origin_city,
      origin_state,
      destination_city,
      destination_state,
      cargo_description,
      cargo_weight,
      departure_date,
      estimated_arrival,
      distance_km,
      freight_value,
      driver_payment
    } = body;

    if (!trip_number || !origin_city || !destination_city) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: trip_number, origin_city, destination_city' },
        { status: 400 }
      );
    }

    const [trip] = await sql`
      INSERT INTO trips (
        trip_number, customer_name, vehicle_plate, driver_name,
        origin_city, origin_state, destination_city, destination_state,
        cargo_description, cargo_weight, departure_date, estimated_arrival,
        distance_km, freight_value, driver_payment, status
      ) VALUES (
        ${trip_number}, ${customer_name || null}, ${vehicle_plate || null}, ${driver_name || null},
        ${origin_city}, ${origin_state || null}, ${destination_city}, ${destination_state || null},
        ${cargo_description || null}, ${cargo_weight || null}, ${departure_date || null}, ${estimated_arrival || null},
        ${distance_km || null}, ${freight_value || null}, ${driver_payment || null}, 'planned'
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Viagem criada com sucesso',
      trip
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar viagem:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
