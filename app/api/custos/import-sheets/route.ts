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
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    console.log('Headers detectados:', headers);

    const data = lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        // Parse CSV com suporte a valores entre aspas
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
        
        // Mapear colunas (ajuste conforme estrutura da planilha)
        // Estrutura esperada: Data, Frota/Placa, Centro de Custo, Tipo Despesa, Valor, Fornecedor, Observação
        const dataIdx = headers.findIndex(h => h.includes('data'));
        const frotaIdx = headers.findIndex(h => h.includes('frota') || h.includes('placa') || h.includes('veículo'));
        const centroCustoIdx = headers.findIndex(h => h.includes('centro') || h.includes('custo'));
        const tipoDespesaIdx = headers.findIndex(h => h.includes('tipo') || h.includes('despesa') || h.includes('categoria'));
        const valorIdx = headers.findIndex(h => h.includes('valor') || h.includes('total'));
        const fornecedorIdx = headers.findIndex(h => h.includes('fornecedor'));
        const obsIdx = headers.findIndex(h => h.includes('obs') || h.includes('descrição'));

        const dataStr = values[dataIdx >= 0 ? dataIdx : 0] || '';
        const valorStr = values[valorIdx >= 0 ? valorIdx : 4] || '0';
        
        // Parse do valor (remove R$, pontos de milhar e converte vírgula em ponto)
        const valorParsed = parseFloat(
          valorStr
            .replace(/[R$\s]/g, '')
            .replace(/\./g, '')
            .replace(',', '.')
        );

        // Parse da data (tenta vários formatos)
        let dataParsed = '';
        if (dataStr) {
          // Tenta formato DD/MM/YYYY
          const match = dataStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
          if (match) {
            const [, day, month, year] = match;
            dataParsed = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }

        // Extrair mês (YYYY-MM)
        const mesParsed = dataParsed ? dataParsed.substring(0, 7) : '';

        const frota = values[frotaIdx >= 0 ? frotaIdx : 1] || '';
        
        return {
          id: index + 1,
          data: dataParsed,
          frota: frota,
          centroCusto: values[centroCustoIdx >= 0 ? centroCustoIdx : 2] || '',
          tipoDespesa: values[tipoDespesaIdx >= 0 ? tipoDespesaIdx : 3] || '',
          valor: valorParsed,
          fornecedor: values[fornecedorIdx >= 0 ? fornecedorIdx : 5] || '',
          observacao: values[obsIdx >= 0 ? obsIdx : 6] || '',
          mes: mesParsed
        };
      })
      .filter(row => row.data && row.valor > 0); // Filtrar linhas válidas

    // Calcular período
    const meses = [...new Set(data.map(d => d.mes))].sort();
    const periodoInicio = meses[0] ? new Date(meses[0] + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : '';
    const periodoFim = meses[meses.length - 1] ? new Date(meses[meses.length - 1] + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : '';
    const periodo = meses.length > 1 ? `${periodoInicio} - ${periodoFim}` : periodoInicio;

    return NextResponse.json({
      success: true,
      data,
      message: `✅ Custos importados com sucesso!`,
      periodo,
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
    message: 'Use POST para importar custos do Google Sheets',
    example: {
      sheetUrl: 'https://docs.google.com/spreadsheets/d/1zgLlFH1_8HoIqmZlwH1W0b0Bs_q_N2mF/edit'
    }
  });
}
