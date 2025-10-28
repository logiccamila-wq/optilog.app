import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/service-orders/[id]/parts - Adiciona peças utilizadas numa OS
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { parts } = body; // Array de { part_name, quantity, unit_price, total_price }
    const osId = parseInt(params.id);

    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      return NextResponse.json(
        { error: 'Lista de peças é obrigatória' },
        { status: 400 }
      );
    }

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

    // Adiciona as peças
    const insertedParts = [];
    let totalPartsValue = 0;

    for (const part of parts) {
      const { part_name, quantity, unit_price, total_price } = part;
      
      if (!part_name || !quantity || !unit_price) {
        return NextResponse.json(
          { error: 'part_name, quantity e unit_price são obrigatórios para cada peça' },
          { status: 400 }
        );
      }

      const finalTotalPrice = total_price || (quantity * unit_price);
      totalPartsValue += finalTotalPrice;

      const [insertedPart] = await sql`
        INSERT INTO os_parts (os_id, part_name, quantity, unit_price, total_price)
        VALUES (${osId}, ${part_name}, ${quantity}, ${unit_price}, ${finalTotalPrice})
        RETURNING *
      `;

      insertedParts.push(insertedPart);
    }

    // Atualiza custo de peças na OS
    await sql`
      UPDATE service_orders 
      SET parts_cost = COALESCE(parts_cost, 0) + ${totalPartsValue}
      WHERE id = ${osId}
    `;

    return NextResponse.json({
      message: 'Peças adicionadas com sucesso',
      parts: insertedParts,
      total_added: totalPartsValue
    });

  } catch (error: any) {
    console.error('Erro ao adicionar peças:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/service-orders/[id]/parts - Lista peças de uma OS
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const osId = parseInt(params.id);

    const parts = await sql`
      SELECT * FROM os_parts 
      WHERE os_id = ${osId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(parts);

  } catch (error: any) {
    console.error('Erro ao buscar peças:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}