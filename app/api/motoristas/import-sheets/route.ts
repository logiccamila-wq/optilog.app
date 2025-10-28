import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sheetUrl } = await request.json();

    const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      return NextResponse.json(
        { error: 'URL do Google Sheets inválido' },
        { status: 400 }
      );
    }

    const sheetId = sheetIdMatch[1];
    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    const response = await fetch(exportUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao acessar a planilha. Verifique se está pública.' },
        { status: 400 }
      );
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    console.log('Headers detectados:', headers);

    const data = lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim().replace(/^"|"$/g, ''));
        
        // Estrutura esperada: Nome, Apelido, Ativo, Cidade, Telefone, CPF, RG, Tipo
        const nomeIdx = headers.findIndex(h => h.includes('nome'));
        const apelidoIdx = headers.findIndex(h => h.includes('apelido'));
        const ativoIdx = headers.findIndex(h => h.includes('ativo'));
        const cidadeIdx = headers.findIndex(h => h.includes('cidade'));
        const telefoneIdx = headers.findIndex(h => h.includes('telefone'));
        const cpfIdx = headers.findIndex(h => h.includes('cpf'));
        const rgIdx = headers.findIndex(h => h.includes('rg') && !h.includes('cargo'));
        const tipoIdx = headers.findIndex(h => h.includes('tipo') || h.includes('categoria'));

        return {
          id: index + 1,
          nome: values[nomeIdx >= 0 ? nomeIdx : 1] || '',
          apelido: values[apelidoIdx >= 0 ? apelidoIdx : 2] || '',
          ativo: values[ativoIdx >= 0 ? ativoIdx : 3] || 'SIM',
          cidade: values[cidadeIdx >= 0 ? cidadeIdx : 4] || '',
          telefone: values[telefoneIdx >= 0 ? telefoneIdx : 5] || '',
          cpf: values[cpfIdx >= 0 ? cpfIdx : 6] || '',
          rg: values[rgIdx >= 0 ? rgIdx : 7] || '',
          tipo: values[tipoIdx >= 0 ? tipoIdx : 8] || ''
        };
      })
      .filter(row => row.nome && row.cpf);

    return NextResponse.json({
      success: true,
      data,
      message: `✅ Motoristas importados com sucesso!`,
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
    message: 'Use POST para importar motoristas do Google Sheets',
    example: {
      sheetUrl: 'https://docs.google.com/spreadsheets/d/1PQp-oaeCtYqXx-IW7XKKFJGNTaZwT06K/edit'
    }
  });
}
