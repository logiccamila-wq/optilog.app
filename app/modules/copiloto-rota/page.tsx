'use client';
import { useState } from 'react';
import { Navigation, Zap, TrendingDown, AlertTriangle, Battery, DollarSign } from 'lucide-react';

export default function CopilotoRotaPage() {
  const [origem, setOrigem] = useState('São Paulo, SP');
  const [destino, setDestino] = useState('Rio de Janeiro, RJ');
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Navigation size={56} color="#4facfe" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: 12 }}>
            🤖 Copiloto de Rota IA
            <span style={{ fontSize: 14, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '4px 12px', borderRadius: 20, fontWeight: 'normal' }}>
              BETA
            </span>
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Inteligência artificial que aprende com cada viagem e prevê o futuro
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <Zap size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>15-20%</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Economia de Combustível</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <TrendingDown size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>30min</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Redução de Tempo Médio</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <AlertTriangle size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>95%</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Precisão de Previsão</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <Battery size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>24/7</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Monitoramento Ativo</div>
        </div>
      </div>

      {/* Simulador */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Input */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', color: '#4facfe', fontSize: 24 }}>🎯 Planejar Rota</h2>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8 }}>Origem</label>
            <input 
              type="text" 
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 16 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8 }}>Destino</label>
            <input 
              type="text"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 16 }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#9aa3b0', marginBottom: 8 }}>Tipo de Carga</label>
            <select style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 16 }}>
              <option>Carga Seca</option>
              <option>Refrigerada</option>
              <option>Perecível</option>
              <option>Perigosa</option>
            </select>
          </div>

          <button 
            onClick={handleAnalyze}
            style={{ 
              width: '100%', 
              padding: 16, 
              background: analyzing ? '#666' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
              border: 'none', 
              borderRadius: 8, 
              color: 'white', 
              fontSize: 18, 
              fontWeight: 'bold',
              cursor: analyzing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
            disabled={analyzing}
          >
            {analyzing ? '🔄 Analisando IA...' : '🚀 Gerar Rota Inteligente'}
          </button>
        </div>

        {/* Results */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', color: '#43e97b', fontSize: 24 }}>✨ Recomendações IA</h2>
          
          <div style={{ marginBottom: 16, padding: 16, background: 'rgba(67, 233, 123, 0.1)', borderRadius: 8, borderLeft: '4px solid #43e97b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Navigation size={20} color="#43e97b" />
              <strong style={{ color: '#43e97b' }}>Melhor Rota</strong>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14 }}>
              Via Dutra → BR-116 → Av. Brasil
              <br />
              <span style={{ opacity: 0.7 }}>428 km • 5h 20min estimado</span>
            </p>
          </div>

          <div style={{ marginBottom: 16, padding: 16, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 8, borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <AlertTriangle size={20} color="#f59e0b" />
              <strong style={{ color: '#f59e0b' }}>Alertas Preditivos</strong>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14 }}>
              • Trânsito intenso previsto 14h-17h (Vale do Paraíba)
              <br />
              • Fiscalização detectada KM 312 (evitar 20h-22h)
              <br />
              • Chuva leve amanhã 06h-09h
            </p>
          </div>

          <div style={{ marginBottom: 16, padding: 16, background: 'rgba(79, 172, 254, 0.1)', borderRadius: 8, borderLeft: '4px solid #4facfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <DollarSign size={20} color="#4facfe" />
              <strong style={{ color: '#4facfe' }}>Economia Estimada</strong>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14 }}>
              💰 R$ 287,00 vs rota tradicional
              <br />
              ⛽ 68L combustível (18% economia)
              <br />
              ⏱️ 42min mais rápido
            </p>
          </div>

          <div style={{ padding: 16, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 8, borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Zap size={20} color="#8b5cf6" />
              <strong style={{ color: '#8b5cf6' }}>Paradas Estratégicas</strong>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14 }}>
              1️⃣ KM 180 - Posto Shell (R$ 5,89/L) + Restaurante
              <br />
              2️⃣ KM 340 - Área de descanso obrigatório
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32 }}>
        <h2 style={{ margin: '0 0 24px', color: '#e5e7eb', fontSize: 28 }}>🚀 Recursos Exclusivos</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[
            { icon: '🧠', title: 'Aprendizado Contínuo', desc: 'IA aprende com cada viagem e melhora as previsões' },
            { icon: '🗣️', title: 'Comando de Voz', desc: '"Siri da Logística" - motorista fala, sistema executa' },
            { icon: '⚡', title: 'Roteamento Dinâmico', desc: 'Ajuste automático em tempo real com base no trânsito' },
            { icon: '📊', title: 'Analytics Avançado', desc: 'Relatórios de performance e comparativo de rotas' },
            { icon: '🔔', title: 'Alertas Inteligentes', desc: 'Notificações proativas de riscos e oportunidades' },
            { icon: '💾', title: 'Histórico Completo', desc: 'Todas as rotas salvas para análise e melhoria' }
          ].map((feature, idx) => (
            <div key={idx} style={{ padding: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{feature.icon}</div>
              <h3 style={{ margin: '0 0 8px', color: '#e5e7eb', fontSize: 18 }}>{feature.title}</h3>
              <p style={{ margin: 0, color: '#9aa3b0', fontSize: 14, lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
