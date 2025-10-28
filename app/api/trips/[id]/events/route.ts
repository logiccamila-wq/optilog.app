import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/trips/[id]/events - Motorista registra evento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);
    const body = await request.json();
    
    const {
      driver_name,
      event_type,
      latitude,
      longitude,
      location_address,
      notes,
      photo_urls
    } = body;

    if (!event_type) {
      return NextResponse.json(
        { error: 'Campo obrigatório: event_type' },
        { status: 400 }
      );
    }

    // Validar tipos de eventos permitidos
    const validTypes = [
      'inicio', 'chegada', 'espera', 'descarga', 'fim',
      'retorno', 'garagem', 'parada_refeicao', 'pernoite', 'desvio_rota'
    ];

    if (!validTypes.includes(event_type)) {
      return NextResponse.json(
        { error: `Tipo de evento inválido. Use: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const [event] = await sql`
      INSERT INTO trip_events (
        trip_id, driver_name, event_type, latitude, longitude,
        location_address, notes, photo_urls
      ) VALUES (
        ${trip_id}, ${driver_name || null}, ${event_type}, ${latitude || null}, ${longitude || null},
        ${location_address || null}, ${notes || null}, ${photo_urls ? JSON.stringify(photo_urls) : null}
      )
      RETURNING *
    `;

    // Atualizar status da viagem baseado no evento
    if (event_type === 'inicio') {
      await sql`UPDATE trips SET status = 'in_progress' WHERE id = ${trip_id}`;
    } else if (event_type === 'fim') {
      await sql`UPDATE trips SET status = 'completed', actual_arrival = NOW() WHERE id = ${trip_id}`;
    }

    return NextResponse.json({
      message: 'Evento registrado com sucesso',
      event
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao registrar evento:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}