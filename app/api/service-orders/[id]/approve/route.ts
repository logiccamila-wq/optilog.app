import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// POST /api/service-orders/[id]/approve - Aprova uma OS
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { supervisor_id, notes } = body;
    const osId = parseInt(params.id);

    if (!supervisor_id) {
      return NextResponse.json(
        { error: 'supervisor_id é obrigatório' },
        { status: 400 }
      );
    }

    // Verifica se OS existe e está no status correto
    const [existingOS] = await sql`
      SELECT id, status FROM service_orders WHERE id = ${osId}
    `;

    if (!existingOS) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    if (existingOS.status !== 'aberta') {
      return NextResponse.json(
        { error: 'Apenas ordens abertas podem ser aprovadas' },
        { status: 400 }
      );
    }

    // Atualiza status para aprovada
    const [updatedOS] = await sql`
      UPDATE service_orders 
      SET status = 'aprovada', supervisor_id = ${supervisor_id}, approved_at = NOW()
      WHERE id = ${osId}
      RETURNING *
    `;

    // Registra histórico
    await sql`
      INSERT INTO os_status_history (os_id, from_status, to_status, changed_by, notes)
      VALUES (${osId}, 'aberta', 'aprovada', ${supervisor_id}, ${notes || null})
    `;

    return NextResponse.json({
      message: 'OS aprovada com sucesso',
      order: updatedOS
    });

  } catch (error: any) {
    console.error('Erro ao aprovar OS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}