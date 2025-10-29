import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

// Optimized: Use centralized database connection
const sql = getSql();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Optimized: Select only needed columns
    const [trip] = await sql`
      SELECT 
        id, trip_number, customer_name, vehicle_plate, driver_name,
        origin_city, origin_state, destination_city, destination_state,
        cargo_description, cargo_weight, status, departure_date,
        estimated_arrival, actual_arrival, distance_km, freight_value,
        driver_payment, notes, created_at, updated_at
      FROM trips WHERE id = ${id}
    `;

    if (!trip) {
      return NextResponse.json({ error: 'Viagem não encontrada' }, { status: 404 });
    }

    // Optimized: Fetch related data with specific columns and use Promise.all for parallel execution
    const [events, expenses, checklists, messages, gps] = await Promise.all([
      sql`
        SELECT id, trip_id, event_type, event_date, description, created_at 
        FROM trip_events 
        WHERE trip_id = ${id} 
        ORDER BY event_date DESC
      `,
      sql`
        SELECT id, trip_id, expense_type, amount, expense_date, description, created_at 
        FROM trip_expenses 
        WHERE trip_id = ${id} 
        ORDER BY expense_date DESC
      `,
      sql`
        SELECT id, trip_id, checklist_type, status, checklist_date, created_at 
        FROM trip_checklists 
        WHERE trip_id = ${id} 
        ORDER BY checklist_date DESC
      `,
      sql`
        SELECT id, trip_id, message, sender, created_at 
        FROM trip_messages 
        WHERE trip_id = ${id} 
        ORDER BY created_at ASC
      `,
      sql`
        SELECT id, trip_id, latitude, longitude, speed, timestamp 
        FROM gps_tracking 
        WHERE trip_id = ${id} 
        ORDER BY timestamp DESC 
        LIMIT 100
      `
    ]);

    return NextResponse.json({
      ...trip,
      events,
      expenses,
      checklists,
      messages,
      gps_positions: gps
    });

  } catch (error: any) {
    console.error('Erro ao buscar viagem:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const {
      status,
      actual_arrival,
      freight_value,
      driver_payment,
      notes
    } = body;

    const [trip] = await sql`
      UPDATE trips
      SET
        status = COALESCE(${status || null}, status),
        actual_arrival = COALESCE(${actual_arrival || null}, actual_arrival),
        freight_value = COALESCE(${freight_value || null}, freight_value),
        driver_payment = COALESCE(${driver_payment || null}, driver_payment),
        notes = COALESCE(${notes || null}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!trip) {
      return NextResponse.json({ error: 'Viagem não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Viagem atualizada',
      trip
    });

  } catch (error: any) {
    console.error('Erro ao atualizar viagem:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}