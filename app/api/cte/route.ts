import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/cte - Lista CTes
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let ctes;

    if (status) {
      ctes = await sql`
        SELECT 
          c.id, c.cte_number, c.series, c.access_key, c.emission_date,
          c.issuer_name, c.sender_name, c.recipient_name, c.total_value,
          c.status, c.vehicle_plate, c.driver_name
        FROM cte_documents c
        WHERE status = ${status}
        ORDER BY emission_date DESC
        LIMIT 100
      `;
    } else {
      ctes = await sql`
        SELECT 
          c.id, c.cte_number, c.series, c.access_key, c.emission_date,
          c.issuer_name, c.sender_name, c.recipient_name, c.total_value,
          c.status, c.vehicle_plate, c.driver_name
        FROM cte_documents c
        ORDER BY emission_date DESC
        LIMIT 100
      `;
    }

    return NextResponse.json(ctes);
  } catch (error: any) {
    console.error('Erro ao buscar CTes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/cte - Criar CTe
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();
    const {
      cte_number,
      access_key,
      issuer_cnpj,
      issuer_name,
      sender_document,
      sender_name,
      sender_city,
      sender_state,
      recipient_document,
      recipient_name,
      recipient_city,
      recipient_state,
      payer_type,
      freight_value,
      total_value,
      cargo_description,
      cargo_weight_kg,
      vehicle_plate,
      driver_name,
      cargo_items = [],
      freight_components = []
    } = body;

    // Validações
    if (!cte_number || !access_key || !issuer_cnpj || !sender_document || !recipient_document) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Criar CTe
    const [cte] = await sql`
      INSERT INTO cte_documents (
        cte_number, access_key, issuer_cnpj, issuer_name,
        sender_document, sender_name, sender_city, sender_state,
        recipient_document, recipient_name, recipient_city, recipient_state,
        payer_type, freight_value, total_value, cargo_description, cargo_weight_kg,
        vehicle_plate, driver_name, status
      ) VALUES (
        ${cte_number}, ${access_key}, ${issuer_cnpj}, ${issuer_name},
        ${sender_document}, ${sender_name}, ${sender_city || null}, ${sender_state || null},
        ${recipient_document}, ${recipient_name}, ${recipient_city || null}, ${recipient_state || null},
        ${payer_type || 'sender'}, ${freight_value}, ${total_value},
        ${cargo_description || null}, ${cargo_weight_kg || null},
        ${vehicle_plate || null}, ${driver_name || null}, 'draft'
      )
      RETURNING *
    `;

    // Adicionar itens de carga
    for (let i = 0; i < cargo_items.length; i++) {
      const item = cargo_items[i];
      await sql`
        INSERT INTO cte_cargo_items (
          cte_id, item_sequence, product_description, quantity, unit_value, total_value
        ) VALUES (
          ${cte.id}, ${i + 1}, ${item.product_description},
          ${item.quantity || 1}, ${item.unit_value || 0}, ${item.total_value || 0}
        )
      `;
    }

    // Adicionar componentes do frete
    for (const component of freight_components) {
      await sql`
        INSERT INTO cte_freight_components (cte_id, component_name, component_value)
        VALUES (${cte.id}, ${component.name}, ${component.value})
      `;
    }

    // Registrar evento de emissão
    await sql`
      INSERT INTO cte_events (cte_id, event_type, event_description)
      VALUES (${cte.id}, 'emission', 'CTe criado no sistema')
    `;

    return NextResponse.json({
      message: 'CTe criado com sucesso',
      cte
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar CTe:', error);
    
    if (error.message.includes('unique_cte')) {
      return NextResponse.json(
        { error: 'CTe já existe no sistema' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}