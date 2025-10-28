'use client';
import { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Clock, User, Bell } from 'lucide-react';

interface Passo {
  numero: number;
  descricao: string;
  responsavel: string;
  tempoEstimado: string;
  verificacao: string;
}

interface POP {
  id: string;
  titulo: string;
  codigo: string;
  categoria: string;
  descricao: string;
  objetivo: string;
  passos: Passo[];
  execucoes: {
    motorista: string;
    data: string;
    hora: string;
    status: 'completo' | 'incompleto' | 'atrasado';
    tempoReal: string;
    observacoes?: string;
  }[];
  alertas: {
    tipo: 'atraso' | 'nao-executado' | 'falha-verificacao' | 'desvio-tempo';
    mensagem: string;
    severidade: 'baixa' | 'media' | 'alta';
    data: string;
  }[];
}

export default function MonitoramentoPOPPage() {
  const [popSelecionado, setPopSelecionado] = useState<string>('POP-001');
  const [visualizacao, setVisualizacao] = useState<'execucao' | 'alertas'>('execucao');

  const pops: POP[] = [
    {
      id: 'POP-001',
      titulo: 'Check-list Pré-Viagem',
      codigo: 'POP-OPE-001',
      categoria: 'Operacional',
      descricao: 'Procedimento obrigatório antes do início de cada viagem',
      objetivo: 'Garantir condições seguras do veículo e da carga antes da partida',
      passos: [
        {
          numero: 1,
          descricao: 'Verificar nível de óleo do motor',
          responsavel: 'Motorista',
          tempoEstimado: '2 min',
          verificacao: 'Nível entre MIN e MAX na vareta'
        },
        {
          numero: 2,
          descricao: 'Verificar nível e condição dos pneus',
          responsavel: 'Motorista',
          tempoEstimado: '5 min',
          verificacao: 'Pressão conforme especificação, ausência de cortes/desgaste irregular'
        },
        {
          numero: 3,
          descricao: 'Testar freios e luz de freio',
          responsavel: 'Motorista',
          tempoEstimado: '3 min',
          verificacao: 'Freios responsivos, todas as luzes funcionando'
        },
        {
          numero: 4,
          descricao: 'Verificar amarração da carga',
          responsavel: 'Motorista',
          tempoEstimado: '5 min',
          verificacao: 'Cintas tensionadas, carga estável, sem folgas'
        },
        {
          numero: 5,
          descricao: 'Conferir documentação do veículo e carga',
          responsavel: 'Motorista',
          tempoEstimado: '3 min',
          verificacao: 'CRLV, CNH, ANTT, CT-e, NF, Ficha Emergência (se aplicável)'
        }
      ],
      execucoes: [
        {
          motorista: 'João Silva',
          data: '27/01/2025',
          hora: '05:45',
          status: 'completo',
          tempoReal: '18 min',
          observacoes: 'Pneu traseiro esquerdo com pressão 5 PSI abaixo - calibrado'
        },
        {
          motorista: 'Maria Santos',
          data: '27/01/2025',
          hora: '06:20',
          status: 'completo',
          tempoReal: '15 min'
        },
        {
          motorista: 'Carlos Oliveira',
          data: '27/01/2025',
          hora: '07:10',
          status: 'atrasado',
          tempoReal: '32 min',
          observacoes: 'Atraso: problema identificado na amarração da carga - refeita'
        },
        {
          motorista: 'Pedro Costa',
          data: '26/01/2025',
          hora: '14:30',
          status: 'incompleto',
          tempoReal: '8 min',
          observacoes: 'NÃO CONFORME: Passo 4 (amarração) não realizado'
        }
      ],
      alertas: [
        {
          tipo: 'falha-verificacao',
          mensagem: 'Pedro Costa pulou verificação de amarração da carga (Passo 4) - RISCO ALTO',
          severidade: 'alta',
          data: '26/01/2025 14:38'
        },
        {
          tipo: 'desvio-tempo',
          mensagem: 'Carlos Oliveira levou 32 min (tempo esperado: 18 min) - investigar causa',
          severidade: 'media',
          data: '27/01/2025 07:42'
        }
      ]
    },
    {
      id: 'POP-002',
      titulo: 'Abastecimento de Combustível',
      codigo: 'POP-OPE-002',
      categoria: 'Operacional',
      descricao: 'Procedimento para abastecimento seguro e controle de combustível',
      objetivo: 'Garantir abastecimento correto e registro adequado para controle',
      passos: [
        {
          numero: 1,
          descricao: 'Desligar o motor e freio de mão acionado',
          responsavel: 'Motorista',
          tempoEstimado: '1 min',
          verificacao: 'Motor desligado, freio acionado, marcha engatada'
        },
        {
          numero: 2,
          descricao: 'Verificar tipo de combustível correto',
          responsavel: 'Motorista',
          tempoEstimado: '1 min',
          verificacao: 'Diesel S10 para veículos Euro 5/6'
        },
        {
          numero: 3,
          descricao: 'Registrar hodômetro antes do abastecimento',
          responsavel: 'Motorista',
          tempoEstimado: '1 min',
          verificacao: 'Foto do hodômetro tirada no app'
        },
        {
          numero: 4,
          descricao: 'Abastecer e registrar litros/valor',
          responsavel: 'Motorista',
          tempoEstimado: '10 min',
          verificacao: 'Cupom fiscal anexado no app'
        },
        {
          numero: 5,
          descricao: 'Calcular e validar consumo médio',
          responsavel: 'Sistema',
          tempoEstimado: 'automático',
          verificacao: 'Consumo entre 3.5 e 4.5 km/L (alerta se fora da faixa)'
        }
      ],
      execucoes: [
        {
          motorista: 'João Silva',
          data: '27/01/2025',
          hora: '10:30',
          status: 'completo',
          tempoReal: '12 min'
        },
        {
          motorista: 'Maria Santos',
          data: '27/01/2025',
          hora: '11:15',
          status: 'completo',
          tempoReal: '14 min'
        }
      ],
      alertas: [
        {
          tipo: 'desvio-tempo',
          mensagem: 'Consumo de João Silva: 3.1 km/L (abaixo do esperado 3.5-4.5) - verificar veículo',
          severidade: 'media',
          data: '27/01/2025 10:45'
        }
      ]
    },
    {
      id: 'POP-003',
      titulo: 'Procedimento de Emergência - Acidente',
      codigo: 'POP-SEG-001',
      categoria: 'Segurança',
      descricao: 'Ações imediatas em caso de acidente de trânsito',
      objetivo: 'Garantir segurança das pessoas e preservação de evidências',
      passos: [
        {
          numero: 1,
          descricao: 'Sinalizar o local (triângulo a 30m)',
          responsavel: 'Motorista',
          tempoEstimado: '2 min',
          verificacao: 'Triângulo posicionado corretamente'
        },
        {
          numero: 2,
          descricao: 'Verificar vítimas e acionar socorro (192/193)',
          responsavel: 'Motorista',
          tempoEstimado: '3 min',
          verificacao: 'SAMU/Bombeiros acionados se houver vítimas'
        },
        {
          numero: 3,
          descricao: 'Acionar autoridades (PRF 191 ou PM 190)',
          responsavel: 'Motorista',
          tempoEstimado: '5 min',
          verificacao: 'Boletim de Ocorrência iniciado'
        },
        {
          numero: 4,
          descricao: 'Fotografar cena do acidente (múltiplos ângulos)',
          responsavel: 'Motorista',
          tempoEstimado: '5 min',
          verificacao: 'Mínimo 8 fotos: veículos, danos, placas, via, sinalização'
        },
        {
          numero: 5,
          descricao: 'Notificar Central de Operações (IMEDIATO)',
          responsavel: 'Motorista',
          tempoEstimado: '2 min',
          verificacao: 'Ligação registrada no sistema'
        },
        {
          numero: 6,
          descricao: 'Acionar seguradora (dentro de 24h)',
          responsavel: 'Central Operações',
          tempoEstimado: '1 hora',
          verificacao: 'Protocolo de sinistro gerado'
        }
      ],
      execucoes: [],
      alertas: []
    }
  ];

  const pop = pops.find(p => p.id === popSelecionado) || pops[0];

  const calcularTaxaConformidade = () => {
    const execucoes = pops.flatMap(p => p.execucoes);
    const conformes = execucoes.filter(e => e.status === 'completo').length;
    return execucoes.length > 0 ? Math.round((conformes / execucoes.length) * 100) : 0;
  };

  const totalAlertas = pops.reduce((acc, p) => acc + p.alertas.length, 0);
  const alertasAlta = pops.flatMap(p => p.alertas).filter(a => a.severidade === 'alta').length;

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <FileText size={56} color="#10b981" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb' }}>
            📋 Monitoramento Automatizado de POPs
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Sistema inteligente de controle de Procedimentos Operacionais Padrão
          </p>
        </div>
      </div>

      {/* Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <CheckCircle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{calcularTaxaConformidade()}%</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Taxa de Conformidade</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <FileText size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{pops.length}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>POPs Ativos</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <Bell size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{totalAlertas}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Alertas Ativos</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: 24, borderRadius: 12, color: 'white' }}>
          <AlertTriangle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>{alertasAlta}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Alertas Críticos</div>
        </div>
      </div>

      {/* Seletor de POP */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
        {pops.map(p => (
          <button
            key={p.id}
            onClick={() => setPopSelecionado(p.id)}
            style={{
              padding: 16,
              background: popSelecionado === p.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
              border: popSelecionado === p.id ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer',
              minWidth: 200,
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ color: '#9aa3b0', fontSize: 11, marginBottom: 4 }}>{p.codigo}</div>
            <div style={{ color: '#e5e7eb', fontSize: 14, fontWeight: 'bold' }}>{p.titulo}</div>
            {p.alertas.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444', fontSize: 12, fontWeight: 'bold' }}>
                <Bell size={14} />
                {p.alertas.length} alerta{p.alertas.length > 1 ? 's' : ''}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setVisualizacao('execucao')}
          style={{
            padding: '12px 24px',
            background: visualizacao === 'execucao' ? '#10b981' : 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📊 Execuções Recentes
        </button>
        <button
          onClick={() => setVisualizacao('alertas')}
          style={{
            padding: '12px 24px',
            background: visualizacao === 'alertas' ? '#ef4444' : 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          🔔 Alertas {pop.alertas.length > 0 && `(${pop.alertas.length})`}
        </button>
      </div>

      {/* Detalhes do POP */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24
      }}>
        <h2 style={{ margin: 0, color: '#e5e7eb', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          {pop.titulo}
        </h2>
        <div style={{ color: '#9aa3b0', fontSize: 13, marginBottom: 12 }}>
          {pop.codigo} • {pop.categoria}
        </div>
        <p style={{ margin: '0 0 16px', color: '#cbd5e1', fontSize: 15 }}>
          {pop.descricao}
        </p>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 12, borderRadius: 8, borderLeft: '4px solid #10b981' }}>
          <div style={{ color: '#10b981', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>🎯 OBJETIVO:</div>
          <div style={{ color: '#e5e7eb', fontSize: 14 }}>{pop.objetivo}</div>
        </div>
      </div>

      {/* Passos do POP */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: '#e5e7eb', fontSize: 18, marginBottom: 16 }}>📝 Passos do Procedimento</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {pop.passos.map((passo) => (
            <div
              key={passo.numero}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                gap: 16
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                background: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {passo.numero}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 'bold', marginBottom: 8 }}>
                  {passo.descricao}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  <div>
                    <span style={{ color: '#9aa3b0' }}>Responsável: </span>
                    <span style={{ color: '#cbd5e1' }}>{passo.responsavel}</span>
                  </div>
                  <div>
                    <span style={{ color: '#9aa3b0' }}>Tempo: </span>
                    <span style={{ color: '#cbd5e1' }}>{passo.tempoEstimado}</span>
                  </div>
                </div>
                <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, fontSize: 13 }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Verificação: </span>
                  <span style={{ color: '#cbd5e1' }}>{passo.verificacao}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo por Visualização */}
      {visualizacao === 'execucao' ? (
        <div>
          <h3 style={{ color: '#e5e7eb', fontSize: 18, marginBottom: 16 }}>
            📊 Execuções Recentes ({pop.execucoes.length})
          </h3>
          {pop.execucoes.length === 0 ? (
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 12,
              padding: 32,
              textAlign: 'center',
              color: '#9aa3b0'
            }}>
              Nenhuma execução registrada ainda
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {pop.execucoes.map((exec, idx) => {
                const cores = {
                  completo: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', label: 'COMPLETO ✓' },
                  incompleto: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', label: 'INCOMPLETO ✗' },
                  atrasado: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', label: 'ATRASADO ⚠' }
                };
                const estilo = cores[exec.status];

                return (
                  <div
                    key={idx}
                    style={{
                      background: estilo.bg,
                      border: `2px solid ${estilo.border}`,
                      borderRadius: 12,
                      padding: 16
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ color: '#e5e7eb', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                          <User size={16} style={{ display: 'inline', marginRight: 8 }} />
                          {exec.motorista}
                        </div>
                        <div style={{ color: '#9aa3b0', fontSize: 13 }}>
                          <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
                          {exec.data} às {exec.hora} • Tempo: {exec.tempoReal}
                        </div>
                      </div>
                      <div style={{
                        background: estilo.border,
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 'bold',
                        height: 'fit-content'
                      }}>
                        {estilo.label}
                      </div>
                    </div>
                    {exec.observacoes && (
                      <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: 12,
                        borderRadius: 8,
                        borderLeft: `4px solid ${estilo.border}`
                      }}>
                        <div style={{ color: '#9aa3b0', fontSize: 12, marginBottom: 4 }}>💬 Observações:</div>
                        <div style={{ color: '#e5e7eb', fontSize: 13 }}>{exec.observacoes}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 style={{ color: '#e5e7eb', fontSize: 18, marginBottom: 16 }}>
            🔔 Alertas Automatizados ({pop.alertas.length})
          </h3>
          {pop.alertas.length === 0 ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 12,
              padding: 32,
              textAlign: 'center',
              color: '#10b981',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
              ✓ Nenhum alerta ativo. Procedimento em conformidade!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {pop.alertas.map((alerta, idx) => {
                const cores = {
                  alta: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', icon: '🚨' },
                  media: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', icon: '⚠️' },
                  baixa: { bg: 'rgba(99, 102, 241, 0.1)', border: '#6366f1', icon: 'ℹ️' }
                };
                const estilo = cores[alerta.severidade];

                return (
                  <div
                    key={idx}
                    style={{
                      background: estilo.bg,
                      border: `2px solid ${estilo.border}`,
                      borderRadius: 12,
                      padding: 16
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ fontSize: 32 }}>{estilo.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{
                            background: estilo.border,
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 'bold'
                          }}>
                            {alerta.tipo.toUpperCase().replace('-', ' ')}
                          </span>
                          <span style={{
                            background: estilo.border,
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 'bold'
                          }}>
                            SEVERIDADE: {alerta.severidade.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ color: '#e5e7eb', fontSize: 15, marginBottom: 8 }}>
                          {alerta.mensagem}
                        </div>
                        <div style={{ color: '#9aa3b0', fontSize: 12 }}>
                          🕐 {alerta.data}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
