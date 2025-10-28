import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const [maintenance] = await sql`
      SELECT 
        vm.*,
        v.plate as vehicle_plate,
        v.model as vehicle_model
      FROM vehicle_maintenances vm
      LEFT JOIN vehicles v ON v.id = vm.vehicle_id
      WHERE vm.id = ${id}
    `;

    if (!maintenance) {
      return NextResponse.json({ error: 'Manutenção não encontrada' }, { status: 404 });
    }

    // Buscar peças da manutenção
    const parts = await sql`
      SELECT * FROM maintenance_parts
      WHERE maintenance_id = ${id}
      ORDER BY id
    `;

    return NextResponse.json({ ...maintenance, parts });

  } catch (error: any) {
    console.error('Erro ao buscar manutenção:', error);
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
      actual_date,
      actual_odometer,
      technician_name,
      workshop_name,
      labor_cost,
      parts_cost,
      notes
    } = body;

    let total_cost = 0;
    if (labor_cost) total_cost += parseFloat(labor_cost);
    if (parts_cost) total_cost += parseFloat(parts_cost);

    const [maintenance] = await sql`
      UPDATE vehicle_maintenances
      SET
        status = COALESCE(${status}, status),
        actual_date = COALESCE(${actual_date || null}, actual_date),
        actual_odometer = COALESCE(${actual_odometer || null}, actual_odometer),
        technician_name = COALESCE(${technician_name || null}, technician_name),
        workshop_name = COALESCE(${workshop_name || null}, workshop_name),
        labor_cost = COALESCE(${labor_cost || null}, labor_cost),
        parts_cost = COALESCE(${parts_cost || null}, parts_cost),
        total_cost = ${total_cost > 0 ? total_cost : null},
        notes = COALESCE(${notes || null}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!maintenance) {
      return NextResponse.json({ error: 'Manutenção não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Manutenção atualizada',
      maintenance
    });

  } catch (error: any) {
    console.error('Erro ao atualizar manutenção:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Deletar peças primeiro (FK constraint)
    await sql`DELETE FROM maintenance_parts WHERE maintenance_id = ${id}`;

    const [deleted] = await sql`
      DELETE FROM vehicle_maintenances
      WHERE id = ${id}
      RETURNING id
    `;

    if (!deleted) {
      return NextResponse.json({ error: 'Manutenção não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Manutenção deletada' });

  } catch (error: any) {
    console.error('Erro ao deletar manutenção:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}