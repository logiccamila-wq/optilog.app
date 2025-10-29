import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/fiscal-documents - Lista documentos fiscais
export async function GET(request: NextRequest) {

  try {

    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let documents;

    if (type && status) {
      documents = await sql`
        SELECT * FROM fiscal_documents_summary
        WHERE document_type = ${type} AND status = ${status}
        ORDER BY emission_date DESC
      `;
    } else if (type) {
      documents = await sql`
        SELECT * FROM fiscal_documents_summary
        WHERE document_type = ${type}
        ORDER BY emission_date DESC
      `;
    } else if (status) {
      documents = await sql`
        SELECT * FROM fiscal_documents_summary
        WHERE status = ${status}
        ORDER BY emission_date DESC
      `;
    } else {
      documents = await sql`
        SELECT * FROM fiscal_documents_summary
        ORDER BY emission_date DESC
        LIMIT 100
      `;
    }

    return NextResponse.json(documents);
  } catch (error: any) {
    console.error('Erro ao buscar documentos fiscais:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/fiscal-documents - Upload de documento fiscal
export async function POST(request: NextRequest) {

  try {

    const sql = getDb();
    const body = await request.json();
    const {
      document_type,
      document_number,
      series,
      emission_date,
      issuer_cnpj,
      issuer_name,
      recipient_cnpj,
      recipient_name,
      total_value,
      access_key,
      xml_content,
      items = [],
      created_by
    } = body;

    if (!document_type || !document_number || !series || !issuer_cnpj || !issuer_name) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: document_type, document_number, series, issuer_cnpj, issuer_name' },
        { status: 400 }
      );
    }

    // Criar documento fiscal
    const [document] = await sql`
      INSERT INTO fiscal_documents (
        document_type, document_number, series, emission_date, issuer_cnpj, issuer_name,
        recipient_cnpj, recipient_name, total_value, access_key, xml_content, created_by
      ) VALUES (
        ${document_type}, ${document_number}, ${series}, ${emission_date}, ${issuer_cnpj}, ${issuer_name},
        ${recipient_cnpj || null}, ${recipient_name || null}, ${total_value || 0}, 
        ${access_key || null}, ${xml_content || null}, ${created_by || null}
      )
      RETURNING *
    `;

    // Adicionar itens se fornecidos
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await sql`
          INSERT INTO fiscal_document_items (
            document_id, item_sequence, product_name, quantity, unit_value, total_value,
            ncm_code, cfop, unit
          ) VALUES (
            ${document.id}, ${i + 1}, ${item.product_name}, 
            ${item.quantity || 1}, ${item.unit_value || 0}, ${item.total_value || 0},
            ${item.ncm_code || null}, ${item.cfop || null}, ${item.unit || 'UN'}
          )
        `;
      }
    }

    // Registrar histórico de validação inicial
    await sql`
      INSERT INTO sefaz_validation_history (document_id, validation_type, status, message)
      VALUES (${document.id}, 'upload', 'success', 'Documento carregado com sucesso')
    `;

    return NextResponse.json({
      message: 'Documento fiscal criado com sucesso',
      document
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar documento fiscal:', error);
    
    // Trata erro de duplicata
    if (error.message.includes('unique_document')) {
      return NextResponse.json(
        { error: 'Documento já existe no sistema' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}