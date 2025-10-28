import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/service-orders/[id]/finish - Finaliza uma OS
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      mechanic_id, 
      labor_hours, 
      labor_cost, 
      parts_cost, 
      total_cost, 
      completion_notes,
      quality_check = false
    } = body;
    const osId = parseInt(params.id);

    if (!mechanic_id || !labor_hours) {
      return NextResponse.json(
        { error: 'mechanic_id e labor_hours são obrigatórios' },
        { status: 400 }
      );
    }

    // Verifica se OS existe e está em execução
    const [existingOS] = await sql`
      SELECT id, status FROM service_orders WHERE id = ${osId}
    `;

    if (!existingOS) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    if (existingOS.status !== 'em_execucao') {
      return NextResponse.json(
        { error: 'Apenas ordens em execução podem ser finalizadas' },
        { status: 400 }
      );
    }

    // Calcula custo total se não fornecido
    const finalTotalCost = total_cost || (labor_cost || 0) + (parts_cost || 0);

    // Atualiza status para fechada
    const [updatedOS] = await sql`
      UPDATE service_orders 
      SET 
        status = 'fechada',
        finished_at = NOW(),
        labor_hours = ${labor_hours},
        labor_cost = ${labor_cost || null},
        parts_cost = ${parts_cost || null},
        total_cost = ${finalTotalCost},
        completion_notes = ${completion_notes || null},
        quality_check = ${quality_check}
      WHERE id = ${osId}
      RETURNING *
    `;

    // Registra histórico
    await sql`
      INSERT INTO os_status_history (os_id, from_status, to_status, changed_by, notes)
      VALUES (${osId}, 'em_execucao', 'fechada', ${mechanic_id}, ${completion_notes || null})
    `;

    return NextResponse.json({
      message: 'OS finalizada com sucesso',
      order: updatedOS
    });

  } catch (error: any) {
    console.error('Erro ao finalizar OS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}