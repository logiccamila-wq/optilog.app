'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, Clock, AlertTriangle, CheckCircle, Package, Fuel, TrendingUp, FileText, LogOut } from 'lucide-react';

export default function MotoristaDashboardPage() {
  const router = useRouter();
  const [motorista, setMotorista] = useState<any>(null);
  const [veiculo, setVeiculo] = useState<any>(null);
  const [cte, setCte] = useState('');
  const [viagemAtiva, setViagemAtiva] = useState(true);

  useEffect(() => {
    // Carregar dados do localStorage
    const motoristaData = localStorage.getItem('motorista');
    const veiculoData = localStorage.getItem('veiculo');
    const cteData = localStorage.getItem('cte');

    if (!motoristaData) {
      router.push('/motorista/login');
      return;
    }

    setMotorista(JSON.parse(motoristaData));
    setVeiculo(veiculoData ? JSON.parse(veiculoData) : null);
    setCte(cteData || '');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('motorista');
    localStorage.removeItem('veiculo');
    localStorage.removeItem('cte');
    router.push('/motorista/login');
  };

  if (!motorista) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: 16 }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
        borderRadius: 16, 
        padding: 20, 
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            width: 60, 
            height: 60, 
            background: 'linear-gradient(135deg, #10b981, #059669)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff'
          }}>
            {motorista.apelido?.charAt(0) || 'M'}
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#e5e7eb', fontSize: 20, fontWeight: 'bold' }}>
              {motorista.apelido || motorista.nome}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#9aa3b0', fontSize: 14 }}>
              🚚 {veiculo?.placaCavalo || 'Veículo'} {veiculo?.placaReboque ? `+ ${veiculo.placaReboque}` : ''}
              <br />
              📦 CT-e: {cte}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            borderRadius: 8,
            color: '#ef4444',
            fontSize: 14,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>

      {/* Viagem Ativa */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 78, 59, 0.3))', 
        border: '2px solid #10b981', 
        borderRadius: 16, 
        padding: 24, 
        marginBottom: 16 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Navigation size={32} color="#10b981" />
          <div>
            <h3 style={{ margin: 0, color: '#10b981', fontSize: 18, fontWeight: 'bold' }}>
              VIAGEM EM ANDAMENTO
            </h3>
            <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: 14 }}>
              São Paulo, SP → Rio de Janeiro, RJ
            </p>
          </div>
        </div>

        {/* Progresso */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#cbd5e1', fontSize: 14 }}>Progresso</span>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: 14 }}>67% concluído</span>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.3)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <div style={{ background: '#10b981', width: '67%', height: '100%', transition: 'width 0.5s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ color: '#9aa3b0', fontSize: 13 }}>287 km percorridos</span>
            <span style={{ color: '#9aa3b0', fontSize: 13 }}>141 km restantes</span>
          </div>
        </div>

        {/* Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <Clock size={24} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
            <div style={{ color: '#3b82f6', fontSize: 20, fontWeight: 'bold' }}>2h 15min</div>
            <div style={{ color: '#9aa3b0', fontSize: 12 }}>ETA Restante</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <TrendingUp size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <div style={{ color: '#10b981', fontSize: 20, fontWeight: 'bold' }}>85 km/h</div>
            <div style={{ color: '#9aa3b0', fontSize: 12 }}>Velocidade Média</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <Fuel size={24} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
            <div style={{ color: '#f59e0b', fontSize: 20, fontWeight: 'bold' }}>3.8 km/L</div>
            <div style={{ color: '#9aa3b0', fontSize: 12 }}>Consumo Atual</div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div style={{ 
        background: 'rgba(245, 158, 11, 0.2)', 
        border: '1px solid #f59e0b', 
        borderRadius: 16, 
        padding: 20, 
        marginBottom: 16 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <AlertTriangle size={24} color="#f59e0b" />
          <h3 style={{ margin: 0, color: '#f59e0b', fontSize: 16, fontWeight: 'bold' }}>
            ALERTAS ATIVOS
          </h3>
        </div>
        <ul style={{ margin: 0, paddingLeft: 24, color: '#fbbf24', fontSize: 14, lineHeight: 1.8 }}>
          <li>Trânsito intenso em 15km - reduzir velocidade</li>
          <li>Posto recomendado no KM 180 (diesel R$ 5,89/L)</li>
          <li>Descanso obrigatório em 1h 30min</li>
        </ul>
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => router.push('/motorista/checkin')}
          style={{
            padding: 20,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: 16,
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8
          }}
        >
          <CheckCircle size={32} />
          Check-in Carga
        </button>

        <button
          onClick={() => router.push('/motorista/nao-conformidade')}
          style={{
            padding: 20,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none',
            borderRadius: 16,
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8
          }}
        >
          <AlertTriangle size={32} />
          Não Conformidade
        </button>
      </div>

      {/* POPs */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: 16, 
        padding: 20,
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <FileText size={24} color="#8b5cf6" />
          <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: 16, fontWeight: 'bold' }}>
            POPs Pendentes
          </h3>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { nome: 'POP-001: Check-list Pré-Viagem', status: 'completo' },
            { nome: 'POP-002: Verificação de Carga', status: 'completo' },
            { nome: 'POP-003: Lacre de Segurança', status: 'pendente' }
          ].map((pop, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: 12,
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 8
            }}>
              <span style={{ color: '#cbd5e1', fontSize: 14 }}>{pop.nome}</span>
              {pop.status === 'completo' ? (
                <span style={{ 
                  padding: '4px 12px', 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  border: '1px solid #10b981',
                  borderRadius: 12, 
                  color: '#10b981', 
                  fontSize: 12, 
                  fontWeight: 'bold' 
                }}>
                  ✓ Completo
                </span>
              ) : (
                <span style={{ 
                  padding: '4px 12px', 
                  background: 'rgba(239, 68, 68, 0.2)', 
                  border: '1px solid #ef4444',
                  borderRadius: 12, 
                  color: '#ef4444', 
                  fontSize: 12, 
                  fontWeight: 'bold' 
                }}>
                  ⚠ Pendente
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: 16, 
        padding: 20 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <TrendingUp size={24} color="#3b82f6" />
          <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: 16, fontWeight: 'bold' }}>
            Seu Desempenho (Mês)
          </h3>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { kpi: 'Entregas no Prazo', meta: 95, realizado: 98, unit: '%' },
            { kpi: 'Consumo Combustível', meta: 4.2, realizado: 3.9, unit: 'km/L' },
            { kpi: 'Índice de Segurança', meta: 90, realizado: 95, unit: '%' }
          ].map((item, idx) => (
            <div key={idx} style={{ 
              padding: 16,
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 12
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#cbd5e1', fontSize: 14 }}>{item.kpi}</span>
                <span style={{ 
                  color: item.realizado >= item.meta ? '#10b981' : '#ef4444', 
                  fontWeight: 'bold', 
                  fontSize: 14 
                }}>
                  {item.realizado}{item.unit} / {item.meta}{item.unit}
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                <div style={{ 
                  background: item.realizado >= item.meta ? '#10b981' : '#ef4444', 
                  width: `${Math.min((item.realizado / item.meta) * 100, 100)}%`, 
                  height: '100%' 
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
