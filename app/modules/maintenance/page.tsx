'use client';
import Link from 'next/link';
import { Wrench, Calendar, AlertCircle, CheckCircle, ClipboardList, TrendingUp } from 'lucide-react';

export default function MaintenancePage() {
  const features = [
    { 
      title: 'Ordens de Serviço', 
      icon: <ClipboardList size={32} />,
      path: '/service-orders',
      description: 'Gestão completa de ordens de manutenção preventiva e corretiva'
    },
    { 
      title: 'Calendário de Manutenção', 
      icon: <Calendar size={32} />,
      path: '/frota/manutencao',
      description: 'Programação e agendamento de manutenções preventivas'
    },
    { 
      title: 'Histórico de Veículos', 
      icon: <CheckCircle size={32} />,
      path: '/frota/gestao',
      description: 'Registro completo de manutenções e custos por veículo'
    },
    { 
      title: 'Alertas Preventivos', 
      icon: <AlertCircle size={32} />,
      path: '/frota/gestao',
      description: 'Notificações automáticas de manutenções próximas'
    },
    { 
      title: 'Gestão de Pneus', 
      icon: <TrendingUp size={32} />,
      path: '/tire-service',
      description: 'Controle de vida útil, recapagens e trocas de pneus'
    }
  ];

  const stats = [
    { label: 'Ordens Abertas', value: '12', color: '#fbbf24' },
    { label: 'Manutenções Hoje', value: '5', color: '#60a5fa' },
    { label: 'Taxa de Disponibilidade', value: '94%', color: '#34d399' },
    { label: 'Custo Médio/Mês', value: 'R$ 45k', color: '#a6d3ff' }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Wrench size={48} color="#a6d3ff" />
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: '#e5e7eb' }}>
            Manutenção de Frota
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 16 }}>
            Sistema completo de gestão de manutenção preventiva e corretiva
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 16,
        marginBottom: 32 
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            border: `1px solid ${stat.color}40`,
            borderRadius: 12,
            padding: 20,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: stat.color, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 14, color: '#9aa3b0' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 20,
        marginTop: 32 
      }}>
        {features.map((feature, idx) => (
          <Link 
            key={idx} 
            href={feature.path}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              border: '1px solid rgba(166, 211, 255, 0.2)',
              borderRadius: 12,
              padding: 24,
              cursor: 'pointer',
              transition: 'all 0.3s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(166, 211, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(166, 211, 255, 0.2)';
            }}
            >
              <div style={{ color: '#a6d3ff' }}>{feature.icon}</div>
              <h3 style={{ margin: 0, color: '#a6d3ff', fontSize: 18 }}>
                {feature.title}
              </h3>
              <p style={{ margin: 0, color: '#9aa3b0', fontSize: 14, lineHeight: 1.5 }}>
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Benefits Section */}
      <div style={{
        marginTop: 40,
        padding: 24,
        background: 'rgba(166, 211, 255, 0.05)',
        borderRadius: 12,
        border: '1px solid rgba(166, 211, 255, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px', color: '#a6d3ff' }}>Benefícios da Manutenção Preventiva</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', lineHeight: 2 }}>
          <li>Redução de até 40% nos custos com manutenção corretiva</li>
          <li>Aumento da vida útil dos veículos em até 30%</li>
          <li>Melhoria na disponibilidade da frota</li>
          <li>Redução de quebras e paradas não programadas</li>
          <li>Controle preciso de custos e histórico de manutenções</li>
          <li>Gestão integrada com pneus, peças e fornecedores</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/service-orders" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 500,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Nova Ordem de Serviço
          </button>
        </Link>
        <Link href="/frota/manutencao" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(166, 211, 255, 0.1)',
            color: '#a6d3ff',
            border: '1px solid rgba(166, 211, 255, 0.3)',
            padding: '12px 24px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 500,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Ver Calendário
          </button>
        </Link>
      </div>
    </div>
  );
}
