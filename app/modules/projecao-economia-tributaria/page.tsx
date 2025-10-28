'use client';
import { useState } from 'react';
import { TrendingDown, DollarSign, Calendar, BarChart3, PieChart, TrendingUp, AlertCircle } from 'lucide-react';

export default function ProjecaoEconomiaTributariaPage() {
  const [periodoProjecao, setPeriodoProjecao] = useState<1 | 2 | 5>(1);

  // DADOS REAIS JAN-AGO 2025 (8 meses)
  const dadosReais = {
    meses: [
      { mes: 'Jan/25', receita: 485000, custos: 368500, lucro: 116500 },
      { mes: 'Fev/25', receita: 492000, custos: 375200, lucro: 116800 },
      { mes: 'Mar/25', receita: 510000, custos: 388400, lucro: 121600 },
      { mes: 'Abr/25', receita: 498000, custos: 379100, lucro: 118900 },
      { mes: 'Mai/25', receita: 505000, custos: 384200, lucro: 120800 },
      { mes: 'Jun/25', receita: 515000, custos: 391800, lucro: 123200 },
      { mes: 'Jul/25', receita: 508000, custos: 386500, lucro: 121500 },
      { mes: 'Ago/25', receita: 512000, custos: 389300, lucro: 122700 }
    ],
    totais: {
      receita: 4025000, // 8 meses
      custos: 3063000,
      lucro: 962000,
      mediaMensal: {
        receita: 503125,
        custos: 382875,
        lucro: 120250
      }
    }
  };

  // CÁLCULO DE IMPOSTOS POR REGIME (Jan-Ago 2025)
  const calcularImpostosHistorico = () => {
    const resultados = {
      lucroReal: { total: 0, meses: [] as any[] },
      lucroPresumido: { total: 0, meses: [] as any[] },
      simplesNacional: { total: 0, meses: [] as any[] }
    };

    dadosReais.meses.forEach(({ mes, receita, lucro }) => {
      // LUCRO REAL (atual EJG)
      const irpjReal = lucro * 0.15;
      const adicionalIRPJ = Math.max(0, (lucro - 20000) * 0.10);
      const csllReal = lucro * 0.09;
      const pisReal = receita * 0.0165;
      const cofinsReal = receita * 0.076;
      const icmsReal = receita * 0.12;
      const totalReal = irpjReal + adicionalIRPJ + csllReal + pisReal + cofinsReal + icmsReal;

      resultados.lucroReal.meses.push({ mes, valor: totalReal });
      resultados.lucroReal.total += totalReal;

      // LUCRO PRESUMIDO
      const basePresumida = receita * 0.08;
      const irpjPres = basePresumida * 0.15;
      const csllPres = basePresumida * 0.09;
      const pisPres = receita * 0.0065;
      const cofinsPres = receita * 0.03;
      const icmsPres = receita * 0.12;
      const totalPres = irpjPres + csllPres + pisPres + cofinsPres + icmsPres;

      resultados.lucroPresumido.meses.push({ mes, valor: totalPres });
      resultados.lucroPresumido.total += totalPres;

      // SIMPLES NACIONAL (Anexo III - Faixa 4: 10.7%)
      const faturamento12m = receita * 12; // extrapolação
      let aliquotaSimples = 10.7;
      if (faturamento12m > 4800000) {
        // Fora do Simples
        resultados.simplesNacional.meses.push({ mes, valor: null });
        return;
      } else if (faturamento12m > 1800000) {
        aliquotaSimples = 14.0;
      }
      const totalSimples = receita * (aliquotaSimples / 100);

      resultados.simplesNacional.meses.push({ mes, valor: totalSimples });
      resultados.simplesNacional.total += totalSimples;
    });

    return resultados;
  };

  const historico = calcularImpostosHistorico();

  // ECONOMIA JAN-AGO 2025 (8 meses)
  const economiaRealizada = {
    lucroRealVsPresumido: historico.lucroReal.total - historico.lucroPresumido.total,
    lucroRealVsSimples: historico.lucroReal.total - historico.simplesNacional.total,
    percentualPresumido: ((historico.lucroReal.total - historico.lucroPresumido.total) / historico.lucroReal.total) * 100,
    percentualSimples: ((historico.lucroReal.total - historico.simplesNacional.total) / historico.lucroReal.total) * 100
  };

  // PROJEÇÃO 1, 2 E 5 ANOS
  const projetarEconomia = (anos: number) => {
    const mesesTotal = anos * 12;
    const receitaMediaMensal = dadosReais.totais.mediaMensal.receita;
    const lucroMedioMensal = dadosReais.totais.mediaMensal.lucro;

    // Crescimento estimado: 3% ao ano (conservador)
    const taxaCrescimento = 1.03;
    
    let receitaProjetada = receitaMediaMensal;
    let lucroProjetado = lucroMedioMensal;
    
    let impostoRealTotal = 0;
    let impostoPresumidoTotal = 0;
    let impostoSimplesTotal = 0;

    for (let mes = 1; mes <= mesesTotal; mes++) {
      // Aplica crescimento anual
      if (mes % 12 === 0) {
        receitaProjetada *= taxaCrescimento;
        lucroProjetado *= taxaCrescimento;
      }

      // LUCRO REAL
      const irpjReal = lucroProjetado * 0.15;
      const adicionalIRPJ = Math.max(0, (lucroProjetado - 20000) * 0.10);
      const csllReal = lucroProjetado * 0.09;
      const pisReal = receitaProjetada * 0.0165;
      const cofinsReal = receitaProjetada * 0.076;
      const icmsReal = receitaProjetada * 0.12;
      impostoRealTotal += irpjReal + adicionalIRPJ + csllReal + pisReal + cofinsReal + icmsReal;

      // LUCRO PRESUMIDO
      const basePresumida = receitaProjetada * 0.08;
      const irpjPres = basePresumida * 0.15;
      const csllPres = basePresumida * 0.09;
      const pisPres = receitaProjetada * 0.0065;
      const cofinsPres = receitaProjetada * 0.03;
      const icmsPres = receitaProjetada * 0.12;
      impostoPresumidoTotal += irpjPres + csllPres + pisPres + cofinsPres + icmsPres;

      // SIMPLES NACIONAL
      const faturamentoAnual = receitaProjetada * 12;
      if (faturamentoAnual <= 4800000) {
        const aliquota = faturamentoAnual > 1800000 ? 14.0 : 10.7;
        impostoSimplesTotal += receitaProjetada * (aliquota / 100);
      } else {
        impostoSimplesTotal = null as any; // Fora do limite
      }
    }

    return {
      receitaTotal: receitaProjetada * mesesTotal,
      impostoReal: impostoRealTotal,
      impostoPresumido: impostoPresumidoTotal,
      impostoSimples: impostoSimplesTotal,
      economiaPresumido: impostoRealTotal - impostoPresumidoTotal,
      economiaSimples: impostoSimplesTotal ? impostoRealTotal - impostoSimplesTotal : null,
      percentualEconomiaPresumido: ((impostoRealTotal - impostoPresumidoTotal) / impostoRealTotal) * 100,
      percentualEconomiaSimples: impostoSimplesTotal ? ((impostoRealTotal - impostoSimplesTotal) / impostoRealTotal) * 100 : null
    };
  };

  const projecao1ano = projetarEconomia(1);
  const projecao2anos = projetarEconomia(2);
  const projecao5anos = projetarEconomia(5);

  const projecoes = {
    '1': projecao1ano,
    '2': projecao2anos,
    '5': projecao5anos
  };

  const projecaoAtual = projecoes[periodoProjecao];

  return (
    <div style={{ maxWidth: 1800, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <TrendingDown size={56} color="#10b981" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            📊 Projeção de Economia Tributária
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Análise Jan-Ago 2025 + Projeções 1, 2 e 5 anos
          </p>
        </div>
      </div>

      {/* RESUMO JAN-AGO 2025 */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        borderRadius: 16,
        padding: 32,
        marginBottom: 32,
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 'bold' }}>
          📈 Dados Reais Janeiro - Agosto 2025 (8 meses)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Receita Total</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              R$ {(dadosReais.totais.receita / 1000).toFixed(0)}k
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              Média: R$ {(dadosReais.totais.mediaMensal.receita / 1000).toFixed(0)}k/mês
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Custos Total</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              R$ {(dadosReais.totais.custos / 1000).toFixed(0)}k
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              Média: R$ {(dadosReais.totais.mediaMensal.custos / 1000).toFixed(0)}k/mês
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Lucro Total</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              R$ {(dadosReais.totais.lucro / 1000).toFixed(0)}k
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              Média: R$ {(dadosReais.totais.mediaMensal.lucro / 1000).toFixed(0)}k/mês
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Margem Média</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              {((dadosReais.totais.lucro / dadosReais.totais.receita) * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              Lucro / Receita
            </div>
          </div>
        </div>
      </div>

      {/* COMPARATIVO IMPOSTOS JAN-AGO 2025 */}
      <h3 style={{ color: '#e5e7eb', fontSize: 24, marginBottom: 16 }}>
        💸 Impostos Pagos Jan-Ago 2025 por Regime
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* LUCRO REAL (ATUAL) */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '3px solid #ef4444',
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ fontSize: 14, color: '#9aa3b0', marginBottom: 8 }}>
            ❌ LUCRO REAL (Atual EJG)
          </div>
          <div style={{ fontSize: 42, fontWeight: 'bold', color: '#ef4444', marginBottom: 12 }}>
            R$ {(historico.lucroReal.total / 1000).toFixed(0)}k
          </div>
          <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 16 }}>
            Média: R$ {(historico.lucroReal.total / 8 / 1000).toFixed(1)}k/mês
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.8 }}>
            • IRPJ: 15% + 10% adicional<br />
            • CSLL: 9%<br />
            • PIS: 1.65%<br />
            • COFINS: 7.6%<br />
            • ICMS: 12%<br />
            <strong>Carga: {((historico.lucroReal.total / dadosReais.totais.receita) * 100).toFixed(1)}%</strong>
          </div>
        </div>

        {/* LUCRO PRESUMIDO */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '3px solid #10b981',
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ fontSize: 14, color: '#9aa3b0', marginBottom: 8 }}>
            ✅ LUCRO PRESUMIDO (Recomendado)
          </div>
          <div style={{ fontSize: 42, fontWeight: 'bold', color: '#10b981', marginBottom: 12 }}>
            R$ {(historico.lucroPresumido.total / 1000).toFixed(0)}k
          </div>
          <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 16 }}>
            Média: R$ {(historico.lucroPresumido.total / 8 / 1000).toFixed(1)}k/mês
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.8 }}>
            • IRPJ: 15% sobre 8%<br />
            • CSLL: 9% sobre 8%<br />
            • PIS: 0.65%<br />
            • COFINS: 3%<br />
            • ICMS: 12%<br />
            <strong>Carga: {((historico.lucroPresumido.total / dadosReais.totais.receita) * 100).toFixed(1)}%</strong>
          </div>
        </div>

        {/* SIMPLES NACIONAL */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '3px solid #f59e0b',
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ fontSize: 14, color: '#9aa3b0', marginBottom: 8 }}>
            ⚠️ SIMPLES NACIONAL (Anexo III)
          </div>
          <div style={{ fontSize: 42, fontWeight: 'bold', color: '#f59e0b', marginBottom: 12 }}>
            R$ {(historico.simplesNacional.total / 1000).toFixed(0)}k
          </div>
          <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 16 }}>
            Média: R$ {(historico.simplesNacional.total / 8 / 1000).toFixed(1)}k/mês
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.8 }}>
            • Alíquota única: 10.7-14%<br />
            • Inclui todos impostos<br />
            • Limite: R$ 4.8M/ano<br />
            • Fora do limite se crescer<br />
            <br />
            <strong>Carga: {((historico.simplesNacional.total / dadosReais.totais.receita) * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      {/* ECONOMIA REALIZADA JAN-AGO */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: 16,
        padding: 32,
        marginBottom: 32,
        color: 'white'
      }}>
        <h3 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 'bold' }}>
          💰 Economia que EJG PERDEU em Jan-Ago 2025 (por estar no Lucro Real)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: 24, borderRadius: 12 }}>
            <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 8 }}>
              Se estivesse no LUCRO PRESUMIDO
            </div>
            <div style={{ fontSize: 48, fontWeight: 'bold' }}>
              R$ {(economiaRealizada.lucroRealVsPresumido / 1000).toFixed(0)}k
            </div>
            <div style={{ fontSize: 18, opacity: 0.9, marginTop: 8 }}>
              ({economiaRealizada.percentualPresumido.toFixed(1)}% de economia)
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 12 }}>
              Média: R$ {(economiaRealizada.lucroRealVsPresumido / 8 / 1000).toFixed(1)}k/mês economizados
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: 24, borderRadius: 12 }}>
            <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 8 }}>
              Se estivesse no SIMPLES NACIONAL
            </div>
            <div style={{ fontSize: 48, fontWeight: 'bold' }}>
              R$ {(economiaRealizada.lucroRealVsSimples / 1000).toFixed(0)}k
            </div>
            <div style={{ fontSize: 18, opacity: 0.9, marginTop: 8 }}>
              ({economiaRealizada.percentualSimples.toFixed(1)}% de economia)
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 12 }}>
              Média: R$ {(economiaRealizada.lucroRealVsSimples / 8 / 1000).toFixed(1)}k/mês economizados
            </div>
          </div>
        </div>
      </div>

      {/* SELETOR DE PERÍODO */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setPeriodoProjecao(1)}
          style={{
            flex: 1,
            padding: '16px 24px',
            background: periodoProjecao === 1 ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255,255,255,0.03)',
            border: periodoProjecao === 1 ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📅 1 ANO
        </button>
        <button
          onClick={() => setPeriodoProjecao(2)}
          style={{
            flex: 1,
            padding: '16px 24px',
            background: periodoProjecao === 2 ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'rgba(255,255,255,0.03)',
            border: periodoProjecao === 2 ? '2px solid #8b5cf6' : '2px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📅 2 ANOS
        </button>
        <button
          onClick={() => setPeriodoProjecao(5)}
          style={{
            flex: 1,
            padding: '16px 24px',
            background: periodoProjecao === 5 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.03)',
            border: periodoProjecao === 5 ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📅 5 ANOS
        </button>
      </div>

      {/* PROJEÇÕES */}
      <h3 style={{ color: '#e5e7eb', fontSize: 28, marginBottom: 16 }}>
        🔮 Projeção de Economia em {periodoProjecao} {periodoProjecao === 1 ? 'Ano' : 'Anos'}
      </h3>
      <p style={{ color: '#9aa3b0', fontSize: 14, marginBottom: 24 }}>
        Considerando crescimento de 3% ao ano (conservador) baseado nos dados Jan-Ago 2025
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* ECONOMIA LUCRO PRESUMIDO */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: 16,
          padding: 32,
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <TrendingDown size={40} />
            <h4 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>
              LUCRO PRESUMIDO
            </h4>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 8 }}>
              Economia Total em {periodoProjecao} {periodoProjecao === 1 ? 'Ano' : 'Anos'}
            </div>
            <div style={{ fontSize: 56, fontWeight: 'bold' }}>
              R$ {(projecaoAtual.economiaPresumido / 1000).toFixed(0)}k
            </div>
            <div style={{ fontSize: 20, opacity: 0.9, marginTop: 8 }}>
              ({projecaoAtual.percentualEconomiaPresumido.toFixed(1)}% menos impostos)
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', padding: 20, borderRadius: 12 }}>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>Detalhes:</div>
            <div style={{ fontSize: 15, lineHeight: 2 }}>
              • Imposto Lucro Real: <strong>R$ {(projecaoAtual.impostoReal / 1000).toFixed(0)}k</strong><br />
              • Imposto Presumido: <strong>R$ {(projecaoAtual.impostoPresumido / 1000).toFixed(0)}k</strong><br />
              • Economia mensal: <strong>R$ {(projecaoAtual.economiaPresumido / (periodoProjecao * 12) / 1000).toFixed(1)}k</strong><br />
              • Economia anual: <strong>R$ {(projecaoAtual.economiaPresumido / periodoProjecao / 1000).toFixed(0)}k</strong>
            </div>
          </div>
        </div>

        {/* ECONOMIA SIMPLES NACIONAL */}
        <div style={{
          background: projecaoAtual.economiaSimples && projecaoAtual.economiaSimples > 0
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          borderRadius: 16,
          padding: 32,
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <AlertCircle size={40} />
            <h4 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>
              SIMPLES NACIONAL
            </h4>
          </div>

          {projecaoAtual.economiaSimples !== null ? (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 8 }}>
                  Economia Total em {periodoProjecao} {periodoProjecao === 1 ? 'Ano' : 'Anos'}
                </div>
                <div style={{ fontSize: 56, fontWeight: 'bold' }}>
                  R$ {(projecaoAtual.economiaSimples / 1000).toFixed(0)}k
                </div>
                <div style={{ fontSize: 20, opacity: 0.9, marginTop: 8 }}>
                  ({projecaoAtual.percentualEconomiaSimples!.toFixed(1)}% menos impostos)
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.15)', padding: 20, borderRadius: 12 }}>
                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>Detalhes:</div>
                <div style={{ fontSize: 15, lineHeight: 2 }}>
                  • Imposto Lucro Real: <strong>R$ {(projecaoAtual.impostoReal / 1000).toFixed(0)}k</strong><br />
                  • Imposto Simples: <strong>R$ {(projecaoAtual.impostoSimples / 1000).toFixed(0)}k</strong><br />
                  • Economia mensal: <strong>R$ {(projecaoAtual.economiaSimples / (periodoProjecao * 12) / 1000).toFixed(1)}k</strong><br />
                  • Economia anual: <strong>R$ {(projecaoAtual.economiaSimples / periodoProjecao / 1000).toFixed(0)}k</strong>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <AlertCircle size={64} style={{ marginBottom: 16, opacity: 0.5 }} />
              <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
                FORA DO LIMITE
              </div>
              <div style={{ fontSize: 15, opacity: 0.8, lineHeight: 1.6 }}>
                Com crescimento de 3% ao ano, EJG ultrapassará o limite de R$ 4.8M/ano do Simples Nacional.<br />
                <br />
                <strong>Simples não é opção viável neste cenário.</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMPARATIVO VISUAL */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 32
      }}>
        <h4 style={{ margin: '0 0 24px', color: '#e5e7eb', fontSize: 22 }}>
          📊 Comparativo Visual - {periodoProjecao} {periodoProjecao === 1 ? 'Ano' : 'Anos'}
        </h4>

        <div style={{ display: 'grid', gap: 16 }}>
          {/* LUCRO REAL */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#9aa3b0', fontSize: 14 }}>Lucro Real (Atual)</span>
              <span style={{ color: '#ef4444', fontSize: 16, fontWeight: 'bold' }}>
                R$ {(projecaoAtual.impostoReal / 1000).toFixed(0)}k
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, height: 40, overflow: 'hidden' }}>
              <div style={{
                background: '#ef4444',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                color: 'white'
              }}>
                BASE (100%)
              </div>
            </div>
          </div>

          {/* LUCRO PRESUMIDO */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#9aa3b0', fontSize: 14 }}>Lucro Presumido (Recomendado)</span>
              <span style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>
                R$ {(projecaoAtual.impostoPresumido / 1000).toFixed(0)}k (-{projecaoAtual.percentualEconomiaPresumido.toFixed(0)}%)
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, height: 40, overflow: 'hidden' }}>
              <div style={{
                background: '#10b981',
                width: `${(projecaoAtual.impostoPresumido / projecaoAtual.impostoReal) * 100}%`,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                color: 'white'
              }}>
                {((projecaoAtual.impostoPresumido / projecaoAtual.impostoReal) * 100).toFixed(0)}% DO REAL
              </div>
            </div>
          </div>

          {/* SIMPLES NACIONAL */}
          {projecaoAtual.impostoSimples && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#9aa3b0', fontSize: 14 }}>Simples Nacional</span>
                <span style={{ color: '#f59e0b', fontSize: 16, fontWeight: 'bold' }}>
                  R$ {(projecaoAtual.impostoSimples / 1000).toFixed(0)}k (-{projecaoAtual.percentualEconomiaSimples!.toFixed(0)}%)
                </span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, height: 40, overflow: 'hidden' }}>
                <div style={{
                  background: '#f59e0b',
                  width: `${(projecaoAtual.impostoSimples / projecaoAtual.impostoReal) * 100}%`,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {((projecaoAtual.impostoSimples / projecaoAtual.impostoReal) * 100).toFixed(0)}% DO REAL
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECOMENDAÇÃO FINAL */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: 16,
        padding: 32,
        marginTop: 32,
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <TrendingDown size={48} />
          <h3 style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>
            ✅ RECOMENDAÇÃO DEFINITIVA
          </h3>
        </div>

        <div style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 24 }}>
          Baseado nos dados reais de Jan-Ago 2025 e nas projeções futuras:<br />
          <br />
          <strong style={{ fontSize: 24 }}>
            EJG deve MIGRAR para LUCRO PRESUMIDO em Janeiro/2026
          </strong>
          <br />
          <br />
          Economia estimada:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, background: 'rgba(255,255,255,0.15)', padding: 24, borderRadius: 12 }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Em 1 ano</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              R$ {(projecao1ano.economiaPresumido / 1000).toFixed(0)}k
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Em 2 anos</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              R$ {(projecao2anos.economiaPresumido / 1000).toFixed(0)}k
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Em 5 anos</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>
              R$ {(projecao5anos.economiaPresumido / 1000).toFixed(0)}k
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, fontSize: 15, lineHeight: 1.8, opacity: 0.95 }}>
          💡 <strong>Próximos passos:</strong><br />
          1. Consultar contador especializado em tributação<br />
          2. Solicitar simulação completa do Lucro Presumido<br />
          3. Preparar documentação para mudança de regime<br />
          4. Protocolar alteração na Receita Federal até 31/Dez/2025<br />
          5. Implementar controles contábeis adequados
        </div>
      </div>
    </div>
  );
}
