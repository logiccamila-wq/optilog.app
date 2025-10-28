import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sheetUrl } = await request.json();

    // Extrair o ID da planilha do URL
    const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      return NextResponse.json(
        { error: 'URL do Google Sheets inválido' },
        { status: 400 }
      );
    }

    const sheetId = sheetIdMatch[1];
    
    // URL pública de exportação CSV do Google Sheets
    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    // Fazer requisição para obter o CSV
    const response = await fetch(exportUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao acessar a planilha. Verifique se está pública.' },
        { status: 400 }
      );
    }

    const csvText = await response.text();
    
    // Parse do CSV
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const data = lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        
        // Mapear colunas (ajuste conforme estrutura da planilha)
        return {
          id: index + 1,
          origem: values[headers.indexOf('origem')] || values[0] || '',
          destino: values[headers.indexOf('destino')] || values[1] || '',
          distancia: parseFloat(values[headers.indexOf('distancia')] || values[2] || '0'),
          precoKm: parseFloat(values[headers.indexOf('preco/km')] || values[3] || '0'),
          pedagio: parseFloat(values[headers.indexOf('pedagio')] || values[4] || '0'),
          tempoEstimado: values[headers.indexOf('tempo')] || values[5] || '',
          precoTotal: parseFloat(values[headers.indexOf('total')] || values[6] || '0')
        };
      })
      .filter(row => row.origem && row.destino); // Filtrar linhas vazias

    return NextResponse.json({
      success: true,
      data,
      message: `✅ ${data.length} rotas importadas com sucesso!`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao importar Google Sheets:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a planilha', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para importar dados do Google Sheets',
    example: {
      sheetUrl: 'https://docs.google.com/spreadsheets/d/1tm5Sd_cjClZy2FpkAL_IyeBIG17ymWCZ/edit'
    }
  });
}
