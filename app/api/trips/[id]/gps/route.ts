import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// POST /api/trips/[id]/gps - Motorista envia posição GPS
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);
    const body = await request.json();
    
    const {
      vehicle_plate,
      latitude,
      longitude,
      speed,
      heading,
      altitude,
      accuracy,
      battery_level
    } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: latitude, longitude' },
        { status: 400 }
      );
    }

    const [gps] = await sql`
      INSERT INTO gps_tracking (
        trip_id, vehicle_plate, latitude, longitude, speed,
        heading, altitude, accuracy, battery_level
      ) VALUES (
        ${trip_id}, ${vehicle_plate || null}, ${latitude}, ${longitude}, ${speed || null},
        ${heading || null}, ${altitude || null}, ${accuracy || null}, ${battery_level || null}
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Posição GPS registrada',
      gps
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao registrar GPS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/trips/[id]/gps - Buscar histórico GPS
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const positions = await sql`
      SELECT * FROM gps_tracking
      WHERE trip_id = ${trip_id}
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `;

    return NextResponse.json(positions);

  } catch (error: any) {
    console.error('Erro ao buscar GPS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}