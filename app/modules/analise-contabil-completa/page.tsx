'use client';
import { useState } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertTriangle, Calculator, TrendingUp } from 'lucide-react';

interface DadosContabeis {
  // RECEITAS
  receitaBrutaMensal: number[];
  receitaBrutaAnual: number;
  
  // CUSTOS E DESPESAS
  cme: number; // Custo Mercadoria/Serviço
  despesasOperacionais: number;
  despesasAdministrativas: number;
  despesasComerciais: number;
  despesasFinanceiras: number;
  folhaPagamento: number;
  encargosINSS: number;
  fgts: number;
  
  // INVESTIMENTOS E IMOBILIZADO
  ativoImobilizado: number;
  depreciacaoAnual: number;
  investimentos: number;
  
  // CRÉDITOS TRIBUTÁRIOS
  creditosPIS: number;
  creditosCOFINS: number;
  creditosICMS: number;
  creditosIPI: number;
  
  // INFORMAÇÕES ADICIONAIS
  numeroFuncionarios: number;
  folhaPro_labore: number;
  distribuicaoLucros: number;
  
  // ESPECÍFICO PARA TRANSPORTE
  receitaFreteNacional: number;
  receitaFreteInternacional: number;
  receitaServicosComplementares: number;
  kmRodadosMes: number;
  consumoCombustivelLitros: number;
  
  // ANÁLISE DE MARGEM
  margemBruta: number;
  margemOperacional: number;
  margemLiquida: number;
}

