import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/service-orders/[id] - Busca uma ordem específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const osId = parseInt(params.id);

    const order = await sql`
      SELECT 
        so.*,
        v.plate as vehicle_plate,
        v.brand as vehicle_brand,
        v.model as vehicle_model,
        m.name as mechanic_name,
        s.name as supervisor_name
      FROM service_orders so
      LEFT JOIN vehicles v ON v.id = so.vehicle_id
      LEFT JOIN users m ON m.id = so.mechanic_id
      LEFT JOIN users s ON s.id = so.supervisor_id
      WHERE so.id = ${osId}
    `;

    if (order.length === 0) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Erro ao buscar OS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/service-orders/[id] - Atualiza uma ordem
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const osId = parseInt(params.id);
    
    const {
      vehicle_id,
      mechanic_id,
      supervisor_id,
      type,
      priority,
      description,
      scheduled_date
    } = body;

    // Verifica se OS existe
    const [existingOS] = await sql`
      SELECT id, status FROM service_orders WHERE id = ${osId}
    `;

    if (!existingOS) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    // Só permite edição se estiver aberta ou aprovada
    if (!['aberta', 'aprovada'].includes(existingOS.status)) {
      return NextResponse.json(
        { error: 'Apenas ordens abertas ou aprovadas podem ser editadas' },
        { status: 400 }
      );
    }

    const [updatedOS] = await sql`
      UPDATE service_orders 
      SET 
        vehicle_id = COALESCE(${vehicle_id}, vehicle_id),
        mechanic_id = COALESCE(${mechanic_id}, mechanic_id),
        supervisor_id = COALESCE(${supervisor_id}, supervisor_id),
        type = COALESCE(${type}, type),
        priority = COALESCE(${priority}, priority),
        description = COALESCE(${description}, description),
        scheduled_date = COALESCE(${scheduled_date}, scheduled_date),
        updated_at = NOW()
      WHERE id = ${osId}
      RETURNING *
    `;

    return NextResponse.json({
      message: 'OS atualizada com sucesso',
      order: updatedOS
    });

  } catch (error: any) {
    console.error('Erro ao atualizar OS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/service-orders/[id] - Cancela uma ordem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const osId = parseInt(params.id);

    // Verifica se OS existe
    const [existingOS] = await sql`
      SELECT id, status FROM service_orders WHERE id = ${osId}
    `;

    if (!existingOS) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    // Só permite cancelar se não estiver fechada
    if (existingOS.status === 'fechada') {
      return NextResponse.json(
        { error: 'Ordens fechadas não podem ser canceladas' },
        { status: 400 }
      );
    }

    const [canceledOS] = await sql`
      UPDATE service_orders 
      SET status = 'cancelada', updated_at = NOW()
      WHERE id = ${osId}
      RETURNING *
    `;

    // Registra histórico
    await sql`
      INSERT INTO os_status_history (os_id, from_status, to_status, changed_by, notes)
      VALUES (${osId}, ${existingOS.status}, 'cancelada', NULL, 'Cancelada via API')
    `;

    return NextResponse.json({
      message: 'OS cancelada com sucesso',
      order: canceledOS
    });

  } catch (error: any) {
    console.error('Erro ao cancelar OS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}