import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/service-orders/[id]/attachments - Upload de arquivos (fotos, documentos)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const osId = parseInt(params.id);
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string || 'document'; // 'photo' | 'document' | 'signature'

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo é obrigatório' },
        { status: 400 }
      );
    }

    // Verifica se OS existe
    const [existingOS] = await sql`
      SELECT id FROM service_orders WHERE id = ${osId}
    `;

    if (!existingOS) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    // Define diretório de upload
    const uploadDir = join(process.cwd(), 'uploads', 'service-orders', osId.toString());
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Diretório já existe ou erro na criação
    }

    // Gera nome único para o arquivo
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${type}_${timestamp}.${extension}`;
    const filePath = join(uploadDir, filename);

    // Salva arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Registra no banco
    const [attachment] = await sql`
      INSERT INTO os_attachments (
        os_id, filename, original_name, file_path, file_size, file_type, description
      ) VALUES (
        ${osId}, ${filename}, ${file.name}, ${filePath}, ${file.size}, ${type}, ${description || null}
      )
      RETURNING *
    `;

    return NextResponse.json({
      message: 'Arquivo enviado com sucesso',
      attachment
    });

  } catch (error: any) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/service-orders/[id]/attachments - Lista anexos de uma OS
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const osId = parseInt(params.id);

    const attachments = await sql`
      SELECT 
        id, filename, original_name, file_size, file_type, description, created_at
      FROM os_attachments 
      WHERE os_id = ${osId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(attachments);

  } catch (error: any) {
    console.error('Erro ao buscar anexos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}