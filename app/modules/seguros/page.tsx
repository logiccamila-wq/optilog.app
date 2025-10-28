'use client';
import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Calendar, FileText, DollarSign } from 'lucide-react';

interface Clausula {
  titulo: string;
  descricao: string;
  limite: string;
  status: 'conforme' | 'alerta' | 'risco';
  observacoes?: string;
}

interface Apolice {
  id: number;
  seguradora: string;
  tipo: string;
  numeroApolice: string;
  vigencia: { inicio: string; fim: string };
  valorPremio: number;
  valorCobertura: number;
  statusGeral: 'ativa' | 'vencimento-proximo' | 'vencida';
  clausulas: Clausula[];
}

export default function SegurosPage() {
  const [apoliceAtiva, setApoliceAtiva] = useState(1);

  const apolices: Apolice[] = [
    {
      id: 1,
      seguradora: 'HDI Seguros',
      tipo: 'RCF-DC (Responsabilidade Civil)',
      numeroApolice: '001234567890',
      vigencia: { inicio: '01/01/2025', fim: '31/12/2025' },
      valorPremio: 45000,
      valorCobertura: 500000,
      statusGeral: 'ativa',
      clausulas: [
        {
          titulo: 'Cobertura de Carga',
          descricao: 'Cobertura para danos ou perda de mercadorias transportadas',
          limite: 'R$ 500.000 por viagem',
          status: 'conforme',
          observacoes: 'Limite adequado para operações atuais'
        },
        {
          titulo: 'Franquia por Sinistro',
          descricao: 'Valor mínimo de franquia em caso de sinistro',
          limite: 'R$ 5.000 (10% do valor da carga, mínimo)',
          status: 'alerta',
          observacoes: 'Franquia alta para cargas de menor valor. Revisar contrato.'
        },
        {
          titulo: 'Exclusões - Roubo de Carga',
          descricao: 'Cobertura de roubo de carga em vias públicas',
          limite: 'Coberto apenas com rastreador homologado',
          status: 'conforme',
          observacoes: 'Todos os veículos com rastreador ativo'
        },
        {
          titulo: 'Prazo para Aviso de Sinistro',
          descricao: 'Prazo máximo para comunicar sinistro à seguradora',
          limite: '24 horas após ocorrência',
          status: 'risco',
          observacoes: 'URGENTE: 3 sinistros comunicados fora do prazo nos últimos 6 meses'
        },
        {
          titulo: 'Motoristas Habilitados',
          descricao: 'Requisitos para motoristas cobertos pela apólice',
          limite: 'CNH categoria E, sem pontuação suspensiva',
          status: 'alerta',
          observacoes: '2 motoristas com pontuação acima de 20 pontos'
        },
        {
          titulo: 'Limite de Indenização Anual',
          descricao: 'Limite total de indenizações no período de 12 meses',
          limite: 'R$ 2.000.000 por ano',
          status: 'conforme',
          observacoes: 'Utilizado 12% do limite anual (R$ 240.000)'
        }
      ]
    },
    {
      id: 2,
      seguradora: 'Porto Seguro',
      tipo: 'Frota de Veículos',
      numeroApolice: '987654321000',
      vigencia: { inicio: '15/02/2025', fim: '14/02/2026' },
      valorPremio: 32000,
      valorCobertura: 1200000,
      statusGeral: 'ativa',
      clausulas: [
        {
          titulo: 'Cobertura Compreensiva',
          descricao: 'Colisão, incêndio, roubo/furto de veículos',
          limite: 'Valor de mercado Fipe por veículo',
          status: 'conforme'
        },
        {
          titulo: 'Manutenção Preventiva',
          descricao: 'Obrigatoriedade de revisões periódicas',
          limite: 'A cada 10.000km ou 6 meses',
          status: 'alerta',
          observacoes: '1 veículo com revisão atrasada (placa ABC-1234)'
        }
      ]
    }
  ];

  const apolice = apolices.find(a => a.id === apoliceAtiva) || apolices[0];

  const contarStatus = (status: string) => {
    return apolice.clausulas.filter(c => c.status === status).length;
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Shield size={56} color="#3b82f6" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            🛡️ Monitoramento de Apólices de Seguro
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Análise de cláusulas e conformidade em tempo real
          </p>
        </div>
      </div>

      {/* Seletor de Apólice */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
        {apolices.map(a => (
          <button
            key={a.id}
            onClick={() => setApoliceAtiva(a.id)}
            style={{
              padding: 16,
              background: apoliceAtiva === a.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
              border: apoliceAtiva === a.id ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              minWidth: 250,
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ color: '#e5e7eb', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
              {a.tipo}
            </div>
            <div style={{ color: '#9aa3b0', fontSize: 13 }}>{a.seguradora}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: a.statusGeral === 'ativa' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
              {a.statusGeral === 'ativa' ? '✓ ATIVA' : '⚠ VENCIMENTO PRÓXIMO'}
            </div>
          </button>
        ))}
      </div>

      {/* Resumo da Apólice */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: 20, borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <FileText size={24} color="#3b82f6" style={{ marginBottom: 8 }} />
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Apólice</div>
          <div style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 'bold' }}>{apolice.numeroApolice}</div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 20, borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <DollarSign size={24} color="#10b981" style={{ marginBottom: 8 }} />
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Cobertura</div>
          <div style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 'bold' }}>
            R$ {(apolice.valorCobertura / 1000).toFixed(0)}k
          </div>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 20, borderRadius: 12, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <Calendar size={24} color="#f59e0b" style={{ marginBottom: 8 }} />
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Vigência</div>
          <div style={{ color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>
            {apolice.vigencia.inicio} a {apolice.vigencia.fim}
          </div>
        </div>

        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: 20, borderRadius: 12, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <Shield size={24} color="#8b5cf6" style={{ marginBottom: 8 }} />
          <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 4 }}>Prêmio Anual</div>
          <div style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 'bold' }}>
            R$ {(apolice.valorPremio / 1000).toFixed(0)}k
          </div>
        </div>
      </div>

      {/* Status das Cláusulas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <CheckCircle size={28} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{contarStatus('conforme')}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Cláusulas em Conformidade</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <AlertTriangle size={28} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{contarStatus('alerta')}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Cláusulas em Alerta</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <AlertTriangle size={28} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>{contarStatus('risco')}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Cláusulas em Risco</div>
        </div>
      </div>

      {/* Lista de Cláusulas */}
      <div style={{ display: 'grid', gap: 16 }}>
        {apolice.clausulas.map((clausula, idx) => {
          const cores = {
            conforme: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', icon: '#10b981', label: 'CONFORME' },
            alerta: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', icon: '#f59e0b', label: 'ATENÇÃO' },
            risco: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', icon: '#ef4444', label: 'RISCO ALTO' }
          };
          const estilo = cores[clausula.status];

          return (
            <div
              key={idx}
              style={{
                background: estilo.bg,
                border: `2px solid ${estilo.border}`,
                borderRadius: 12,
                padding: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: estilo.border,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {clausula.status === 'conforme' ? (
                    <CheckCircle size={28} color="white" />
                  ) : (
                    <AlertTriangle size={28} color="white" />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: 18, fontWeight: 'bold' }}>
                      {clausula.titulo}
                    </h3>
                    <span style={{
                      background: estilo.border,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 'bold'
                    }}>
                      {estilo.label}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 12px', color: '#cbd5e1', fontSize: 14 }}>
                    {clausula.descricao}
                  </p>

                  <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: clausula.observacoes ? 12 : 0
                  }}>
                    <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>Limite / Condição:</div>
                    <div style={{ color: '#e5e7eb', fontSize: 15, fontWeight: '500' }}>{clausula.limite}</div>
                  </div>

                  {clausula.observacoes && (
                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: 12,
                      borderRadius: 8,
                      borderLeft: `4px solid ${estilo.border}`
                    }}>
                      <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>⚠️ Observações:</div>
                      <div style={{ color: '#e5e7eb', fontSize: 14 }}>{clausula.observacoes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
