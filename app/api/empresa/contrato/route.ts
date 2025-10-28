import { NextResponse } from 'next/server';

// Dados do contrato EJG + XYZ Logic Flow
export async function GET() {
  const contratoData = {
    contratante: {
      razaoSocial: 'EJG Evolução em Transporte Ltda.',
      cnpj: '44.185.912/0001-50',
      cidade: 'Jaboatão dos Guararapes',
      estado: 'PE',
      segmento: 'Transporte Rodoviário de Cargas',
      regimeTributario: 'Lucro Real', // Confirmado pelo usuário
      faturamentoAnual: 6000000, // R$ 6 milhões
      funcionarios: 25,
      frota: 12 // veículos
    },
    contratada: {
      razaoSocial: 'XYZ Logic Flow Inova Simples (I.S.)',
      cnpj: '60.262.825/0001-06',
      endereco: 'Rua Coimbra, 381, Residencial Doce Bela, Casa 5',
      bairro: 'Candeias',
      cidade: 'Jaboatão dos Guararapes',
      estado: 'PE',
      representante: 'Sra. Camila Lareste',
      cargo: 'Diretora Operacional'
    },
    contrato: {
      tipo: 'Prestação de Serviços de Consultoria, Tecnologia e Gestão de Projeto',
      dataAssinatura: '2025-01-15',
      vigencia: '12 meses',
      dataInicio: '2025-02-01',
      dataTermino: '2026-01-31',
      baseLegal: [
        'Código Civil (arts. 593 a 609)',
        'Código de Defesa do Consumidor (Lei nº 8.078/1990)',
        'Lei de Direitos Autorais (Lei nº 9.610/1998)',
        'Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)'
      ],
      escopo: [
        'Desenvolvimento de Sistema de Gestão Logística (OptiLog)',
        'Consultoria em Gestão Operacional e Financeira',
        'Implementação de Inteligência Artificial para Otimização de Rotas',
        'Auditoria e Conformidade SASSMAQ/ISO',
        'Gestão de Frotas e Motoristas',
        'Análise Tributária e Financeira',
        'Suporte Técnico e Treinamento'
      ],
      clientePiloto: true,
      status: 'Ativo'
    },
    analytics: {
      diasDesdeContrato: Math.floor((new Date('2025-10-28').getTime() - new Date('2025-02-01').getTime()) / (1000 * 60 * 60 * 24)),
      diasRestantes: Math.floor((new Date('2026-01-31').getTime() - new Date('2025-10-28').getTime()) / (1000 * 60 * 60 * 24)),
      percentualConcluido: 77, // ~9 meses de 12
      modulosImplementados: 18,
      modulosTotal: 24,
      satisfacaoCliente: 4.7, // de 5
      roi: 285 // % estimado
    }
  };

  return NextResponse.json(contratoData);
}
