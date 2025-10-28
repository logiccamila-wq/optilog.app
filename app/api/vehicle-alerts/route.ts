import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/vehicle-alerts - Listar alertas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get('vehicle_id');
    const status = searchParams.get('status') || 'pending';

    let alerts;

    if (vehicle_id) {
      alerts = await sql`
        SELECT 
          va.*,
          v.plate as vehicle_plate,
          v.model as vehicle_model
        FROM vehicle_alerts va
        LEFT JOIN vehicles v ON v.id = va.vehicle_id
        WHERE va.vehicle_id = ${parseInt(vehicle_id)}
          AND va.status = ${status}
        ORDER BY va.due_date ASC
      `;
    } else {
      alerts = await sql`
        SELECT 
          va.*,
          v.plate as vehicle_plate,
          v.model as vehicle_model
        FROM vehicle_alerts va
        LEFT JOIN vehicles v ON v.id = va.vehicle_id
        WHERE va.status = ${status}
        ORDER BY va.due_date ASC
      `;
    }

    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error('Erro ao buscar alertas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/vehicle-alerts - Criar alerta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicle_id,
      alert_type,
      description,
      due_date,
      document_number,
      cost
    } = body;

    if (!vehicle_id || !alert_type || !due_date) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: vehicle_id, alert_type, due_date' },
        { status: 400 }
      );
    }

    const [alert] = await sql`
      INSERT INTO vehicle_alerts (
        vehicle_id, alert_type, description, due_date, 
        document_number, cost, status
      ) VALUES (
        ${vehicle_id}, ${alert_type}, ${description || null}, ${due_date},
        ${document_number || null}, ${cost || null}, 'pending'
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Alerta criado',
      alert
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar alerta:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}