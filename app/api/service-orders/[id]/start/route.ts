import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/service-orders/[id]/start - Inicia execução de uma OS
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { mechanic_id, estimated_hours } = body;
    const osId = parseInt(params.id);

    if (!mechanic_id) {
      return NextResponse.json(
        { error: 'mechanic_id é obrigatório' },
        { status: 400 }
      );
    }

    // Verifica se OS existe e está aprovada
    const [existingOS] = await sql`
      SELECT id, status FROM service_orders WHERE id = ${osId}
    `;

    if (!existingOS) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    if (existingOS.status !== 'aprovada') {
      return NextResponse.json(
        { error: 'Apenas ordens aprovadas podem ser iniciadas' },
        { status: 400 }
      );
    }

    // Atualiza status para em execução
    const [updatedOS] = await sql`
      UPDATE service_orders 
      SET 
        status = 'em_execucao', 
        mechanic_id = ${mechanic_id}, 
        started_at = NOW(),
        estimated_hours = ${estimated_hours || null}
      WHERE id = ${osId}
      RETURNING *
    `;

    // Registra histórico
    await sql`
      INSERT INTO os_status_history (os_id, from_status, to_status, changed_by)
      VALUES (${osId}, 'aprovada', 'em_execucao', ${mechanic_id})
    `;

    return NextResponse.json({
      message: 'OS iniciada com sucesso',
      order: updatedOS
    });

  } catch (error: any) {
    console.error('Erro ao iniciar OS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}