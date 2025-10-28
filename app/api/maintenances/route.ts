import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/maintenances - Lista manutenções
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get('vehicle_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let maintenances;

    if (vehicle_id && status) {
      maintenances = await sql`
        SELECT 
          vm.*,
          v.plate as vehicle_plate,
          v.model as vehicle_model
        FROM vehicle_maintenances vm
        LEFT JOIN vehicles v ON v.id = vm.vehicle_id
        WHERE vm.vehicle_id = ${parseInt(vehicle_id)}
          AND vm.status = ${status}
        ORDER BY vm.created_at DESC
        LIMIT ${limit}
      `;
    } else if (vehicle_id) {
      maintenances = await sql`
        SELECT 
          vm.*,
          v.plate as vehicle_plate,
          v.model as vehicle_model
        FROM vehicle_maintenances vm
        LEFT JOIN vehicles v ON v.id = vm.vehicle_id
        WHERE vm.vehicle_id = ${parseInt(vehicle_id)}
        ORDER BY vm.created_at DESC
        LIMIT ${limit}
      `;
    } else if (status) {
      maintenances = await sql`
        SELECT 
          vm.*,
          v.plate as vehicle_plate,
          v.model as vehicle_model
        FROM vehicle_maintenances vm
        LEFT JOIN vehicles v ON v.id = vm.vehicle_id
        WHERE vm.status = ${status}
        ORDER BY vm.created_at DESC
        LIMIT ${limit}
      `;
    } else {
      maintenances = await sql`
        SELECT 
          vm.*,
          v.plate as vehicle_plate,
          v.model as vehicle_model
        FROM vehicle_maintenances vm
        LEFT JOIN vehicles v ON v.id = vm.vehicle_id
        ORDER BY vm.created_at DESC
        LIMIT ${limit}
      `;
    }

    return NextResponse.json(maintenances);
  } catch (error: any) {
    console.error('Erro ao buscar manutenções:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/maintenances - Criar manutenção
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicle_id,
      maintenance_type,
      description,
      scheduled_date,
      scheduled_odometer,
      priority
    } = body;

    if (!vehicle_id || !maintenance_type || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: vehicle_id, maintenance_type, description' },
        { status: 400 }
      );
    }

    const [maintenance] = await sql`
      INSERT INTO vehicle_maintenances (
        vehicle_id, maintenance_type, description, scheduled_date, 
        scheduled_odometer, status, priority
      ) VALUES (
        ${vehicle_id}, ${maintenance_type}, ${description}, ${scheduled_date || null},
        ${scheduled_odometer || null}, 'scheduled', ${priority || 'medium'}
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Manutenção agendada com sucesso',
      maintenance
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar manutenção:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}