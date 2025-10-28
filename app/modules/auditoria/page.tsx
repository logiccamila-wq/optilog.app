'use client';
import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, FileText, Calendar, TrendingUp } from 'lucide-react';

interface ItemChecklist {
  id: string;
  requisito: string;
  descricao: string;
  evidencias: string[];
  status: 'conforme' | 'nao-conforme' | 'nao-aplicavel' | 'pendente';
  observacoes?: string;
  responsavel?: string;
  prazo?: string;
}

interface Secao {
  titulo: string;
  descricao: string;
  itens: ItemChecklist[];
}

export default function AuditoriaSASMMAQPage() {
  const [abaSelecionada, setAbaSelecionada] = useState<'sassmaq' | 'iso'>('sassmaq');
  const [secaoAberta, setSecaoAberta] = useState<number>(0);

  const checklistSASMMAQ: Secao[] = [
    {
      titulo: '1. Política de Segurança',
      descricao: 'Política documentada e comunicada a todos os colaboradores',
      itens: [
        {
          id: 'POL-001',
          requisito: 'Política de SSMA documentada',
          descricao: 'Existência de política formal de Saúde, Segurança e Meio Ambiente',
          evidencias: ['Manual de Política SSMA v2.1', 'Ata de aprovação diretoria'],
          status: 'conforme'
        },
        {
          id: 'POL-002',
          requisito: 'Comunicação da política',
          descricao: 'Política comunicada e acessível a todos os colaboradores',
          evidencias: ['Treinamento realizado em Jan/2025', 'Lista de presença assinada'],
          status: 'conforme'
        },
        {
          id: 'POL-003',
          requisito: 'Revisão periódica',
          descricao: 'Política revisada anualmente ou quando necessário',
          evidencias: [],
          status: 'pendente',
          observacoes: 'Revisão prevista para Março/2025',
          responsavel: 'Coordenador QSMS',
          prazo: '31/03/2025'
        }
      ]
    },
    {
      titulo: '2. Gestão de Riscos',
      descricao: 'Identificação, avaliação e controle de riscos operacionais',
      itens: [
        {
          id: 'RIS-001',
          requisito: 'Matriz de riscos atualizada',
          descricao: 'Identificação e avaliação de todos os riscos da operação',
          evidencias: ['Matriz de Riscos 2025', 'APR - Análise Preliminar de Riscos'],
          status: 'conforme'
        },
        {
          id: 'RIS-002',
          requisito: 'Plano de ação para riscos críticos',
          descricao: 'Ações de mitigação implementadas para riscos altos',
          evidencias: ['Plano de Ação QSMS', '3 ações em andamento'],
          status: 'alerta',
          observacoes: '2 ações concluídas, 3 em andamento (prazo: Fev/2025)'
        },
        {
          id: 'RIS-003',
          requisito: 'Inspeções de segurança',
          descricao: 'Inspeções periódicas em veículos e instalações',
          evidencias: [],
          status: 'nao-conforme',
          observacoes: 'CRÍTICO: 2 veículos sem inspeção há mais de 30 dias',
          responsavel: 'Supervisor de Manutenção',
          prazo: 'IMEDIATO'
        }
      ]
    },
    {
      titulo: '3. Treinamento e Capacitação',
      descricao: 'Programas de treinamento para motoristas e colaboradores',
      itens: [
        {
          id: 'TRE-001',
          requisito: 'Treinamento inicial obrigatório',
          descricao: 'Todos os motoristas recebem treinamento de integração',
          evidencias: ['100% motoristas treinados', 'Certificados arquivados'],
          status: 'conforme'
        },
        {
          id: 'TRE-002',
          requisito: 'Reciclagem anual',
          descricao: 'Treinamentos de reciclagem realizados anualmente',
          evidencias: [],
          status: 'pendente',
          observacoes: 'Planejado para Abril/2025',
          responsavel: 'RH',
          prazo: '30/04/2025'
        },
        {
          id: 'TRE-003',
          requisito: 'Curso MOPP válido',
          descricao: 'Motoristas com certificado MOPP dentro da validade',
          evidencias: ['8 de 11 motoristas com MOPP válido'],
          status: 'alerta',
          observacoes: '3 motoristas com vencimento próximo (60 dias)'
        }
      ]
    },
    {
      titulo: '4. Gestão de Emergências',
      descricao: 'Planos de emergência e resposta a incidentes',
      itens: [
        {
          id: 'EME-001',
          requisito: 'Plano de atendimento a emergências',
          descricao: 'PAE documentado e testado periodicamente',
          evidencias: ['PAE v1.3 aprovado', 'Simulado realizado Out/2024'],
          status: 'conforme'
        },
        {
          id: 'EME-002',
          requisito: 'Kit de emergência nos veículos',
          descricao: 'Todos os veículos com kit de emergência completo',
          evidencias: [],
          status: 'nao-conforme',
          observacoes: '1 veículo sem kit (placa XYZ-9876)',
          responsavel: 'Almoxarifado',
          prazo: '28/01/2025'
        }
      ]
    },
    {
      titulo: '5. Documentação de Transporte',
      descricao: 'Controle de documentos obrigatórios',
      itens: [
        {
          id: 'DOC-001',
          requisito: 'Ficha de emergência atualizada',
          descricao: 'Fichas de emergência conforme produtos transportados',
          evidencias: ['100% fichas atualizadas (Rev. Jan/2025)'],
          status: 'conforme'
        },
        {
          id: 'DOC-002',
          requisito: 'Envelope de emergência',
          descricao: 'Envelope presente em todos os veículos transportando PP',
          evidencias: ['Verificação semanal implementada'],
          status: 'conforme'
        }
      ]
    }
  ];

  const checklistISO: Secao[] = [
    {
      titulo: 'ISO 9001 - Gestão da Qualidade',
      descricao: 'Requisitos do sistema de gestão da qualidade',
      itens: [
        {
          id: 'ISO9-001',
          requisito: '4.1 Contexto da organização',
          descricao: 'Identificação de fatores internos e externos relevantes',
          evidencias: ['Análise SWOT 2025', 'Matriz de partes interessadas'],
          status: 'conforme'
        },
        {
          id: 'ISO9-002',
          requisito: '5.2 Política da qualidade',
          descricao: 'Política da qualidade estabelecida e comunicada',
          evidencias: ['Política da Qualidade v3.0'],
          status: 'conforme'
        },
        {
          id: 'ISO9-003',
          requisito: '8.2.1 Comunicação com cliente',
          descricao: 'Canais de comunicação estabelecidos com clientes',
          evidencias: [],
          status: 'pendente',
          observacoes: 'Implementar portal do cliente (Q2/2025)'
        }
      ]
    },
    {
      titulo: 'ISO 14001 - Gestão Ambiental',
      descricao: 'Requisitos do sistema de gestão ambiental',
      itens: [
        {
          id: 'ISO14-001',
          requisito: '6.1.2 Aspectos ambientais',
          descricao: 'Identificação de aspectos e impactos ambientais',
          evidencias: ['Levantamento de aspectos ambientais 2025'],
          status: 'conforme'
        },
        {
          id: 'ISO14-002',
          requisito: '8.1 Controle operacional',
          descricao: 'Controles operacionais para aspectos significativos',
          evidencias: [],
          status: 'alerta',
          observacoes: 'Controle de emissões atmosféricas em revisão'
        }
      ]
    },
    {
      titulo: 'ISO 45001 - Saúde e Segurança',
      descricao: 'Requisitos do sistema de gestão de SSO',
      itens: [
        {
          id: 'ISO45-001',
          requisito: '6.1.2 Identificação de perigos',
          descricao: 'Processo sistemático de identificação de perigos',
          evidencias: ['APR - Análise Preliminar de Riscos', 'Inspeções de segurança'],
          status: 'conforme'
        },
        {
          id: 'ISO45-002',
          requisito: '7.4 Comunicação',
          descricao: 'Comunicação interna e externa sobre SSO',
          evidencias: [],
          status: 'pendente',
          observacoes: 'Canal de denúncias em implementação'
        }
      ]
    }
  ];

  const checklist = abaSelecionada === 'sassmaq' ? checklistSASMMAQ : checklistISO;

  const calcularConformidade = () => {
    const todosItens = checklist.flatMap(s => s.itens);
    const conforme = todosItens.filter(i => i.status === 'conforme').length;
    return Math.round((conforme / todosItens.length) * 100);
  };

  const contarPorStatus = (status: string) => {
    return checklist.flatMap(s => s.itens).filter(i => i.status === status).length;
  };

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Shield size={56} color="#8b5cf6" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            ✅ Auditoria Virtual SASSMAQ & ISO
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Sistema inteligente de gestão de conformidade e auditorias
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => setAbaSelecionada('sassmaq')}
          style={{
            padding: '16px 32px',
            background: abaSelecionada === 'sassmaq' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'rgba(255,255,255,0.05)',
            border: abaSelecionada === 'sassmaq' ? 'none' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🚛 SASSMAQ (Transporte Rodoviário)
        </button>
        <button
          onClick={() => setAbaSelecionada('iso')}
          style={{
            padding: '16px 32px',
            background: abaSelecionada === 'iso' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255,255,255,0.05)',
            border: abaSelecionada === 'iso' ? 'none' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🏆 ISO 9001 / 14001 / 45001
        </button>
      </div>

      {/* Dashboard de Conformidade */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <TrendingUp size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{calcularConformidade()}%</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Conformidade Geral</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <CheckCircle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{contarPorStatus('conforme')}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Requisitos Conformes</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <AlertTriangle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{contarPorStatus('pendente') + contarPorStatus('alerta')}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Pendentes / Atenção</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <XCircle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{contarPorStatus('nao-conforme')}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Não Conformidades</div>
        </div>
      </div>

      {/* Checklist por Seção */}
      <div style={{ display: 'grid', gap: 24 }}>
        {checklist.map((secao, idxSecao) => {
          const conformeSecao = secao.itens.filter(i => i.status === 'conforme').length;
          const totalSecao = secao.itens.length;
          const percentualSecao = Math.round((conformeSecao / totalSecao) * 100);
          const isAberta = secaoAberta === idxSecao;

          return (
            <div
              key={idxSecao}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                overflow: 'hidden'
              }}
            >
              {/* Header da Seção */}
              <div
                onClick={() => setSecaoAberta(isAberta ? -1 : idxSecao)}
                style={{
                  padding: 24,
                  background: 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
                    {secao.titulo}
                  </h3>
                  <p style={{ margin: 0, color: '#9aa3b0', fontSize: 14 }}>{secao.descricao}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 'bold', color: percentualSecao >= 80 ? '#10b981' : percentualSecao >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {percentualSecao}%
                    </div>
                    <div style={{ fontSize: 12, color: '#9aa3b0' }}>
                      {conformeSecao}/{totalSecao} itens
                    </div>
                  </div>
                  <FileText size={24} color="#9aa3b0" />
                </div>
              </div>

              {/* Itens da Seção */}
              {isAberta && (
                <div style={{ padding: 24, display: 'grid', gap: 16 }}>
                  {secao.itens.map((item) => {
                    const cores = {
                      conforme: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', icon: CheckCircle },
                      'nao-conforme': { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', icon: XCircle },
                      alerta: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', icon: AlertTriangle },
                      pendente: { bg: 'rgba(99, 102, 241, 0.1)', border: '#6366f1', icon: Calendar },
                      'nao-aplicavel': { bg: 'rgba(107, 114, 128, 0.1)', border: '#6b7280', icon: FileText }
                    };
                    const estilo = cores[item.status];
                    const IconeStatus = estilo.icon;

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: estilo.bg,
                          border: `2px solid ${estilo.border}`,
                          borderRadius: 12,
                          padding: 20
                        }}
                      >
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            background: estilo.border,
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <IconeStatus size={24} color="white" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ color: '#9aa3b0', fontSize: 12, fontWeight: 'bold' }}>{item.id}</span>
                              <h4 style={{ margin: 0, color: '#e5e7eb', fontSize: 16, fontWeight: 'bold' }}>
                                {item.requisito}
                              </h4>
                            </div>
                            <p style={{ margin: '4px 0 12px', color: '#cbd5e1', fontSize: 14 }}>
                              {item.descricao}
                            </p>

                            {item.evidencias.length > 0 && (
                              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                                <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 6, fontWeight: 'bold' }}>
                                  📎 Evidências:
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 13 }}>
                                  {item.evidencias.map((ev, idx) => (
                                    <li key={idx}>{ev}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {item.observacoes && (
                              <div style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: 12,
                                borderRadius: 8,
                                borderLeft: `4px solid ${estilo.border}`,
                                marginBottom: 12
                              }}>
                                <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>💬 Observações:</div>
                                <div style={{ color: '#e5e7eb', fontSize: 13 }}>{item.observacoes}</div>
                              </div>
                            )}

                            {(item.responsavel || item.prazo) && (
                              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                                {item.responsavel && (
                                  <div>
                                    <span style={{ color: '#9aa3b0' }}>Responsável: </span>
                                    <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>{item.responsavel}</span>
                                  </div>
                                )}
                                {item.prazo && (
                                  <div>
                                    <span style={{ color: '#9aa3b0' }}>Prazo: </span>
                                    <span style={{
                                      color: item.prazo === 'IMEDIATO' ? '#ef4444' : '#f59e0b',
                                      fontWeight: 'bold'
                                    }}>
                                      {item.prazo}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
