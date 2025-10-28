import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/trips/[id]/expenses - Motorista registra despesa
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);
    const body = await request.json();
    
    const {
      driver_name,
      expense_type,
      description,
      amount,
      payment_method,
      receipt_url,
      latitude,
      longitude,
      cost_center
    } = body;

    if (!expense_type || !amount) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: expense_type, amount' },
        { status: 400 }
      );
    }

    const [expense] = await sql`
      INSERT INTO trip_expenses (
        trip_id, driver_name, expense_type, description, amount,
        payment_method, receipt_url, latitude, longitude, cost_center,
        sent_to_financial, sent_to_dre
      ) VALUES (
        ${trip_id}, ${driver_name || null}, ${expense_type}, ${description || null}, ${amount},
        ${payment_method || 'cash'}, ${receipt_url || null}, ${latitude || null}, ${longitude || null},
        ${cost_center || 'VIAGENS'}, true, true
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Despesa registrada e enviada para Financeiro e DRE',
      expense
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao registrar despesa:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/trips/[id]/expenses - Aprovar despesa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);
    const body = await request.json();
    
    const { expense_id, approved_by } = body;

    const [expense] = await sql`
      UPDATE trip_expenses
      SET
        approved = true,
        approved_by = ${approved_by},
        approved_at = NOW()
      WHERE id = ${expense_id} AND trip_id = ${trip_id}
      RETURNING *
    `;

    if (!expense) {
      return NextResponse.json({ error: 'Despesa não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Despesa aprovada',
      expense
    });

  } catch (error: any) {
    console.error('Erro ao aprovar despesa:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}