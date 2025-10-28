import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const [trip] = await sql`
      SELECT * FROM trips WHERE id = ${id}
    `;

    if (!trip) {
      return NextResponse.json({ error: 'Viagem não encontrada' }, { status: 404 });
    }

    // Buscar dados relacionados
    const [events, expenses, checklists, messages, gps] = await Promise.all([
      sql`SELECT * FROM trip_events WHERE trip_id = ${id} ORDER BY event_date DESC`,
      sql`SELECT * FROM trip_expenses WHERE trip_id = ${id} ORDER BY expense_date DESC`,
      sql`SELECT * FROM trip_checklists WHERE trip_id = ${id} ORDER BY checklist_date DESC`,
      sql`SELECT * FROM trip_messages WHERE trip_id = ${id} ORDER BY created_at ASC`,
      sql`SELECT * FROM gps_tracking WHERE trip_id = ${id} ORDER BY timestamp DESC LIMIT 100`
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