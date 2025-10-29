import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/service-orders - Lista todas as ordens de serviço
export async function GET(request: NextRequest) {

  try {

    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const vehicle_id = searchParams.get('vehicle_id');
    const mechanic_id = searchParams.get('mechanic_id');

    let orders;
    
    // Build query with filters using template literals
    if (status && vehicle_id && mechanic_id) {
      orders = await sql`
        SELECT id, number, vehicle_id, mechanic_id, supervisor_id,
               type, priority, status, description,
               created_at, scheduled_date, started_at, finished_at,
               total_cost, labor_hours, labor_cost, parts_cost
        FROM service_orders
        WHERE status = ${status} AND vehicle_id = ${parseInt(vehicle_id)} AND mechanic_id = ${parseInt(mechanic_id)}
        ORDER BY created_at DESC
      `;
    } else if (status && vehicle_id) {
      orders = await sql`
        SELECT id, number, vehicle_id, mechanic_id, supervisor_id,
               type, priority, status, description,
               created_at, scheduled_date, started_at, finished_at,
               total_cost, labor_hours, labor_cost, parts_cost
        FROM service_orders
        WHERE status = ${status} AND vehicle_id = ${parseInt(vehicle_id)}
        ORDER BY created_at DESC
      `;
    } else if (status) {
      orders = await sql`
        SELECT id, number, vehicle_id, mechanic_id, supervisor_id,
               type, priority, status, description,
               created_at, scheduled_date, started_at, finished_at,
               total_cost, labor_hours, labor_cost, parts_cost
        FROM service_orders
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else if (vehicle_id) {
      orders = await sql`
        SELECT id, number, vehicle_id, mechanic_id, supervisor_id,
               type, priority, status, description,
               created_at, scheduled_date, started_at, finished_at,
               total_cost, labor_hours, labor_cost, parts_cost
        FROM service_orders
        WHERE vehicle_id = ${parseInt(vehicle_id)}
        ORDER BY created_at DESC
      `;
    } else if (mechanic_id) {
      orders = await sql`
        SELECT id, number, vehicle_id, mechanic_id, supervisor_id,
               type, priority, status, description,
               created_at, scheduled_date, started_at, finished_at,
               total_cost, labor_hours, labor_cost, parts_cost
        FROM service_orders
        WHERE mechanic_id = ${parseInt(mechanic_id)}
        ORDER BY created_at DESC
      `;
    } else {
      orders = await sql`
        SELECT id, number, vehicle_id, mechanic_id, supervisor_id,
               type, priority, status, description,
               created_at, scheduled_date, started_at, finished_at,
               total_cost, labor_hours, labor_cost, parts_cost
        FROM service_orders
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Erro ao buscar ordens de serviço:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/service-orders - Cria nova ordem de serviço
export async function POST(request: NextRequest) {

  try {

    const sql = getDb();
    const body = await request.json();
    const {
      vehicle_id,
      mechanic_id,
      supervisor_id,
      type,
      priority = 'media',
      description,
      scheduled_date,
      checklist = []
    } = body;

    if (!vehicle_id || !description || !type) {
      return NextResponse.json(
        { error: 'vehicle_id, description e type são obrigatórios' },
        { status: 400 }
      );
    }

    // Cria a OS
    const [order] = await sql`
      INSERT INTO service_orders (
        vehicle_id, mechanic_id, supervisor_id, type, priority, description, scheduled_date
      ) VALUES (
        ${vehicle_id}, ${mechanic_id || null}, ${supervisor_id || null}, 
        ${type}, ${priority}, ${description}, ${scheduled_date || null}
      )
      RETURNING *
    `;

    // Adiciona checklist se fornecido
    if (checklist.length > 0) {
      for (let i = 0; i < checklist.length; i++) {
        await sql`
          INSERT INTO os_checklist (os_id, task_description, order_index)
          VALUES (${order.id}, ${checklist[i]}, ${i})
        `;
      }
    }

    // Registra histórico
    await sql`
      INSERT INTO os_status_history (os_id, to_status, changed_by)
      VALUES (${order.id}, 'aberta', ${mechanic_id || null})
    `;

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar ordem de serviço:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
