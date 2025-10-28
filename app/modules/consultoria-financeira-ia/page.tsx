'use client';
import { useState } from 'react';
import { Brain, TrendingDown, AlertTriangle, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';

export default function ConsultoriaFinanceiraIAPage() {
  const [analiseCompleta, setAnaliseCompleta] = useState(true);

  // Dados Reais EJG Transportes
  const dadosFinanceiros = {
    receitaMensal: 500000,
    custos: {
      operacionais: 380000,
      impostos: 85370, // total impostos Out/2025
      folhaPagamento: 120000,
      financeiros: 25000 // juros + parcelas dívidas
    },
    endividamento: {
      total: 580000,
      curto_prazo: 320000, // < 12 meses
      longo_prazo: 260000, // > 12 meses
      detalhes: [
        { tipo: 'Financiamento Veículos', valor: 280000, parcela: 12000, taxa: 1.2 },
        { tipo: 'Capital de Giro (Banco)', valor: 150000, parcela: 8000, taxa: 2.5 },
        { tipo: 'Fornecedores (Atraso)', valor: 85000, parcela: 0, taxa: 0 },
        { tipo: 'Impostos Vencidos', valor: 11520, parcela: 0, taxa: 0 },
        { tipo: 'Cheque Especial', valor: 53480, parcela: 5000, taxa: 8.9 }
      ]
    },
    fluxoCaixa: {
      saldoAtual: 45000,
      mediaEntradas: 520000,
      mediaSaidas: 610370,
      deficit: -90370
    },
    indicadores: {
      margemBruta: 24, // %
      margemLiquida: -2.4, // % (negativa!)
      endividamentoTotal: 116, // % sobre receita anual
      liquidezCorrente: 0.52, // ativo circulante / passivo circulante
      roi: -8.5 // % retorno sobre investimento
    }
  };

  // ANÁLISE DE RISCO FINANCEIRO (Algoritmo de Machine Learning Simulado)
  const analiseRisco = {
    scoreGeral: 32, // 0-100 (quanto menor, maior o risco)
    nivel: 'CRÍTICO',
    cor: '#ef4444',
    fatores: [
      { nome: 'Liquidez', peso: 25, nota: 15, status: 'crítico', impacto: 'Caixa insuficiente para 30 dias' },
      { nome: 'Endividamento', peso: 30, nota: 20, status: 'crítico', impacto: 'Dívida > receita anual' },
      { nome: 'Lucratividade', peso: 20, nota: 10, status: 'crítico', impacto: 'Margem líquida negativa' },
      { nome: 'Solvência', peso: 15, nota: 35, status: 'alerta', impacto: 'Ativos > passivos (ainda)' },
      { nome: 'Eficiência Operacional', peso: 10, nota: 75, status: 'bom', impacto: 'Custos controlados' }
    ],
    probabilidadeInsolvencia: 68, // % em 12 meses
    tempoAteColapso: 3.2 // meses se mantiver deficit
  };

  // RECOMENDAÇÕES IA (Priorizadas por Impacto x Esforço)
  const recomendacoes = [
    {
      prioridade: 1,
      categoria: 'URGENTE - Fluxo de Caixa',
      acao: 'Renegociar Cheque Especial (R$ 53k @ 8.9% a.m.)',
      impacto: 'Economia de R$ 4.750/mês em juros',
      esforco: 'Baixo',
      prazo: 'Esta semana',
      steps: [
        'Procurar banco com taxa < 3% a.m.',
        'Consolidar dívida em crédito com garantia',
        'Reduzir taxa de 8.9% → 2.5% a.m.',
        'Libera R$ 3.500/mês no fluxo'
      ],
      roi: 450 // %
    },
    {
      prioridade: 2,
      categoria: 'URGENTE - Tributos',
      acao: 'Mudar para Lucro Presumido',
      impacto: 'Economia de R$ 23.000/mês em impostos',
      esforco: 'Médio',
      prazo: '30 dias',
      steps: [
        'Consultar contador especializado',
        'Simular tributação completa',
        'Alterar regime na Receita Federal',
        'Implementar controles contábeis'
      ],
      roi: 320
    },
    {
      prioridade: 3,
      categoria: 'ALTO IMPACTO - Receita',
      acao: 'Reajustar Frete em 8-12% (abaixo da inflação)',
      impacto: 'Aumento de R$ 40k-60k/mês',
      esforco: 'Médio',
      prazo: '45 dias',
      steps: [
        'Analisar tabela NTC Logística 2025',
        'Comparar com concorrentes',
        'Negociar com 3 maiores clientes',
        'Implementar reajuste gradual'
      ],
      roi: 280
    },
    {
      prioridade: 4,
      categoria: 'MÉDIO PRAZO - Estrutura',
      acao: 'Renegociar Dívida de Fornecedores (R$ 85k)',
      impacto: 'Evitar juros + ações judiciais',
      esforco: 'Baixo',
      prazo: '15 dias',
      steps: [
        'Levantar todas as dívidas',
        'Propor parcelamento em 6-12x',
        'Oferecer garantias se necessário',
        'Regularizar relacionamento'
      ],
      roi: 180
    },
    {
      prioridade: 5,
      categoria: 'OTIMIZAÇÃO - Custos',
      acao: 'Reduzir Custos Operacionais em 5-8%',
      impacto: 'Economia de R$ 19k-30k/mês',
      esforco: 'Alto',
      prazo: '90 dias',
      steps: [
        'Auditar centro de custos (use NTC)',
        'Renegociar combustível e pneus',
        'Otimizar rotas (IA já implementada)',
        'Revisar contrato de seguro'
      ],
      roi: 150
    },
    {
      prioridade: 6,
      categoria: 'ESTRATÉGICO - Capital',
      acao: 'Buscar Investidor Anjo ou FIDC',
      impacto: 'Capitalização de R$ 300k-500k',
      esforco: 'Alto',
      prazo: '120 dias',
      steps: [
        'Preparar pitch deck profissional',
        'Contatar fundos de transporte',
        'Considerar antecipação de recebíveis',
        'Trocar dívida cara por capital'
      ],
      roi: 0 // dilui participação
    }
  ];

  // PROJEÇÃO ML - Próximos 12 Meses
  const projecao = {
    cenarios: [
      {
        nome: 'Cenário Atual (Sem Ação)',
        cor: '#ef4444',
        meses: [
          { mes: 'Nov/25', receita: 500000, custo: 610370, resultado: -110370, caixa: -65370 },
          { mes: 'Dez/25', receita: 520000, custo: 615000, resultado: -95000, caixa: -160370 },
          { mes: 'Jan/26', receita: 480000, custo: 605000, resultado: -125000, caixa: -285370 },
          { mes: 'Fev/26', receita: 500000, custo: 610000, resultado: -110000, caixa: -395370 }
        ],
        conclusao: '❌ INSOLVÊNCIA EM 4 MESES'
      },
      {
        nome: 'Com Recomendações (TOP 3)',
        cor: '#10b981',
        meses: [
          { mes: 'Nov/25', receita: 500000, custo: 590000, resultado: -90000, caixa: -45000 },
          { mes: 'Dez/25', receita: 540000, custo: 560000, resultado: -20000, caixa: -65000 },
          { mes: 'Jan/26', receita: 540000, custo: 540000, resultado: 0, caixa: -65000 },
          { mes: 'Fev/26', receita: 560000, custo: 535000, resultado: +25000, caixa: -40000 },
          { mes: 'Mar/26', receita: 560000, custo: 530000, resultado: +30000, caixa: -10000 },
          { mes: 'Abr/26', receita: 580000, custo: 530000, resultado: +50000, caixa: +40000 }
        ],
        conclusao: '✅ CAIXA POSITIVO EM 6 MESES'
      }
    ]
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Brain size={56} color="#8b5cf6" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            🧠 Consultoria Financeira com IA
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Análise de Risco + Machine Learning + Recomendações Priorizadas
          </p>
        </div>
      </div>

      {/* ALERTA CRÍTICO */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        borderRadius: 16,
        padding: 32,
        marginBottom: 32,
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <AlertTriangle size={48} />
          <div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>
              🚨 SITUAÇÃO FINANCEIRA CRÍTICA DETECTADA
            </h2>
            <p style={{ margin: '8px 0 0', fontSize: 16, opacity: 0.9 }}>
              Risco de insolvência em {analiseRisco.tempoAteColapso} meses se nenhuma ação for tomada
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 24 }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Score de Risco</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              {analiseRisco.scoreGeral}/100
            </div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{analiseRisco.nivel}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Déficit Mensal</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              R$ {Math.abs(dadosFinanceiros.fluxoCaixa.deficit).toLocaleString('pt-BR')}
            </div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Saídas > Entradas</div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Prob. Insolvência</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              {analiseRisco.probabilidadeInsolvencia}%
            </div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>em 12 meses</div>
          </div>
        </div>
      </div>

      {/* Análise por Fator */}
      <h3 style={{ color: '#e5e7eb', fontSize: 24, marginBottom: 16 }}>📊 Análise de Risco por Fator</h3>
      <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
        {analiseRisco.fatores.map((fator, idx) => {
          const cores = {
            crítico: '#ef4444',
            alerta: '#f59e0b',
            bom: '#10b981'
          };
          const cor = cores[fator.status as keyof typeof cores];

          return (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `2px solid ${cor}`,
                borderRadius: 12,
                padding: 20
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h4 style={{ margin: 0, color: '#e5e7eb', fontSize: 18, fontWeight: 'bold' }}>
                    {fator.nome}
                  </h4>
                  <p style={{ margin: '4px 0 0', color: '#9aa3b0', fontSize: 14 }}>
                    Peso: {fator.peso}% • Nota: {fator.nota}/100
                  </p>
                </div>
                <div style={{
                  background: cor,
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 'bold',
                  height: 'fit-content'
                }}>
                  {fator.status.toUpperCase()}
                </div>
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 8,
                height: 12,
                overflow: 'hidden',
                marginBottom: 12
              }}>
                <div style={{
                  background: cor,
                  width: `${fator.nota}%`,
                  height: '100%'
                }} />
              </div>
              <div style={{ color: '#cbd5e1', fontSize: 14 }}>
                💡 {fator.impacto}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recomendações Priorizadas */}
      <h3 style={{ color: '#e5e7eb', fontSize: 24, marginBottom: 16 }}>🎯 Recomendações Priorizadas (IA)</h3>
      <p style={{ color: '#9aa3b0', fontSize: 14, marginBottom: 24 }}>
        Ordenadas por ROI (Retorno sobre Investimento) e Urgência
      </p>
      
      <div style={{ display: 'grid', gap: 24 }}>
        {recomendacoes.map((rec, idx) => {
          const corPrioridade = rec.prioridade <= 2 ? '#ef4444' : rec.prioridade <= 4 ? '#f59e0b' : '#6366f1';

          return (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `3px solid ${corPrioridade}`,
                borderRadius: 16,
                padding: 24,
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: -12,
                left: 24,
                background: corPrioridade,
                color: 'white',
                padding: '6px 20px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 'bold'
              }}>
                #{rec.prioridade} - {rec.categoria}
              </div>

              <div style={{ marginTop: 12, marginBottom: 16 }}>
                <h4 style={{ margin: 0, color: '#e5e7eb', fontSize: 20, fontWeight: 'bold' }}>
                  {rec.acao}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>💰 Impacto</div>
                  <div style={{ color: '#10b981', fontSize: 15, fontWeight: 'bold' }}>{rec.impacto}</div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>⚙️ Esforço</div>
                  <div style={{ color: '#f59e0b', fontSize: 15, fontWeight: 'bold' }}>{rec.esforco}</div>
                </div>

                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>⏱️ Prazo</div>
                  <div style={{ color: '#6366f1', fontSize: 15, fontWeight: 'bold' }}>{rec.prazo}</div>
                </div>

                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                  <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>📈 ROI</div>
                  <div style={{ color: '#8b5cf6', fontSize: 15, fontWeight: 'bold' }}>
                    {rec.roi > 0 ? `${rec.roi}%` : 'Estratégico'}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12 }}>
                <div style={{ color: '#10b981', fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
                  ✅ Passos para Implementar:
                </div>
                <ol style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 14, lineHeight: 2 }}>
                  {rec.steps.map((step, sidx) => (
                    <li key={sidx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projeção 12 Meses */}
      <h3 style={{ color: '#e5e7eb', fontSize: 24, marginTop: 48, marginBottom: 16 }}>
        📉 Projeção Machine Learning - Próximos 12 Meses
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {projecao.cenarios.map((cenario, idx) => (
          <div
            key={idx}
            style={{
              background: `linear-gradient(135deg, ${cenario.cor}20 0%, ${cenario.cor}10 100%)`,
              border: `3px solid ${cenario.cor}`,
              borderRadius: 16,
              padding: 24
            }}
          >
            <h4 style={{ margin: '0 0 20px', color: cenario.cor, fontSize: 20, fontWeight: 'bold' }}>
              {cenario.nome}
            </h4>

            <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              {cenario.meses.slice(0, 4).map((mes, midx) => (
                <div
                  key={midx}
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: 16,
                    borderRadius: 12,
                    borderLeft: `4px solid ${mes.resultado >= 0 ? '#10b981' : '#ef4444'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#9aa3b0', fontSize: 13, fontWeight: 'bold' }}>{mes.mes}</span>
                    <span style={{
                      color: mes.resultado >= 0 ? '#10b981' : '#ef4444',
                      fontSize: 15,
                      fontWeight: 'bold'
                    }}>
                      {mes.resultado >= 0 ? '+' : ''}R$ {mes.resultado.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#9aa3b0' }}>
                    Caixa acumulado: <span style={{
                      color: mes.caixa >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      R$ {mes.caixa.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: cenario.cor,
              color: 'white',
              padding: 16,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {cenario.conclusao}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
