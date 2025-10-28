'use client';
import { useState } from 'react';
import { Calculator, TrendingDown, AlertTriangle, CheckCircle, DollarSign, FileText } from 'lucide-react';

interface RegimeTributario {
  nome: string;
  tipo: 'simples' | 'presumido' | 'real';
  impostos: {
    federal: number;
    estadual: number;
    municipal: number;
    total: number;
  };
  vantagens: string[];
  desvantagens: string[];
  economia?: number;
}

export default function AnaliseTributariaPage() {
  const [receitaBruta, setReceitaBruta] = useState(500000);
  const [custosDedutíveis, setCustosDedutíveis] = useState(380000);

    // Dados da empresa (REAL - EJG Evolução em Transporte Ltda.)
  const dadosEmpresa = {
    nome: 'EJG Evolução em Transporte',
    cnpj: '44.185.912/0001-50',
    regimeAtual: 'Lucro Real', // ⚠️ CONFIRMADO - Empresa está no Lucro Real atualmente
    faturamentoUltimos12Meses: 6000000, // R$ 6 milhões
    estadoOperacao: 'PE'
  };

  // CÁLCULO SIMPLES NACIONAL (Anexo III - Transporte)
  const calcularSimplesNacional = () => {
    const faturamento12m = dadosEmpresa.faturamentoUltimos12Meses;
    
    // Anexo III - Faixa 4: R$ 540.000,01 a R$ 1.800.000
    // Alíquota efetiva aproximada: 10.70% (considerando r = parcela a deduzir)
    let aliquotaEfetiva = 10.7;
    
    if (faturamento12m > 4800000) {
      // Fora do limite do Simples (R$ 4.8mi)
      return null;
    } else if (faturamento12m > 1800000) {
      aliquotaEfetiva = 14.0; // Faixa 5
    } else if (faturamento12m > 720000) {
      aliquotaEfetiva = 11.2; // Faixa intermediária
    }

    const impostoMensal = receitaBruta * (aliquotaEfetiva / 100);

    return {
      nome: 'Simples Nacional',
      tipo: 'simples' as const,
      impostos: {
        federal: impostoMensal * 0.65, // ~65% federal
        estadual: impostoMensal * 0.25, // ~25% ICMS
        municipal: impostoMensal * 0.10, // ~10% ISS
        total: impostoMensal
      },
      vantagens: [
        '✅ Unificação de 8 impostos em uma guia (DAS)',
        '✅ Alíquota menor para faturamento até R$ 4.8mi/ano',
        '✅ Menos burocracia e obrigações acessórias',
        '✅ Isenção de contribuição patronal INSS (folha)',
        '✅ Facilita acesso a crédito e licitações'
      ],
      desvantagens: [
        '⚠️ Limite de faturamento: R$ 4.8mi/ano',
        '⚠️ Não permite dedução de custos operacionais',
        '⚠️ Alíquota progressiva (quanto mais fatura, maior %)',
        '⚠️ Restrições para alguns tipos de atividade'
      ]
    };
  };

  // CÁLCULO LUCRO PRESUMIDO
  const calcularLucroPresumido = () => {
    const presuncaoLucro = 0.08; // 8% para transporte
    const baseCalculoIRPJ = receitaBruta * presuncaoLucro;
    const baseCalculoCSLL = receitaBruta * 0.12; // 12% para CSLL

    const irpj = baseCalculoIRPJ * 0.15; // 15% sobre base
    const csll = baseCalculoCSLL * 0.09; // 9% sobre base
    const pis = receitaBruta * 0.0065; // 0.65%
    const cofins = receitaBruta * 0.03; // 3%
    
    // ICMS e ISS (depende de cada operação)
    const icms = receitaBruta * 0.12; // ~12% (média)
    const iss = 0; // Transporte rodoviário geralmente isento de ISS

    const totalFederal = irpj + csll + pis + cofins;
    const totalEstadual = icms;
    const totalMunicipal = iss;
    const total = totalFederal + totalEstadual + totalMunicipal;

    return {
      nome: 'Lucro Presumido',
      tipo: 'presumido' as const,
      impostos: {
        federal: totalFederal,
        estadual: totalEstadual,
        municipal: totalMunicipal,
        total: total
      },
      vantagens: [
        '✅ Presunção de lucro menor (8%) vs realidade (24%)',
        '✅ Menos burocracia que Lucro Real',
        '✅ Tributação menor quando margem > 8%',
        '✅ Permite crédito de PIS/COFINS em alguns casos',
        '✅ Apuração trimestral (menos declarações)'
      ],
      desvantagens: [
        '⚠️ Não permite dedução de custos reais',
        '⚠️ Obrigações acessórias mais complexas que Simples',
        '⚠️ ICMS calculado por fora (duplicidade)',
        '⚠️ Limite de faturamento: R$ 78mi/ano'
      ]
    };
  };

  // CÁLCULO LUCRO REAL
  const calcularLucroReal = () => {
    const lucroReal = dadosEmpresa.lucroReal; // R$ 120.000
    
    const irpj = lucroReal * 0.15; // 15% sobre lucro real
    const adicionalIRPJ = Math.max(0, (lucroReal - 20000) * 0.10); // 10% sobre o que exceder R$ 20k
    const csll = lucroReal * 0.09; // 9% sobre lucro real
    const pis = receitaBruta * 0.0165; // 1.65% (regime não-cumulativo)
    const cofins = receitaBruta * 0.076; // 7.6% (regime não-cumulativo)
    
    const icms = receitaBruta * 0.12;
    const iss = 0;

    const totalFederal = irpj + adicionalIRPJ + csll + pis + cofins;
    const totalEstadual = icms;
    const totalMunicipal = iss;
    const total = totalFederal + totalEstadual + totalMunicipal;

    return {
      nome: 'Lucro Real',
      tipo: 'real' as const,
      impostos: {
        federal: totalFederal,
        estadual: totalEstadual,
        municipal: totalMunicipal,
        total: total
      },
      vantagens: [
        '✅ Dedução de TODOS os custos operacionais',
        '✅ Créditos de PIS/COFINS sobre despesas',
        '✅ Compensação de prejuízos fiscais',
        '✅ Sem limite de faturamento',
        '✅ Ideal para margens baixas (<32%)'
      ],
      desvantagens: [
        '⚠️ Complexidade contábil muito alta',
        '⚠️ Custo de assessoria contábil elevado',
        '⚠️ Muitas obrigações acessórias (SPED, ECF, EFD)',
        '⚠️ Apuração mensal ou trimestral rigorosa',
        '⚠️ Risco de autuação fiscal por erro'
      ]
    };
  };

  const regimes = [
    calcularSimplesNacional(),
    calcularLucroPresumido(),
    calcularLucroReal()
  ].filter(Boolean) as RegimeTributario[];

  // Ordenar por menor imposto
  const regimesOrdenados = regimes.sort((a, b) => a.impostos.total - b.impostos.total);
  const melhorRegime = regimesOrdenados[0];
  const regimeAtual = regimes.find(r => r.nome === 'Simples Nacional');
  
  if (regimeAtual && melhorRegime) {
    melhorRegime.economia = regimeAtual.impostos.total - melhorRegime.impostos.total;
  }

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Calculator size={56} color="#8b5cf6" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            🧮 Análise Tributária Inteligente
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Lucro Real vs Presumido vs Simples Nacional - Qual paga menos?
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 24
        }}>
          <label style={{ display: 'block', color: '#9aa3b0', fontSize: 14, marginBottom: 8 }}>
            💰 Receita Bruta Mensal
          </label>
          <input
            type="number"
            value={receitaBruta}
            onChange={(e) => setReceitaBruta(Number(e.target.value))}
            style={{
              width: '100%',
              padding: 12,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold'
            }}
          />
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 24
        }}>
          <label style={{ display: 'block', color: '#9aa3b0', fontSize: 14, marginBottom: 8 }}>
            📊 Custos Operacionais Mensais
          </label>
          <input
            type="number"
            value={custosDedutíveis}
            onChange={(e) => setCustosDedutíveis(Number(e.target.value))}
            style={{
              width: '100%',
              padding: 12,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold'
            }}
          />
        </div>
      </div>

      {/* Indicadores da Empresa */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Lucro Líquido Mensal</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>
            R$ {dadosEmpresa.lucroReal.toLocaleString('pt-BR')}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Margem de Lucro</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>
            {dadosEmpresa.margemLucro.toFixed(1)}%
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Faturamento Anual</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>
            R$ {(dadosEmpresa.receitaAnual / 1000000).toFixed(1)}mi
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Regime Atual</div>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>
            {dadosEmpresa.regime_atual}
          </div>
        </div>
      </div>

      {/* Recomendação Principal */}
      {melhorRegime && melhorRegime.economia && melhorRegime.economia > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: 16,
          padding: 32,
          marginBottom: 32,
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <TrendingDown size={48} />
            <div>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>
                💡 OPORTUNIDADE DE ECONOMIA IDENTIFICADA!
              </h2>
              <p style={{ margin: '8px 0 0', fontSize: 16, opacity: 0.9 }}>
                Mudando para <strong>{melhorRegime.nome}</strong>, você economiza:
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 24 }}>
            <div>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Economia Mensal</div>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>
                R$ {melhorRegime.economia.toLocaleString('pt-BR')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Economia Anual</div>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>
                R$ {(melhorRegime.economia * 12).toLocaleString('pt-BR')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Redução %</div>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>
                -{((melhorRegime.economia / regimeAtual!.impostos.total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparação de Regimes */}
      <div style={{ display: 'grid', gap: 24 }}>
        {regimesOrdenados.map((regime, index) => {
          const isMelhor = index === 0;
          const isAtual = regime.nome === 'Simples Nacional';

          return (
            <div
              key={regime.nome}
              style={{
                background: isMelhor ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                border: isMelhor ? '3px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: 24,
                position: 'relative'
              }}
            >
              {isMelhor && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  right: 24,
                  background: '#10b981',
                  color: 'white',
                  padding: '6px 20px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 'bold'
                }}>
                  🏆 MELHOR OPÇÃO
                </div>
              )}

              {isAtual && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: 24,
                  background: '#3b82f6',
                  color: 'white',
                  padding: '6px 20px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 'bold'
                }}>
                  📍 ATUAL
                </div>
              )}

              <h3 style={{ margin: '0 0 24px', color: '#e5e7eb', fontSize: 24, fontWeight: 'bold' }}>
                {regime.nome}
              </h3>

              {/* Impostos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>Federal</div>
                  <div style={{ color: '#ef4444', fontSize: 20, fontWeight: 'bold' }}>
                    R$ {regime.impostos.federal.toLocaleString('pt-BR')}
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>Estadual</div>
                  <div style={{ color: '#f59e0b', fontSize: 20, fontWeight: 'bold' }}>
                    R$ {regime.impostos.estadual.toLocaleString('pt-BR')}
                  </div>
                </div>

                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>Municipal</div>
                  <div style={{ color: '#6366f1', fontSize: 20, fontWeight: 'bold' }}>
                    R$ {regime.impostos.municipal.toLocaleString('pt-BR')}
                  </div>
                </div>

                <div style={{ background: isMelhor ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(107, 114, 128, 0.2)', padding: 16, borderRadius: 12 }}>
                  <div style={{ color: isMelhor ? 'white' : '#9aa3b0', fontSize: 12, marginBottom: 4 }}>TOTAL MENSAL</div>
                  <div style={{ color: isMelhor ? 'white' : '#e5e7eb', fontSize: 24, fontWeight: 'bold' }}>
                    R$ {regime.impostos.total.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* Vantagens e Desvantagens */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <h4 style={{ margin: '0 0 12px', color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>
                    Vantagens
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', color: '#cbd5e1', fontSize: 14, lineHeight: 2 }}>
                    {regime.vantagens.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 12px', color: '#f59e0b', fontSize: 16, fontWeight: 'bold' }}>
                    Desvantagens
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', color: '#cbd5e1', fontSize: 14, lineHeight: 2 }}>
                    {regime.desvantagens.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Avisos Legais */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '2px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 12,
        padding: 20,
        marginTop: 32
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
          <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
            <strong style={{ color: '#ef4444' }}>⚠️ ATENÇÃO - CONSULTE SEMPRE UM CONTADOR</strong><br />
            Esta análise é uma simulação baseada em alíquotas médias e presunções legais. Cada empresa tem particularidades (atividades, créditos, benefícios fiscais, etc.) que podem alterar significativamente os valores. Antes de mudar de regime tributário:<br />
            • Consulte um contador especializado em transporte<br />
            • Analise o impacto em fluxo de caixa<br />
            • Considere obrigações acessórias e custos contábeis<br />
            • Verifique prazos e procedimentos na Receita Federal
          </div>
        </div>
      </div>
    </div>
  );
}
