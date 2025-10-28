import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Iniciar manutenção
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { technician_name, workshop_name } = body;

    const [current] = await sql`
      SELECT status FROM vehicle_maintenances WHERE id = ${id}
    `;

    if (!current) {
      return NextResponse.json({ error: 'Manutenção não encontrada' }, { status: 404 });
    }

    if (current.status !== 'scheduled') {
      return NextResponse.json(
        { error: `Não é possível iniciar manutenção no status: ${current.status}` },
        { status: 400 }
      );
    }

    const [maintenance] = await sql`
      UPDATE vehicle_maintenances
      SET
        status = 'in_progress',
        actual_date = NOW(),
        technician_name = ${technician_name || null},
        workshop_name = ${workshop_name || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Manutenção iniciada',
      maintenance
    });

  } catch (error: any) {
    console.error('Erro ao iniciar manutenção:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}