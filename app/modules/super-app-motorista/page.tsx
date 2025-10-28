'use client';
import { useState } from 'react';
import { Smartphone, Navigation, Camera, MessageSquare, DollarSign, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function SuperAppMotoristaPage() {
  const [tab, setTab] = useState('home');

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Smartphone size={56} color="#8b5cf6" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: 12 }}>
            📱 Super App Motorista
            <span style={{ fontSize: 14, background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', padding: '4px 12px', borderRadius: 20, fontWeight: 'normal' }}>
              PRO
            </span>
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Tudo que o motorista precisa em um único aplicativo
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <TrendingUp size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>87%</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Adoção Motoristas</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <CheckCircle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>4.8★</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Avaliação Play Store</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <DollarSign size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>+R$420</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Economia Média/Mês</div>
        </div>
      </div>

      {/* Mockup do App */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, marginBottom: 32 }}>
        {/* Phone Mockup */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', 
          borderRadius: 32, 
          padding: '20px 16px',
          border: '8px solid #374151',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          maxWidth: 360,
          margin: '0 auto'
        }}>
          {/* Phone Screen */}
          <div style={{ background: '#0f172a', borderRadius: 20, overflow: 'hidden' }}>
            {/* Status Bar */}
            <div style={{ background: '#1e293b', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>9:41</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 16, height: 16, background: '#10b981', borderRadius: '50%' }} />
                <span style={{ color: '#fff', fontSize: 12 }}>●●●●</span>
              </div>
            </div>

            {/* App Content */}
            <div style={{ padding: 20 }}>
              {/* User Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: 16, background: 'rgba(139, 92, 246, 0.2)', borderRadius: 12 }}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
                  JM
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>João Motorista</div>
                  <div style={{ color: '#9aa3b0', fontSize: 12 }}>Placa: ABC-1234</div>
                </div>
              </div>

              {/* Viagem Ativa */}
              <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 78, 59, 0.3))', border: '2px solid #10b981', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Navigation size={20} color="#10b981" />
                  <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: 14 }}>VIAGEM ATIVA</span>
                </div>
                <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                  SP → RJ • 428 km
                </div>
                <div style={{ color: '#cbd5e1', fontSize: 13, marginBottom: 12 }}>
                  ETA: 5h 20min • Chegada: 15:30
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.3)', borderRadius: 8, height: 8, marginBottom: 8, overflow: 'hidden' }}>
                  <div style={{ background: '#10b981', width: '67%', height: '100%' }} />
                </div>
                <div style={{ color: '#9aa3b0', fontSize: 12 }}>287 km concluídos (67%)</div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { icon: '📸', label: 'Registrar Ocorrência', color: '#ef4444' },
                  { icon: '⛽', label: 'Abastecimento', color: '#f59e0b' },
                  { icon: '💬', label: 'Chat Suporte', color: '#3b82f6' },
                  { icon: '💰', label: 'Meus Ganhos', color: '#10b981' }
                ].map((action, idx) => (
                  <button key={idx} style={{ 
                    padding: 16, 
                    background: 'rgba(255,255,255,0.05)', 
                    border: `1px solid ${action.color}40`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{ fontSize: 24 }}>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Alertas */}
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <AlertCircle size={16} color="#f59e0b" />
                  <span style={{ color: '#f59e0b', fontSize: 12, fontWeight: 'bold' }}>ALERTA</span>
                </div>
                <p style={{ margin: 0, color: '#fbbf24', fontSize: 11, lineHeight: 1.5 }}>
                  Trânsito intenso em 15km. Sugestão: parar para descanso obrigatório.
                </p>
              </div>
            </div>

            {/* Bottom Nav */}
            <div style={{ background: '#1e293b', padding: '12px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
              {[
                { icon: '🏠', label: 'Início' },
                { icon: '📦', label: 'Viagens' },
                { icon: '💰', label: 'Ganhos' },
                { icon: '👤', label: 'Perfil' }
              ].map((nav, idx) => (
                <button key={idx} style={{ 
                  background: idx === 0 ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                  border: 'none',
                  color: idx === 0 ? '#8b5cf6' : '#9aa3b0',
                  fontSize: 10,
                  padding: '8px 4px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <span style={{ fontSize: 18 }}>{nav.icon}</span>
                  <span>{nav.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features List */}
        <div>
          <h2 style={{ margin: '0 0 24px', color: '#8b5cf6', fontSize: 28 }}>✨ Recursos Premium</h2>
          
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              {
                icon: <Navigation size={24} color="#10b981" />,
                title: 'GPS Inteligente Offline',
                desc: 'Funciona sem internet. Alertas de radares, fiscalização e melhores postos.',
                highlight: '🔥 Mais popular'
              },
              {
                icon: <Camera size={24} color="#3b82f6" />,
                title: 'Check-in Automático por Foto',
                desc: 'Basta tirar foto da carga/documento. IA valida e registra automaticamente.',
                highlight: '🤖 IA Powered'
              },
              {
                icon: <MessageSquare size={24} color="#8b5cf6" />,
                title: 'Chat Direto com Operações',
                desc: 'Suporte em tempo real. Compartilhe localização, fotos e documentos.',
                highlight: '⚡ Instantâneo'
              },
              {
                icon: <DollarSign size={24} color="#10b981" />,
                title: 'Wallet Digital + Cashback',
                desc: 'Receba adiantamentos, pague pedágios/abastecimento e ganhe até 5% de volta.',
                highlight: '💰 Economia'
              },
              {
                icon: <AlertCircle size={24} color="#ef4444" />,
                title: 'Alertas Proativos',
                desc: 'Previsão de trânsito, clima, pontos de atenção e sugestões de paradas.',
                highlight: '🎯 Preditivo'
              },
              {
                icon: <CheckCircle size={24} color="#10b981" />,
                title: 'Gamificação e Recompensas',
                desc: 'Ganhe pontos por performance: direção segura, entregas no prazo, economia.',
                highlight: '🏆 Engajamento'
              }
            ].map((feature, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                gap: 16, 
                padding: 20, 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: 12,
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}>
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  background: 'rgba(139, 92, 246, 0.2)', 
                  borderRadius: 12, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {feature.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ margin: 0, color: '#e5e7eb', fontSize: 18 }}>{feature.title}</h3>
                    <span style={{ fontSize: 11, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', padding: '2px 8px', borderRadius: 12, color: '#fff' }}>
                      {feature.highlight}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#9aa3b0', fontSize: 14, lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32 }}>
        <h2 style={{ margin: '0 0 24px', color: '#e5e7eb', fontSize: 28 }}>🎯 Por que os Motoristas Amam</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[
            { icon: '🚀', stat: '3x mais rápido', desc: 'Check-ins e registros comparado a papel/WhatsApp' },
            { icon: '💰', stat: 'R$ 420/mês', desc: 'Economia média com cashback e melhores rotas' },
            { icon: '⭐', stat: '87% adoção', desc: 'Motoristas preferem usar vs. apps tradicionais' },
            { icon: '🔋', stat: 'Funciona offline', desc: 'GPS e recursos essenciais sem internet' },
            { icon: '🎁', stat: 'Recompensas reais', desc: 'Pontos viram dinheiro, prêmios e benefícios' },
            { icon: '🛡️', stat: 'Segurança total', desc: 'SOS, rastreamento e comunicação direta' }
          ].map((benefit, idx) => (
            <div key={idx} style={{ padding: 24, background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{benefit.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#8b5cf6', marginBottom: 8 }}>{benefit.stat}</div>
              <p style={{ margin: 0, color: '#9aa3b0', fontSize: 14, lineHeight: 1.6 }}>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
