import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/trips/[id]/chat - Buscar mensagens
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);

    const messages = await sql`
      SELECT * FROM trip_messages
      WHERE trip_id = ${trip_id}
      ORDER BY created_at ASC
    `;

    return NextResponse.json(messages);

  } catch (error: any) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/trips/[id]/chat - Enviar mensagem
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);
    const body = await request.json();
    
    const {
      sender_name,
      sender_role,
      recipient_name,
      message,
      message_type,
      attachment_url
    } = body;

    if (!sender_name || !message) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: sender_name, message' },
        { status: 400 }
      );
    }

    const [msg] = await sql`
      INSERT INTO trip_messages (
        trip_id, sender_name, sender_role, recipient_name,
        message, message_type, attachment_url
      ) VALUES (
        ${trip_id}, ${sender_name}, ${sender_role || 'motorista'}, ${recipient_name || 'Vlademir'},
        ${message}, ${message_type || 'text'}, ${attachment_url || null}
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Mensagem enviada',
      data: msg
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/trips/[id]/chat - Marcar mensagens como lidas
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);
    const body = await request.json();
    const { message_ids } = body;

    if (!message_ids || !Array.isArray(message_ids)) {
      return NextResponse.json(
        { error: 'Campo obrigatório: message_ids (array)' },
        { status: 400 }
      );
    }

    for (const msg_id of message_ids) {
      await sql`
        UPDATE trip_messages
        SET read = true, read_at = NOW()
        WHERE id = ${msg_id} AND trip_id = ${trip_id}
      `;
    }

    return NextResponse.json({
      message: 'Mensagens marcadas como lidas'
    });

  } catch (error: any) {
    console.error('Erro ao marcar mensagens:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}