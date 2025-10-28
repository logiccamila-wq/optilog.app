import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/service-orders/[id]/history - Histórico de mudanças de status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const osId = parseInt(params.id);

    const history = await sql`
      SELECT 
        osh.*,
        u.name as changed_by_name
      FROM os_status_history osh
      LEFT JOIN users u ON u.id = osh.changed_by
      WHERE osh.os_id = ${osId}
      ORDER BY osh.created_at ASC
    `;

    return NextResponse.json(history);

  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/service-orders/[id]/history - Adiciona entrada manual no histórico
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { notes, changed_by } = body;
    const osId = parseInt(params.id);

    if (!changed_by || !notes) {
      return NextResponse.json(
        { error: 'changed_by e notes são obrigatórios' },
        { status: 400 }
      );
    }

    // Busca status atual
    const [currentOS] = await sql`
      SELECT status FROM service_orders WHERE id = ${osId}
    `;

    if (!currentOS) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    // Adiciona entrada de histórico
    const [historyEntry] = await sql`
      INSERT INTO os_status_history (os_id, from_status, to_status, changed_by, notes)
      VALUES (${osId}, ${currentOS.status}, ${currentOS.status}, ${changed_by}, ${notes})
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Entrada adicionada ao histórico',
      entry: historyEntry
    });

  } catch (error: any) {
    console.error('Erro ao adicionar ao histórico:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}