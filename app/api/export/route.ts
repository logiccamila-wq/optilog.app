import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
}

// GET /api/export - Exporta dados em CSV
export async function GET(request: NextRequest) {

  try {

    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity'); // 'customers', 'drivers', 'vehicles', 'service_orders'

    let data: any[] = [];
    let headers: string[] = [];
    let filename = 'export.csv';

    switch (entity) {
      case 'customers':
        data = await sql`SELECT * FROM customers ORDER BY name`;
        headers = ['ID', 'Nome', 'Email', 'Telefone', 'Criado em'];
        filename = 'clientes.csv';
        break;

      case 'drivers':
        data = await sql`SELECT * FROM drivers ORDER BY name`;
        headers = ['ID', 'Nome', 'CPF', 'CNH', 'Categoria', 'Telefone', 'Status'];
        filename = 'motoristas.csv';
        break;

      case 'vehicles':
        data = await sql`SELECT * FROM vehicles ORDER BY plate`;
        headers = ['ID', 'Placa', 'Marca', 'Modelo', 'Ano', 'Tipo', 'Status'];
        filename = 'veiculos.csv';
        break;

      case 'service_orders':
        data = await sql`SELECT * FROM service_orders ORDER BY created_at DESC LIMIT 1000`;
        headers = ['Número', 'Veículo ID', 'Tipo', 'Prioridade', 'Status', 'Custo Total', 'Data'];
        filename = 'ordens_servico.csv';
        break;

      default:
        return NextResponse.json(
          { error: 'Entidade inválida. Use: customers, drivers, vehicles, service_orders' },
          { status: 400 }
        );
    }

    // Gera CSV
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = Object.values(row).map(val => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        // Escapa aspas e adiciona aspas se contém vírgula
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Erro ao exportar:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/export - Importa dados de CSV
export async function POST(request: NextRequest) {

  try {

    const sql = getDb();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entity = formData.get('entity') as string;

    if (!file) {
      return NextResponse.json({ error: 'Arquivo é obrigatório' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'Arquivo vazio ou inválido' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const dataLines = lines.slice(1);
    
    let imported = 0;
    const errors: string[] = [];

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const values = dataLines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || null;
        });

        // Importa baseado na entidade
        if (entity === 'customers') {
          await sql`
            INSERT INTO customers (name, email, phone)
            VALUES (${row.nome || row.name}, ${row.email}, ${row.telefone || row.phone})
            ON CONFLICT DO NOTHING
          `;
          imported++;
        } else if (entity === 'drivers') {
          if (!row.cpf || !row.cnh) {
            errors.push(`Linha ${i + 2}: CPF e CNH são obrigatórios`);
            continue;
          }
          await sql`
            INSERT INTO drivers (name, cpf, cnh_number, cnh_category, phone, status)
            VALUES (
              ${row.nome || row.name}, 
              ${row.cpf}, 
              ${row.cnh}, 
              ${row.categoria || 'D'}, 
              ${row.telefone || row.phone},
              ${row.status || 'active'}
            )
            ON CONFLICT (cpf) DO NOTHING
          `;
          imported++;
        } else if (entity === 'vehicles') {
          if (!row.placa && !row.plate) {
            errors.push(`Linha ${i + 2}: Placa é obrigatória`);
            continue;
          }
          await sql`
            INSERT INTO vehicles (plate, brand, model, year_manufacture, year_model, type, status)
            VALUES (
              ${row.placa || row.plate},
              ${row.marca || row.brand || 'N/A'},
              ${row.modelo || row.model || 'N/A'},
              ${parseInt(row.ano || row.year || '2020')},
              ${parseInt(row.ano_modelo || row.year_model || row.ano || '2020')},
              ${row.tipo || row.type || 'truck'},
              ${row.status || 'active'}
            )
            ON CONFLICT (plate) DO NOTHING
          `;
          imported++;
        }

      } catch (err: any) {
        errors.push(`Linha ${i + 2}: ${err.message}`);
      }
    }

    return NextResponse.json({
      message: 'Importação concluída',
      imported,
      total: dataLines.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined
    });

  } catch (error: any) {
    console.error('Erro ao importar:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}