'use client';

import { useState, useMemo } from 'react';
import { DollarSign, AlertTriangle, Download } from 'lucide-react';

interface Imposto {
  nome: string;
  periodo: string;
  baseCalculo: number;
  aliquota: number;
  valor: number;
  vencimento: string;
  status: 'calculado' | 'pago' | 'pendente' | 'vencido';
  competencia: string;
}

export default function ImpostosPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroMes, setFiltroMes] = useState<string>('out/2025');

  const impostos: Imposto[] = [
    {
      nome: 'ICMS',
      periodo: 'Out/2025',
      baseCalculo: 250000,
      aliquota: 12,
      valor: 30000,
      vencimento: '14/11/2025',
      status: 'calculado',
      competencia: '2025-10'
    },
    {
      nome: 'ISS',
      periodo: 'Out/2025',
      baseCalculo: 180000,
      aliquota: 5,
      valor: 9000,
      vencimento: '09/11/2025',
      status: 'pago',
      competencia: '2025-10'
    },
    {
      nome: 'PIS',
      periodo: 'Out/2025',
      baseCalculo: 500000,
      aliquota: 1.65,
      valor: 8250,
      vencimento: '19/11/2025',
      status: 'pendente',
      competencia: '2025-10'
    },
    {
      nome: 'COFINS',
      periodo: 'Out/2025',
      baseCalculo: 500000,
      aliquota: 7.6,
      valor: 38000,
      vencimento: '19/11/2025',
      status: 'pendente',
      competencia: '2025-10'
    },
    {
      nome: 'IRPJ',
      periodo: 'Set/2025',
      baseCalculo: 480000,
      aliquota: 15,
      valor: 7200,
      vencimento: '31/10/2025',
      status: 'vencido',
      competencia: '2025-09'
    },
    {
      nome: 'CSLL',
      periodo: 'Set/2025',
      baseCalculo: 480000,
      aliquota: 9,
      valor: 4320,
      vencimento: '31/10/2025',
      status: 'vencido',
      competencia: '2025-09'
    },
    {
      nome: 'INSS Patronal',
      periodo: 'Out/2025',
      baseCalculo: 85000,
      aliquota: 20,
      valor: 17000,
      vencimento: '20/11/2025',
      status: 'pendente',
      competencia: '2025-10'
    },
    {
      nome: 'FGTS',
      periodo: 'Out/2025',
      baseCalculo: 85000,
      aliquota: 8,
      valor: 6800,
      vencimento: '07/11/2025',
      status: 'calculado',
      competencia: '2025-10'
    }
  ];

  // Optimized: Use useMemo to cache filtered results
  const filtrados = useMemo(() => {
    return impostos.filter(imp => {
      if (filtroStatus !== 'todos' && imp.status !== filtroStatus) return false;
      if (filtroMes !== 'todos' && imp.periodo !== filtroMes) return false;
      return true;
    });
  }, [impostos, filtroStatus, filtroMes]);

  // Optimized: Calculate totals in a single pass instead of 4 separate filter+reduce operations
  const totais = useMemo(() => {
    return impostos.reduce((acc, imposto) => {
      acc[imposto.status] = (acc[imposto.status] || 0) + imposto.valor;
      return acc;
    }, {
      calculado: 0,
      pago: 0,
      pendente: 0,
      vencido: 0
    } as Record<string, number>);
  }, [impostos]);

  const totalGeral = useMemo(() => {
    return totais.calculado + totais.pago + totais.pendente + totais.vencido;
  }, [totais]);

  const hoje = useMemo(() => new Date('2025-10-28'), []);
  
  // Optimized: Use useMemo to cache critical tax calculations
  const impostosCriticos = useMemo(() => {
    return impostos.filter(imp => {
      const venc = new Date(imp.vencimento.split('/').reverse().join('-'));
      const diasRestantes = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diasRestantes <= 7 && imp.status !== 'pago';
    });
  }, [impostos, hoje]);

  const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    calculado: { label: 'Calculado', bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' },
    pago: { label: 'Pago', bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' },
    pendente: { label: 'Pendente', bg: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' },
    vencido: { label: 'Vencido', bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24, background: '#0f1419', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <DollarSign size={56} color="#ef4444" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>💸 Gestão de Impostos</h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Controle total de tributos federais, estaduais e municipais
          </p>
        </div>
      </div>

      {impostosCriticos.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <AlertTriangle size={32} />
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 'bold' }}>
              🚨 ATENÇÃO: {impostosCriticos.length} imposto(s) vencendo em até 7 dias!
            </h3>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {impostosCriticos.map((imp, idx) => {
              const venc = new Date(imp.vencimento.split('/').reverse().join('-'));
              const diasRestantes = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, fontSize: 14 }}>
                  <strong>{imp.nome}</strong> - R$ {imp.valor.toLocaleString('pt-BR')} - 
                  Vence em <strong>{diasRestantes} dia(s)</strong> ({imp.vencimento})
                  {imp.status === 'vencido' && <span style={{ marginLeft: 8, color: '#fef3c7', fontWeight: 'bold' }}>⚠️ VENCIDO</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {Object.entries(totais).map(([key, valor]) => (
          <div key={key} style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: 24,
            borderRadius: 12,
            border: '1px solid rgba(100, 116, 139, 0.2)'
          }}>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, textTransform: 'capitalize' }}>{key}</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#e5e7eb' }}>
              R$ {valor.toLocaleString('pt-BR')}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.3)',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(100, 116, 139, 0.2)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(30, 41, 59, 0.5)', borderBottom: '1px solid rgba(100, 116, 139, 0.2)' }}>
              <th style={{ padding: 16, textAlign: 'left', color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>Imposto</th>
              <th style={{ padding: 16, textAlign: 'left', color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>Período</th>
              <th style={{ padding: 16, textAlign: 'right', color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>Base Cálculo</th>
              <th style={{ padding: 16, textAlign: 'center', color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>Alíquota</th>
              <th style={{ padding: 16, textAlign: 'right', color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>Valor</th>
              <th style={{ padding: 16, textAlign: 'center', color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>Vencimento</th>
              <th style={{ padding: 16, textAlign: 'center', color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>Status</th>
              <th style={{ padding: 16, textAlign: 'center', color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((imposto, idx) => {
              const config = statusConfig[imposto.status] || statusConfig.pendente;
              return (
                <tr
                  key={idx}
                  style={{ borderBottom: '1px solid rgba(100, 116, 139, 0.1)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: 16, color: '#e5e7eb', fontSize: 15, fontWeight: 'bold' }}>{imposto.nome}</td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14 }}>{imposto.periodo}</td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14, textAlign: 'right' }}>
                    R$ {imposto.baseCalculo.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14, textAlign: 'center' }}>{imposto.aliquota}%</td>
                  <td style={{ padding: 16, color: '#e5e7eb', fontSize: 16, fontWeight: 'bold', textAlign: 'right' }}>
                    R$ {imposto.valor.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: 16, color: '#cbd5e1', fontSize: 14, textAlign: 'center' }}>{imposto.vencimento}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <span style={{
                      background: config.bg,
                      color: config.color,
                      padding: '6px 16px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}>
                      {config.label}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <button
                      style={{
                        background: '#3b82f6',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Download size={16} />
                      DARF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 12,
          padding: 24
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#ef4444', fontSize: 18, fontWeight: 'bold' }}>
            ⚠️ Ação Necessária
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 14, lineHeight: 2 }}>
            <li><strong>URGENTE:</strong> R$ {totais.vencido.toLocaleString('pt-BR')} em impostos vencidos</li>
            <li><strong>Próximos 7 dias:</strong> R$ {totais.pendente.toLocaleString('pt-BR')} a pagar</li>
            <li><strong>Multas:</strong> Regularize para evitar juros Selic + 0.33%/dia</li>
          </ul>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 12,
          padding: 24
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#10b981', fontSize: 18, fontWeight: 'bold' }}>
            💡 Dicas
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 14, lineHeight: 2 }}>
            <li>Analise mudança de regime tributário</li>
            <li>Configure débito automático</li>
            <li>Revise créditos de PIS/COFINS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
