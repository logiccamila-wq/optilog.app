import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Resolver alerta (marcar como resolvido)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { resolved_notes, actual_cost } = body;

    const [alert] = await sql`
      UPDATE vehicle_alerts
      SET
        status = 'resolved',
        resolved_date = NOW(),
        resolved_notes = ${resolved_notes || null},
        cost = COALESCE(${actual_cost || null}, cost),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!alert) {
      return NextResponse.json({ error: 'Alerta não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Alerta resolvido',
      alert
    });

  } catch (error: any) {
    console.error('Erro ao resolver alerta:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}