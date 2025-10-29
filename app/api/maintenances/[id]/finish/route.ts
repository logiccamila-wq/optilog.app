import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// Finalizar manutenção
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { actual_odometer, labor_cost, parts_cost, notes, parts } = body;

    const [current] = await sql`
      SELECT status, vehicle_id FROM vehicle_maintenances WHERE id = ${id}
    `;

    if (!current) {
      return NextResponse.json({ error: 'Manutenção não encontrada' }, { status: 404 });
    }

    if (current.status !== 'in_progress') {
      return NextResponse.json(
        { error: `Não é possível finalizar manutenção no status: ${current.status}` },
        { status: 400 }
      );
    }

    // Calcular custo total
    let total_cost = 0;
    if (labor_cost) total_cost += parseFloat(labor_cost);
    if (parts_cost) total_cost += parseFloat(parts_cost);

    // Adicionar peças se fornecidas
    if (parts && Array.isArray(parts)) {
      for (const part of parts) {
        await sql`
          INSERT INTO maintenance_parts (
            maintenance_id, part_name, quantity, unit_price, total_price
          ) VALUES (
            ${id}, ${part.name}, ${part.quantity}, ${part.unit_price}, ${part.quantity * part.unit_price}
          )
        `;
        total_cost += part.quantity * part.unit_price;
      }
    }

    const [maintenance] = await sql`
      UPDATE vehicle_maintenances
      SET
        status = 'completed',
        actual_odometer = ${actual_odometer || null},
        labor_cost = ${labor_cost || null},
        parts_cost = ${parts_cost || null},
        total_cost = ${total_cost},
        notes = ${notes || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    // Atualizar odômetro do veículo se fornecido
    if (actual_odometer && current.vehicle_id) {
      await sql`
        UPDATE vehicles
        SET odometer = ${actual_odometer}
        WHERE id = ${current.vehicle_id}
      `;
    }

    return NextResponse.json({
      message: 'Manutenção finalizada',
      maintenance
    });

  } catch (error: any) {
    console.error('Erro ao finalizar manutenção:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}