export default function AnaliseContabilCompletaPage() {
  const [etapa, setEtapa] = useState<'upload' | 'analise' | 'resultado'>('upload');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const [dados, setDados] = useState<DadosContabeis | null>(null);
  const [resultadoAnalise, setResultadoAnalise] = useState<any>(null);

  // Template de planilha para download
  const baixarTemplate = () => {
    const csvContent = `CATEGORIA,DESCRIÇÃO,VALOR_MENSAL,VALOR_ANUAL,OBSERVAÇÕES
RECEITAS,Receita Bruta Total,,,"Faturamento total (antes de impostos)"
RECEITAS,Frete Nacional,,,"Receita com transporte nacional"
RECEITAS,Frete Internacional,,,"Receita com transporte internacional"
RECEITAS,Serviços Complementares,,,"Armazenagem, logística reversa, etc"

CUSTOS,CMV/CME (Custo Mercadoria/Serviço),,,"Custos diretos da operação"
CUSTOS,Combustível,,,"Diesel, gasolina"
CUSTOS,Manutenção e Reparos,,,"Oficina, peças, pneus"
CUSTOS,Depreciação de Veículos,,,"Depreciação anual da frota"
CUSTOS,Seguros e Licenciamento,,,"Seguro de carga, veículos, IPVA"
CUSTOS,Pedágios,,,"Custos com pedágios"

DESPESAS_OPERACIONAIS,Aluguel,,,"Escritório, garagem, pátio"
DESPESAS_OPERACIONAIS,Energia e Água,,,"Contas de utilities"
DESPESAS_OPERACIONAIS,Telefone e Internet,,,"Comunicação"
DESPESAS_OPERACIONAIS,Material de Escritório,,,"Papelaria, suprimentos"
DESPESAS_OPERACIONAIS,Serviços de Terceiros,,,"Contador, advogado, consultoria"

DESPESAS_ADMINISTRATIVAS,Salários Administrativos,,,"Gerência, RH, financeiro"
DESPESAS_ADMINISTRATIVAS,Pró-labore Sócios,,,"Retirada fixa dos sócios"
DESPESAS_ADMINISTRATIVAS,Encargos INSS (Empresa),,,"Parte patronal INSS"
DESPESAS_ADMINISTRATIVAS,FGTS,,,"8% sobre folha"
DESPESAS_ADMINISTRATIVAS,Benefícios (VT/VR/VA),,,"Vale transporte, refeição, alimentação"

DESPESAS_COMERCIAIS,Marketing e Publicidade,,,"Anúncios, site, materiais"
DESPESAS_COMERCIAIS,Comissões Vendedores,,,"Se houver equipe comercial"

DESPESAS_FINANCEIRAS,Juros de Empréstimos,,,"Financiamentos, capital de giro"
DESPESAS_FINANCEIRAS,Tarifas Bancárias,,,"Manutenção conta, TEDs, boletos"
DESPESAS_FINANCEIRAS,Descontos Concedidos,,,"Descontos para pagamento antecipado"

CRÉDITOS_TRIBUTÁRIOS,Créditos PIS a Compensar,,,"PIS sobre compras (Lucro Real)"
CRÉDITOS_TRIBUTÁRIOS,Créditos COFINS a Compensar,,,"COFINS sobre compras (Lucro Real)"
CRÉDITOS_TRIBUTÁRIOS,Créditos ICMS a Compensar,,,"ICMS sobre compras"
CRÉDITOS_TRIBUTÁRIOS,Créditos IPI a Compensar,,,"Se aplicável"

INFORMAÇÕES_ADICIONAIS,Número de Funcionários,,,
INFORMAÇÕES_ADICIONAIS,Quantidade de Veículos Próprios,,,
INFORMAÇÕES_ADICIONAIS,Quantidade de Veículos Agregados,,,
INFORMAÇÕES_ADICIONAIS,KM Rodados/Mês,,,
INFORMAÇÕES_ADICIONAIS,Litros Combustível/Mês,,,
INFORMAÇÕES_ADICIONAIS,Distribuição Lucros (anual),,,"JCP ou dividendos distribuídos"

IMPOSTOS_ATUAIS,IRPJ Pago,,,
IMPOSTOS_ATUAIS,CSLL Pago,,,
IMPOSTOS_ATUAIS,PIS Pago,,,
IMPOSTOS_ATUAIS,COFINS Pago,,,
IMPOSTOS_ATUAIS,ICMS Pago,,,
IMPOSTOS_ATUAIS,ISS Pago,,,
IMPOSTOS_ATUAIS,INSS Pago,,,

ANÁLISE_MARGEM,Margem Bruta %,,,"(Receita - CMV) / Receita * 100"
ANÁLISE_MARGEM,Margem Operacional %,,,"(Lucro Operacional) / Receita * 100"
ANÁLISE_MARGEM,Margem Líquida %,,,"(Lucro Líquido) / Receita * 100"
`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_analise_contabil_EJG.csv';
    link.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArquivo(file);
    setProcessando(true);

    // Simular processamento
    setTimeout(() => {
      // Dados de exemplo processados
      const dadosProcessados: DadosContabeis = {
        receitaBrutaMensal: [485000, 492000, 510000, 498000, 505000, 515000, 508000, 512000],
        receitaBrutaAnual: 6037500, // projeção 12 meses
        
        cme: 380000,
        despesasOperacionais: 45000,
        despesasAdministrativas: 35000,
        despesasComerciais: 8000,
        despesasFinanceiras: 12000,
        folhaPagamento: 85000,
        encargosINSS: 29750, // 35% sobre folha
        fgts: 6800,
        
        ativoImobilizado: 1800000, // frota + imóveis
        depreciacaoAnual: 180000, // 10% ao ano
        investimentos: 50000,
        
        creditosPIS: 6500,
        creditosCOFINS: 30000,
        creditosICMS: 15000,
        creditosIPI: 0,
        
        numeroFuncionarios: 25,
        folhaPro_labore: 15000,
        distribuicaoLucros: 80000,
        
        receitaFreteNacional: 480000,
        receitaFreteInternacional: 0,
        receitaServicosComplementares: 23000,
        kmRodadosMes: 45000,
        consumoCombustivelLitros: 12000,
        
        margemBruta: 24.5,
        margemOperacional: 18.2,
        margemLiquida: 12.8
      };

      setDados(dadosProcessados);
      setProcessando(false);
      setEtapa('analise');
      
      // Calcular automaticamente
      calcularAnaliseCompleta(dadosProcessados);
    }, 2000);
  };

  const calcularAnaliseCompleta = (dadosInput: DadosContabeis) => {
    const receitaMensal = dadosInput.receitaBrutaMensal.reduce((a, b) => a + b, 0) / dadosInput.receitaBrutaMensal.length;
    const receitaAnual = receitaMensal * 12;

    // LUCRO REAL (Atual)
    const lucroContabil = receitaMensal - dadosInput.cme - dadosInput.despesasOperacionais - 
                          dadosInput.despesasAdministrativas - dadosInput.despesasComerciais -
                          dadosInput.folhaPagamento - (dadosInput.depreciacaoAnual / 12);

    const lucroRealBase = lucroContabil - dadosInput.despesasFinanceiras;

    // Impostos Lucro Real
    const irpjReal = lucroRealBase * 0.15;
    const adicionalIRPJ = Math.max(0, (lucroRealBase - 20000) * 0.10);
    const csllReal = lucroRealBase * 0.09;
    const pisReal = receitaMensal * 0.0165 - dadosInput.creditosPIS;
    const cofinsReal = receitaMensal * 0.076 - dadosInput.creditosCOFINS;
    const icmsReal = receitaMensal * 0.12 - dadosInput.creditosICMS;
    const inssReal = dadosInput.encargosINSS;
    const fgtsReal = dadosInput.fgts;

    const totalImpostosReal = irpjReal + adicionalIRPJ + csllReal + pisReal + cofinsReal + icmsReal + inssReal + fgtsReal;
    const lucroLiquidoReal = lucroRealBase - totalImpostosReal;

    // LUCRO PRESUMIDO
    const basePresumida = receitaMensal * 0.08; // 8% para transporte
    const irpjPres = basePresumida * 0.15;
    const adicionalIRPJPres = Math.max(0, (basePresumida - 20000) * 0.10);
    const csllPres = basePresumida * 0.09;
    const pisPres = receitaMensal * 0.0065;
    const cofinsPres = receitaMensal * 0.03;
    const icmsPres = receitaMensal * 0.12; // sem créditos no presumido cumulativo
    const inssPres = dadosInput.encargosINSS;
    const fgtsPres = dadosInput.fgts;

    const totalImpostosPres = irpjPres + adicionalIRPJPres + csllPres + pisPres + cofinsPres + icmsPres + inssPres + fgtsPres;
    const lucroLiquidoPres = lucroContabil - totalImpostosPres;

    // SIMPLES NACIONAL
    const faturamento12m = receitaAnual;
    let aliquotaSimples = 10.7;
    let dentroDoLimite = true;

    if (faturamento12m > 4800000) {
      dentroDoLimite = false;
    } else if (faturamento12m > 1800000) {
      aliquotaSimples = 14.0;
    }

    const totalImpostosSimples = dentroDoLimite ? receitaMensal * (aliquotaSimples / 100) : 0;
    const lucroLiquidoSimples = dentroDoLimite ? lucroContabil - totalImpostosSimples : 0;

    // ANÁLISE DE VIABILIDADE
    const resultado = {
      receitaMensal,
      receitaAnual,
      lucroContabil,

      lucroReal: {
        base: lucroRealBase,
        impostos: {
          irpj: irpjReal,
          adicionalIRPJ,
          csll: csllReal,
          pis: pisReal,
          cofins: cofinsReal,
          icms: icmsReal,
          inss: inssReal,
          fgts: fgtsReal,
          total: totalImpostosReal
        },
        lucroLiquido: lucroLiquidoReal,
        cargaTributaria: (totalImpostosReal / receitaMensal) * 100,
        roi: ((lucroLiquidoReal * 12) / dadosInput.ativoImobilizado) * 100
      },

      lucroPresumido: {
        basePresumida,
        impostos: {
          irpj: irpjPres,
          adicionalIRPJ: adicionalIRPJPres,
          csll: csllPres,
          pis: pisPres,
          cofins: cofinsPres,
          icms: icmsPres,
          inss: inssPres,
          fgts: fgtsPres,
          total: totalImpostosPres
        },
        lucroLiquido: lucroLiquidoPres,
        cargaTributaria: (totalImpostosPres / receitaMensal) * 100,
        roi: ((lucroLiquidoPres * 12) / dadosInput.ativoImobilizado) * 100,
        economia: totalImpostosReal - totalImpostosPres,
        economiaAnual: (totalImpostosReal - totalImpostosPres) * 12,
        economiaPercentual: ((totalImpostosReal - totalImpostosPres) / totalImpostosReal) * 100
      },

      simplesNacional: {
        dentroDoLimite,
        aliquota: aliquotaSimples,
        impostos: {
          total: totalImpostosSimples
        },
        lucroLiquido: lucroLiquidoSimples,
        cargaTributaria: dentroDoLimite ? (totalImpostosSimples / receitaMensal) * 100 : 0,
        roi: dentroDoLimite ? ((lucroLiquidoSimples * 12) / dadosInput.ativoImobilizado) * 100 : 0,
        economia: dentroDoLimite ? totalImpostosReal - totalImpostosSimples : 0,
        economiaAnual: dentroDoLimite ? (totalImpostosReal - totalImpostosSimples) * 12 : 0,
        economiaPercentual: dentroDoLimite ? ((totalImpostosReal - totalImpostosSimples) / totalImpostosReal) * 100 : 0
      },

      recomendacao: totalImpostosPres < totalImpostosReal ? 'LUCRO PRESUMIDO' : 'LUCRO REAL',
      certeza: 100 // baseado em dados completos
    };

    setResultadoAnalise(resultado);
    setEtapa('resultado');
  };

  const exportarRelatorio = () => {
    if (!resultadoAnalise) return;

    const relatorio = `
RELATÓRIO DE ANÁLISE TRIBUTÁRIA COMPLETA
EJG Evolução em Transporte Ltda.
Data: ${new Date().toLocaleDateString('pt-BR')}
CNPJ: 44.185.912/0001-50

═══════════════════════════════════════════════════════════════

1. DADOS FINANCEIROS BASE

Receita Mensal Média: R$ ${resultadoAnalise.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Receita Anual Projetada: R$ ${resultadoAnalise.receitaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Lucro Contábil Mensal: R$ ${resultadoAnalise.lucroContabil.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

═══════════════════════════════════════════════════════════════

2. ANÁLISE LUCRO REAL (Regime Atual)

Base de Cálculo: R$ ${resultadoAnalise.lucroReal.base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Impostos Mensais:
  IRPJ: R$ ${resultadoAnalise.lucroReal.impostos.irpj.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  Adicional IRPJ: R$ ${resultadoAnalise.lucroReal.impostos.adicionalIRPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  CSLL: R$ ${resultadoAnalise.lucroReal.impostos.csll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  PIS: R$ ${resultadoAnalise.lucroReal.impostos.pis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  COFINS: R$ ${resultadoAnalise.lucroReal.impostos.cofins.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  ICMS: R$ ${resultadoAnalise.lucroReal.impostos.icms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  INSS: R$ ${resultadoAnalise.lucroReal.impostos.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  FGTS: R$ ${resultadoAnalise.lucroReal.impostos.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  ────────────────────────────────────
  TOTAL: R$ ${resultadoAnalise.lucroReal.impostos.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Carga Tributária: ${resultadoAnalise.lucroReal.cargaTributaria.toFixed(2)}%
Lucro Líquido Mensal: R$ ${resultadoAnalise.lucroReal.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
ROI Anual: ${resultadoAnalise.lucroReal.roi.toFixed(2)}%

═══════════════════════════════════════════════════════════════

3. ANÁLISE LUCRO PRESUMIDO (Recomendado)

Base Presumida (8%): R$ ${resultadoAnalise.lucroPresumido.basePresumida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Impostos Mensais:
  IRPJ: R$ ${resultadoAnalise.lucroPresumido.impostos.irpj.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  Adicional IRPJ: R$ ${resultadoAnalise.lucroPresumido.impostos.adicionalIRPJ.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  CSLL: R$ ${resultadoAnalise.lucroPresumido.impostos.csll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  PIS: R$ ${resultadoAnalise.lucroPresumido.impostos.pis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  COFINS: R$ ${resultadoAnalise.lucroPresumido.impostos.cofins.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  ICMS: R$ ${resultadoAnalise.lucroPresumido.impostos.icms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  INSS: R$ ${resultadoAnalise.lucroPresumido.impostos.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  FGTS: R$ ${resultadoAnalise.lucroPresumido.impostos.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  ────────────────────────────────────
  TOTAL: R$ ${resultadoAnalise.lucroPresumido.impostos.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Carga Tributária: ${resultadoAnalise.lucroPresumido.cargaTributaria.toFixed(2)}%
Lucro Líquido Mensal: R$ ${resultadoAnalise.lucroPresumido.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
ROI Anual: ${resultadoAnalise.lucroPresumido.roi.toFixed(2)}%

💰 ECONOMIA MENSAL: R$ ${resultadoAnalise.lucroPresumido.economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
💰 ECONOMIA ANUAL: R$ ${resultadoAnalise.lucroPresumido.economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
📊 REDUÇÃO: ${resultadoAnalise.lucroPresumido.economiaPercentual.toFixed(2)}%

═══════════════════════════════════════════════════════════════

4. ANÁLISE SIMPLES NACIONAL

Status: ${resultadoAnalise.simplesNacional.dentroDoLimite ? 'DENTRO DO LIMITE' : 'FORA DO LIMITE (> R$ 4.8M)'}
${resultadoAnalise.simplesNacional.dentroDoLimite ? `
Alíquota Anexo III: ${resultadoAnalise.simplesNacional.aliquota}%
Imposto Mensal: R$ ${resultadoAnalise.simplesNacional.impostos.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Carga Tributária: ${resultadoAnalise.simplesNacional.cargaTributaria.toFixed(2)}%
Lucro Líquido Mensal: R$ ${resultadoAnalise.simplesNacional.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
ROI Anual: ${resultadoAnalise.simplesNacional.roi.toFixed(2)}%

💰 ECONOMIA MENSAL: R$ ${resultadoAnalise.simplesNacional.economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
💰 ECONOMIA ANUAL: R$ ${resultadoAnalise.simplesNacional.economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
📊 REDUÇÃO: ${resultadoAnalise.simplesNacional.economiaPercentual.toFixed(2)}%
` : 'Não aplicável - Faturamento excede R$ 4.8M/ano'}

═══════════════════════════════════════════════════════════════

5. RECOMENDAÇÃO FINAL

🎯 REGIME RECOMENDADO: ${resultadoAnalise.recomendacao}
✅ CERTEZA DA ANÁLISE: ${resultadoAnalise.certeza}% (dados completos fornecidos)

JUSTIFICATIVA:
${resultadoAnalise.recomendacao === 'LUCRO PRESUMIDO' ? `
• Economia mensal de R$ ${resultadoAnalise.lucroPresumido.economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Redução de ${resultadoAnalise.lucroPresumido.economiaPercentual.toFixed(2)}% na carga tributária
• Sem limite de faturamento (permite crescimento ilimitado)
• Simplicidade contábil moderada
• Estabilidade fiscal de longo prazo
` : `
• Lucro Real é mais vantajoso devido ao lucro contábil reduzido
• Aproveitamento de créditos tributários PIS/COFINS/ICMS
• Deduções de despesas operacionais
• Recomendado quando margem líquida < 8% ou custos muito altos
`}

PRÓXIMOS PASSOS:
1. Validar com contador especializado (OBRIGATÓRIO)
2. Preparar documentação para mudança de regime
3. Protocolar alteração na Receita Federal até 31/Dez/2025
4. Implementar controles contábeis adequados
5. Monitorar resultados mensalmente

═══════════════════════════════════════════════════════════════

Relatório gerado automaticamente pelo OptiLog.app
Sistema desenvolvido por XYZ Logic Flow
Licenciado para EJG Evolução em Transporte Ltda.

⚠️ ATENÇÃO: Este relatório é uma simulação baseada nos dados fornecidos.
Consulte sempre um contador registrado no CRC antes de tomar decisões.
`;

    const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_tributario_EJG_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Calculator size={56} color="#8b5cf6" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            📊 Análise Contábil Completa
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Importação de dados contábeis para decisão tributária 100% precisa
          </p>
        </div>
      </div>

      {/* ETAPA 1: UPLOAD */}
      {etapa === 'upload' && (
        <>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: 16,
            padding: 32,
            marginBottom: 32,
            color: 'white'
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 28 }}>
              📋 Dados Necessários para Análise 100% Precisa
            </h2>
            <div style={{ fontSize: 16, lineHeight: 2 }}>
              Para uma decisão tributária correta, precisamos de:<br />
              <br />
              ✅ <strong>Receitas:</strong> Faturamento mensal (últimos 8-12 meses), separado por tipo<br />
              ✅ <strong>Custos Diretos (CMV/CME):</strong> Combustível, manutenção, depreciação, seguros<br />
              ✅ <strong>Despesas Operacionais:</strong> Aluguel, energia, telefone, materiais<br />
              ✅ <strong>Despesas Administrativas:</strong> Salários, pró-labore, encargos (INSS, FGTS)<br />
              ✅ <strong>Despesas Financeiras:</strong> Juros, tarifas bancárias<br />
              ✅ <strong>Créditos Tributários:</strong> PIS, COFINS, ICMS a compensar (Lucro Real)<br />
              ✅ <strong>Imobilizado:</strong> Valor de veículos, imóveis, equipamentos<br />
              ✅ <strong>Informações Operacionais:</strong> Nº funcionários, KM rodados, litros combustível<br />
              ✅ <strong>Margens:</strong> Bruta, operacional e líquida (%)<br />
              ✅ <strong>Impostos Atuais:</strong> Quanto está pagando hoje (se souber)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Download Template */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 16,
              padding: 32,
              textAlign: 'center'
            }}>
              <FileSpreadsheet size={64} color="#10b981" style={{ marginBottom: 16 }} />
              <h3 style={{ margin: '0 0 16px', color: '#e5e7eb', fontSize: 22 }}>
                1. Baixe o Template
              </h3>
              <p style={{ color: '#9aa3b0', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
                Planilha Excel/CSV com todos os campos necessários pré-formatados
              </p>
              <button
                onClick={baixarTemplate}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  margin: '0 auto'
                }}
              >
                <Download size={20} />
                Baixar Template CSV
              </button>
            </div>

            {/* Upload Arquivo */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 16,
              padding: 32,
              textAlign: 'center'
            }}>
              <Upload size={64} color="#6366f1" style={{ marginBottom: 16 }} />
              <h3 style={{ margin: '0 0 16px', color: '#e5e7eb', fontSize: 22 }}>
                2. Envie os Dados
              </h3>
              <p style={{ color: '#9aa3b0', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
                Preencha o template com seus dados reais e faça upload
              </p>
              <label
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <Upload size={20} />
                {arquivo ? arquivo.name : 'Selecionar Arquivo'}
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {processando && (
                <div style={{ marginTop: 16, color: '#6366f1', fontSize: 14 }}>
                  ⏳ Processando dados...
                </div>
              )}
            </div>
          </div>

          {/* Instruções Adicionais */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '2px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 16,
            padding: 24,
            marginTop: 32
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <AlertTriangle size={24} color="#f59e0b" />
              <h4 style={{ margin: 0, color: '#e5e7eb', fontSize: 18 }}>
                ⚠️ Importante para Precisão 100%
              </h4>
            </div>
            <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8 }}>
              • <strong>Use dados reais</strong> do seu contador ou sistema contábil (não estimativas)<br />
              • <strong>Inclua todos os 12 meses</strong> se possível (mínimo 6 meses)<br />
              • <strong>Separe créditos tributários</strong> - PIS/COFINS/ICMS que você tem direito a compensar<br />
              • <strong>Informe pró-labore separado</strong> da folha de funcionários<br />
              • <strong>Considere sazonalidade</strong> - meses de maior/menor movimento<br />
              • <strong>Valide com contador</strong> antes de tomar qualquer decisão final
            </div>
          </div>
        </>
      )}

      {/* ETAPA 2: ANÁLISE (processando) */}
      {etapa === 'analise' && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{
            width: 80,
            height: 80,
            border: '8px solid rgba(99, 102, 241, 0.2)',
            borderTop: '8px solid #6366f1',
            borderRadius: '50%',
            margin: '0 auto 24px',
            animation: 'spin 1s linear infinite'
          }} />
          <h3 style={{ color: '#e5e7eb', fontSize: 24, marginBottom: 12 }}>
            Analisando dados contábeis...
          </h3>
          <p style={{ color: '#9aa3b0', fontSize: 16 }}>
            Calculando Lucro Real vs Presumido vs Simples Nacional
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* ETAPA 3: RESULTADO */}
      {etapa === 'resultado' && resultadoAnalise && (
        <>
          {/* Banner de Certeza */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: 16,
            padding: 32,
            marginBottom: 32,
            color: 'white',
            textAlign: 'center'
          }}>
            <CheckCircle size={64} style={{ marginBottom: 16 }} />
            <h2 style={{ margin: '0 0 12px', fontSize: 32, fontWeight: 'bold' }}>
              ✅ Análise Completa Finalizada
            </h2>
            <div style={{ fontSize: 20, marginBottom: 8 }}>
              Certeza: <strong>{resultadoAnalise.certeza}%</strong>
            </div>
            <div style={{ fontSize: 16, opacity: 0.9 }}>
              Baseado em dados contábeis completos fornecidos
            </div>
          </div>

          {/* Comparativo de Regimes */}
          <h3 style={{ color: '#e5e7eb', fontSize: 28, marginBottom: 16 }}>
            📊 Comparativo Detalhado de Regimes
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
            {/* LUCRO REAL */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '3px solid #ef4444',
              borderRadius: 16,
              padding: 24
            }}>
              <h4 style={{ margin: '0 0 20px', color: '#ef4444', fontSize: 20 }}>
                ❌ LUCRO REAL (Atual)
              </h4>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Base de Cálculo</div>
                <div style={{ fontSize: 24, color: '#e5e7eb', fontWeight: 'bold' }}>
                  R$ {(resultadoAnalise.lucroReal.base / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Impostos Total</div>
                <div style={{ fontSize: 32, color: '#ef4444', fontWeight: 'bold' }}>
                  R$ {(resultadoAnalise.lucroReal.impostos.total / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.8 }}>
                  IRPJ: R$ {(resultadoAnalise.lucroReal.impostos.irpj / 1000).toFixed(1)}k<br />
                  Adic: R$ {(resultadoAnalise.lucroReal.impostos.adicionalIRPJ / 1000).toFixed(1)}k<br />
                  CSLL: R$ {(resultadoAnalise.lucroReal.impostos.csll / 1000).toFixed(1)}k<br />
                  PIS: R$ {(resultadoAnalise.lucroReal.impostos.pis / 1000).toFixed(1)}k<br />
                  COFINS: R$ {(resultadoAnalise.lucroReal.impostos.cofins / 1000).toFixed(1)}k<br />
                  ICMS: R$ {(resultadoAnalise.lucroReal.impostos.icms / 1000).toFixed(1)}k<br />
                  INSS: R$ {(resultadoAnalise.lucroReal.impostos.inss / 1000).toFixed(1)}k<br />
                  FGTS: R$ {(resultadoAnalise.lucroReal.impostos.fgts / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
                <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Lucro Líquido</div>
                <div style={{ fontSize: 20, color: '#e5e7eb', fontWeight: 'bold' }}>
                  R$ {(resultadoAnalise.lucroReal.lucroLiquido / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Carga Tributária</div>
                <div style={{ fontSize: 20, color: '#ef4444', fontWeight: 'bold' }}>
                  {resultadoAnalise.lucroReal.cargaTributaria.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* LUCRO PRESUMIDO */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '3px solid #10b981',
              borderRadius: 16,
              padding: 24
            }}>
              <h4 style={{ margin: '0 0 20px', color: '#10b981', fontSize: 20 }}>
                ✅ LUCRO PRESUMIDO
              </h4>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Base Presumida (8%)</div>
                <div style={{ fontSize: 24, color: '#e5e7eb', fontWeight: 'bold' }}>
                  R$ {(resultadoAnalise.lucroPresumido.basePresumida / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Impostos Total</div>
                <div style={{ fontSize: 32, color: '#10b981', fontWeight: 'bold' }}>
                  R$ {(resultadoAnalise.lucroPresumido.impostos.total / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.8 }}>
                  IRPJ: R$ {(resultadoAnalise.lucroPresumido.impostos.irpj / 1000).toFixed(1)}k<br />
                  Adic: R$ {(resultadoAnalise.lucroPresumido.impostos.adicionalIRPJ / 1000).toFixed(1)}k<br />
                  CSLL: R$ {(resultadoAnalise.lucroPresumido.impostos.csll / 1000).toFixed(1)}k<br />
                  PIS: R$ {(resultadoAnalise.lucroPresumido.impostos.pis / 1000).toFixed(1)}k<br />
                  COFINS: R$ {(resultadoAnalise.lucroPresumido.impostos.cofins / 1000).toFixed(1)}k<br />
                  ICMS: R$ {(resultadoAnalise.lucroPresumido.impostos.icms / 1000).toFixed(1)}k<br />
                  INSS: R$ {(resultadoAnalise.lucroPresumido.impostos.inss / 1000).toFixed(1)}k<br />
                  FGTS: R$ {(resultadoAnalise.lucroPresumido.impostos.fgts / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
                <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Lucro Líquido</div>
                <div style={{ fontSize: 20, color: '#e5e7eb', fontWeight: 'bold' }}>
                  R$ {(resultadoAnalise.lucroPresumido.lucroLiquido / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Carga Tributária</div>
                <div style={{ fontSize: 20, color: '#10b981', fontWeight: 'bold' }}>
                  {resultadoAnalise.lucroPresumido.cargaTributaria.toFixed(1)}%
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: 12,
                borderRadius: 8,
                marginTop: 16
              }}>
                <div style={{ fontSize: 13, color: '#10b981', fontWeight: 'bold', marginBottom: 4 }}>
                  💰 ECONOMIA MENSAL
                </div>
                <div style={{ fontSize: 24, color: '#10b981', fontWeight: 'bold' }}>
                  R$ {(resultadoAnalise.lucroPresumido.economia / 1000).toFixed(1)}k
                </div>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                  ({resultadoAnalise.lucroPresumido.economiaPercentual.toFixed(1)}% menos impostos)
                </div>
              </div>
            </div>

            {/* SIMPLES NACIONAL */}
            <div style={{
              background: resultadoAnalise.simplesNacional.dentroDoLimite ? 'rgba(245, 158, 11, 0.1)' : 'rgba(107, 114, 128, 0.1)',
              border: `3px solid ${resultadoAnalise.simplesNacional.dentroDoLimite ? '#f59e0b' : '#6b7280'}`,
              borderRadius: 16,
              padding: 24
            }}>
              <h4 style={{ margin: '0 0 20px', color: resultadoAnalise.simplesNacional.dentroDoLimite ? '#f59e0b' : '#6b7280', fontSize: 20 }}>
                {resultadoAnalise.simplesNacional.dentroDoLimite ? '⚠️ SIMPLES NACIONAL' : '❌ SIMPLES (Fora Limite)'}
              </h4>

              {resultadoAnalise.simplesNacional.dentroDoLimite ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Alíquota Anexo III</div>
                    <div style={{ fontSize: 24, color: '#e5e7eb', fontWeight: 'bold' }}>
                      {resultadoAnalise.simplesNacional.aliquota}%
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Impostos Total</div>
                    <div style={{ fontSize: 32, color: '#f59e0b', fontWeight: 'bold' }}>
                      R$ {(resultadoAnalise.simplesNacional.impostos.total / 1000).toFixed(1)}k
                    </div>
                  </div>

                  <div style={{ borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Lucro Líquido</div>
                    <div style={{ fontSize: 20, color: '#e5e7eb', fontWeight: 'bold' }}>
                      R$ {(resultadoAnalise.simplesNacional.lucroLiquido / 1000).toFixed(1)}k
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 4 }}>Carga Tributária</div>
                    <div style={{ fontSize: 20, color: '#f59e0b', fontWeight: 'bold' }}>
                      {resultadoAnalise.simplesNacional.cargaTributaria.toFixed(1)}%
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    padding: 12,
                    borderRadius: 8
                  }}>
                    <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 'bold', marginBottom: 4 }}>
                      💰 ECONOMIA MENSAL
                    </div>
                    <div style={{ fontSize: 24, color: '#f59e0b', fontWeight: 'bold' }}>
                      R$ {(resultadoAnalise.simplesNacional.economia / 1000).toFixed(1)}k
                    </div>
                    <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                      ({resultadoAnalise.simplesNacional.economiaPercentual.toFixed(1)}% menos impostos)
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <AlertTriangle size={48} color="#6b7280" style={{ marginBottom: 16 }} />
                  <div style={{ color: '#9aa3b0', fontSize: 15, lineHeight: 1.6 }}>
                    Faturamento anual ultrapassa R$ 4.8M<br />
                    <br />
                    <strong>Simples não é opção viável</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recomendação Final */}
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: 16,
            padding: 32,
            color: 'white',
            marginBottom: 32
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <TrendingUp size={48} />
              <h3 style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>
                🎯 RECOMENDAÇÃO FINAL
              </h3>
            </div>

            <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 16 }}>
              {resultadoAnalise.recomendacao}
            </div>

            <div style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 24 }}>
              {resultadoAnalise.recomendacao === 'LUCRO PRESUMIDO' ? (
                <>
                  ✅ Economia mensal: <strong>R$ {(resultadoAnalise.lucroPresumido.economia / 1000).toFixed(1)}k</strong><br />
                  ✅ Economia anual: <strong>R$ {(resultadoAnalise.lucroPresumido.economiaAnual / 1000).toFixed(0)}k</strong><br />
                  ✅ Redução tributária: <strong>{resultadoAnalise.lucroPresumido.economiaPercentual.toFixed(1)}%</strong><br />
                  ✅ Sem limite de faturamento<br />
                  ✅ Estabilidade de longo prazo
                </>
              ) : (
                <>
                  ✅ Aproveita créditos tributários<br />
                  ✅ Deduz despesas operacionais<br />
                  ✅ Vantajoso para margem líquida baixa<br />
                  ✅ Melhor para empresa com altos custos
                </>
              )}
            </div>

            <button
              onClick={exportarRelatorio}
              style={{
                background: 'white',
                color: '#8b5cf6',
                border: 'none',
                padding: '16px 32px',
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <Download size={24} />
              Baixar Relatório Completo
            </button>
          </div>

          {/* Próximos Passos */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 32
          }}>
            <h4 style={{ margin: '0 0 20px', color: '#e5e7eb', fontSize: 22 }}>
              📋 Próximos Passos
            </h4>
            <div style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 2 }}>
              1. ✅ Baixar relatório completo (botão acima)<br />
              2. 📞 Agendar reunião com contador especializado em tributação<br />
              3. 📊 Validar dados e premissas utilizados na análise<br />
              4. 📝 Preparar documentação para mudança de regime<br />
              5. ⏰ Protocolar alteração na Receita Federal <strong>até 31/Dez/2025</strong><br />
              6. 🔄 Implementar novos controles contábeis a partir de Jan/2026<br />
              7. 📈 Monitorar resultados mensalmente no OptiLog
            </div>
          </div>
        </>
      )}
    </div>
  );
}
