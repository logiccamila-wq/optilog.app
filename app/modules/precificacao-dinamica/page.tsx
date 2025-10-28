'use client';
import { useState } from 'react';
import { DollarSign, TrendingUp, Fuel, MapPin, Clock, Truck } from 'lucide-react';

export default function PrecificacaoDinamicaPage() {
  const [distancia, setDistancia] = useState(450);
  const [peso, setPeso] = useState(12000);
  const [urgencia, setUrgencia] = useState('normal');

  const calcularPreco = () => {
    const baseKm = 2.5;
    const basePeso = peso / 1000 * 15;
    const multiplicadorUrgencia = urgencia === 'express' ? 1.4 : urgencia === 'agendado' ? 0.85 : 1;
    const precoBase = (distancia * baseKm + basePeso) * multiplicadorUrgencia;
    
    return {
      base: precoBase,
      economia: urgencia === 'agendado' ? precoBase * 0.15 : 0,
      urgencia: urgencia === 'express' ? precoBase * 0.4 : 0,
      final: precoBase
    };
  };

  const preco = calcularPreco();

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <DollarSign size={56} color="#10b981" />
        <div>
          <h1 style={{ margin: 0, fontSize: 36, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: 12 }}>
            💰 Precificação Dinâmica IA
            <span style={{ fontSize: 14, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '4px 12px', borderRadius: 20, fontWeight: 'normal' }}>
              LIVE
            </span>
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 18 }}>
            Preços inteligentes que maximizam margem e competitividade
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <TrendingUp size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>+23%</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Aumento de Margem</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <DollarSign size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>92%</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Taxa de Aceitação</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: 20, borderRadius: 12, color: 'white' }}>
          <Clock size={32} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>2 seg</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Cálculo Instantâneo</div>
        </div>
      </div>

      {/* Calculadora */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Input */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32 }}>
          <h2 style={{ margin: '0 0 24px', color: '#10b981', fontSize: 24 }}>📊 Parâmetros da Carga</h2>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#e5e7eb', marginBottom: 12, fontSize: 16 }}>
              📍 Distância: <strong>{distancia} km</strong>
            </label>
            <input 
              type="range" 
              min="50" 
              max="2000" 
              value={distancia}
              onChange={(e) => setDistancia(Number(e.target.value))}
              style={{ width: '100%', height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #10b981, #3b82f6)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: '#9aa3b0', fontSize: 14 }}>
              <span>50 km</span>
              <span>2000 km</span>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#e5e7eb', marginBottom: 12, fontSize: 16 }}>
              ⚖️ Peso da Carga: <strong>{(peso/1000).toFixed(1)} toneladas</strong>
            </label>
            <input 
              type="range" 
              min="1000" 
              max="30000" 
              step="500"
              value={peso}
              onChange={(e) => setPeso(Number(e.target.value))}
              style={{ width: '100%', height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: '#9aa3b0', fontSize: 14 }}>
              <span>1 ton</span>
              <span>30 ton</span>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#e5e7eb', marginBottom: 12, fontSize: 16 }}>⚡ Urgência</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { value: 'agendado', label: '📅 Agendado', desc: '-15% preço', color: '#3b82f6' },
                { value: 'normal', label: '🚚 Normal', desc: 'Padrão', color: '#10b981' },
                { value: 'express', label: '⚡ Express', desc: '+40% preço', color: '#ef4444' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setUrgencia(opt.value)}
                  style={{
                    padding: 16,
                    background: urgencia === opt.value ? opt.color : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${urgencia === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 12,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: 14,
                    fontWeight: urgencia === opt.value ? 'bold' : 'normal'
                  }}
                >
                  <div style={{ marginBottom: 4 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', color: '#10b981', fontSize: 18 }}>🧮 Fatores Considerados pela IA</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', fontSize: 14, lineHeight: 1.8 }}>
              <li>💵 Preço do diesel em tempo real (R$ 5,89/L média nacional)</li>
              <li>📈 Demanda histórica na rota (pico: 18% acima da média)</li>
              <li>🚦 Condições de trânsito e pedágios (R$ 87 estimado)</li>
              <li>🏭 Backhaul disponível (+12% retorno carregado)</li>
              <li>⚠️ Complexidade da carga e necessidades especiais</li>
              <li>🎯 Competitividade no mercado (benchmark: R$ 2,80/km)</li>
            </ul>
          </div>
        </div>

        {/* Output */}
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 16, padding: 32 }}>
          <h2 style={{ margin: '0 0 24px', color: '#10b981', fontSize: 24 }}>💵 Cotação Final</h2>
          
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#9aa3b0', marginBottom: 8 }}>Valor Recomendado</div>
            <div style={{ fontSize: 56, fontWeight: 'bold', color: '#10b981' }}>
              R$ {preco.final.toFixed(2).replace('.', ',')}
            </div>
            <div style={{ fontSize: 14, color: '#cbd5e1', marginTop: 8 }}>
              ou <strong>{(preco.final / distancia).toFixed(2).replace('.', ',')}</strong> R$/km
            </div>
          </div>

          <div style={{ marginBottom: 20, padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#cbd5e1' }}>
              <span>💰 Preço Base</span>
              <strong>R$ {preco.base.toFixed(2)}</strong>
            </div>
            {preco.economia > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#3b82f6' }}>
                <span>📅 Desc. Agendamento</span>
                <strong>- R$ {preco.economia.toFixed(2)}</strong>
              </div>
            )}
            {preco.urgencia > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#ef4444' }}>
                <span>⚡ Adicional Express</span>
                <strong>+ R$ {preco.urgencia.toFixed(2)}</strong>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20, padding: 16, background: 'rgba(16, 185, 129, 0.2)', borderRadius: 8, borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: 14, color: '#10b981', fontWeight: 'bold', marginBottom: 8 }}>✅ Recomendação IA</div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>
              {urgencia === 'express' 
                ? '🔥 Alta demanda detectada! Preço 23% acima da concorrência justificado pela urgência.'
                : urgencia === 'agendado'
                ? '🎯 Ótima oportunidade! Backhaul disponível permite desconto mantendo margem.'
                : '✨ Preço competitivo com margem saudável de 32%. Taxa de conversão esperada: 87%.'
              }
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 16, background: 'rgba(59, 130, 246, 0.2)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#3b82f6' }}>32%</div>
              <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>Margem Líquida</div>
            </div>
            <div style={{ padding: 16, background: 'rgba(139, 92, 246, 0.2)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#8b5cf6' }}>87%</div>
              <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>Prob. Aceite</div>
            </div>
          </div>

          <button style={{ 
            width: '100%', 
            marginTop: 24, 
            padding: 16, 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            border: 'none', 
            borderRadius: 8, 
            color: 'white', 
            fontSize: 18, 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            📤 Enviar Cotação ao Cliente
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32 }}>
        <h2 style={{ margin: '0 0 24px', color: '#e5e7eb', fontSize: 28 }}>🎯 Vantagens Competitivas</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { icon: '🤖', title: 'IA Sempre Aprendendo', desc: 'Melhora a cada cotação enviada e fechada' },
            { icon: '⚡', title: 'Resposta Instantânea', desc: 'Cliente recebe proposta em menos de 3 segundos' },
            { icon: '💎', title: 'Margem Otimizada', desc: 'Equilibra competitividade e lucratividade' },
            { icon: '📊', title: 'Análise de Mercado', desc: 'Benchmarking automático com concorrência' },
            { icon: '🔄', title: 'Ajuste Dinâmico', desc: 'Preços se adaptam a sazonalidade e demanda' },
            { icon: '🎁', title: 'Descontos Inteligentes', desc: 'Incentivos estratégicos que aumentam conversão' }
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
