import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { cpf, placaCavalo, placaReboque, numeroCTE } = await req.json();

    // Validações básicas
    if (!cpf || !placaCavalo || !numeroCTE) {
      return NextResponse.json(
        { success: false, error: 'CPF, placa do cavalo e número do CT-e são obrigatórios' },
        { status: 400 }
      );
    }

    // Aqui você faria a validação real contra o banco de dados
    // Por enquanto, vamos simular com dados mock
    const motoristasSimulados = [
      {
        id: 1,
        nome: 'João da Silva',
        cpf: '12345678900',
        apelido: 'João',
        ativo: true,
        cidade: 'São Paulo',
        telefone: '11987654321',
        tipo: 'PRÓPRIO'
      },
      {
        id: 2,
        nome: 'Maria Santos',
        cpf: '98765432100',
        apelido: 'Maria',
        ativo: true,
        cidade: 'Rio de Janeiro',
        telefone: '21987654321',
        tipo: 'AGREGADO'
      }
    ];

    // Remove formatação do CPF (pontos e traços)
    const cpfLimpo = cpf.replace(/[.-]/g, '');

    // Busca motorista pelo CPF
    const motorista = motoristasSimulados.find(m => m.cpf === cpfLimpo);

    if (!motorista) {
      return NextResponse.json(
        { success: false, error: 'CPF não encontrado no sistema' },
        { status: 404 }
      );
    }

    if (!motorista.ativo) {
      return NextResponse.json(
        { success: false, error: 'Motorista inativo. Entre em contato com a operação.' },
        { status: 403 }
      );
    }

    // Aqui você validaria a placa e CT-e contra rotas ativas
    // Por enquanto, apenas aceita qualquer combinação válida

    // Retorna dados do motorista e informações da viagem
    return NextResponse.json({
      success: true,
      motorista: {
        id: motorista.id,
        nome: motorista.nome,
        apelido: motorista.apelido,
        cpf: motorista.cpf,
        cidade: motorista.cidade,
        telefone: motorista.telefone,
        tipo: motorista.tipo
      },
      veiculo: {
        placaCavalo: placaCavalo.toUpperCase(),
        placaReboque: placaReboque ? placaReboque.toUpperCase() : null
      },
      cte: {
        numero: numeroCTE,
        origem: 'São Paulo - SP',
        destino: 'Rio de Janeiro - RJ',
        distanciaTotal: 428,
        previsaoEntrega: '2025-01-28 18:00',
        carga: {
          tipo: 'Produtos Químicos',
          peso: 18500,
          valorNF: 125000
        }
      },
      token: `mock-jwt-token-${Date.now()}` // Em produção, gere um JWT real
    });

  } catch (error) {
    console.error('Erro no login do motorista:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
