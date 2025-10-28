import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/trips/[id]/checklist - Motorista envia checklist
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trip_id = parseInt(params.id);
    const body = await request.json();
    
    const {
      driver_name,
      vehicle_plate,
      items,
      issues_reported,
      photos,
      signature_url
    } = body;

    if (!items) {
      return NextResponse.json(
        { error: 'Campo obrigatório: items (objeto JSON com checklist)' },
        { status: 400 }
      );
    }

    // Detectar se há problemas
    const has_issues = !!issues_reported && issues_reported.trim().length > 0;

    const [checklist] = await sql`
      INSERT INTO trip_checklists (
        trip_id, driver_name, vehicle_plate, items, has_issues,
        issues_reported, photos, signature_url,
        sent_to_vlademir, sent_to_enio
      ) VALUES (
        ${trip_id}, ${driver_name || null}, ${vehicle_plate || null}, 
        ${JSON.stringify(items)}, ${has_issues},
        ${issues_reported || null}, ${photos ? JSON.stringify(photos) : null}, 
        ${signature_url || null},
        ${has_issues}, ${has_issues}
      )
      RETURNING *
    `;

    let message = 'Checklist registrado com sucesso';
    if (has_issues) {
      message += ' - Problemas enviados para Vlademir (Encarregado) e Enio Gomes (Diretor Operacional)';
    }

    return NextResponse.json({
      message,
      checklist,
      alert: has_issues ? 'Problemas detectados! Notificações enviadas.' : null
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao registrar checklist:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}