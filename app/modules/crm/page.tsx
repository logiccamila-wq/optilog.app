'use client';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default function CrmPage() {
  const features = [
    { 
      title: 'Gestão de Clientes', 
      icon: '👥',
      path: '/cadastro/clientes',
      description: 'Cadastro completo e histórico de relacionamento'
    },
    { 
      title: 'Atendimento & Suporte', 
      icon: '💬',
      path: '/chat',
      description: 'Central de atendimento e tickets de suporte'
    },
    { 
      title: 'Análise de Dados', 
      icon: '📊',
      path: '/relatorios/capacidade',
      description: 'Insights sobre comportamento e preferências'
    },
    { 
      title: 'Campanhas & Marketing', 
      icon: '📧',
      path: '/cadastro/clientes',
      description: 'Projeções, segmentação e automação de campanhas'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Users size={48} color="#ffd6e4" />
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: '#e5e7eb' }}>
            CRM • Customer Relationship Management
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 16 }}>
            Gestão inteligente do relacionamento com clientes
          </p>
        </div>
      </div>

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
              background: 'linear-gradient(180deg, rgba(255, 214, 228, 0.05), rgba(255, 214, 228, 0.02))',
              border: '1px solid rgba(255, 214, 228, 0.2)',
              borderRadius: 12,
              padding: 24,
              cursor: 'pointer',
              transition: 'all 0.3s',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(255, 214, 228, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 214, 228, 0.2)';
            }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{feature.icon}</div>
              <h3 style={{ margin: '0 0 8px', color: '#ffd6e4', fontSize: 18 }}>
                {feature.title}
              </h3>
              <p style={{ margin: 0, color: '#9aa3b0', fontSize: 14, lineHeight: 1.5 }}>
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{
        marginTop: 40,
        padding: 24,
        background: 'rgba(255, 214, 228, 0.05)',
        borderRadius: 12,
        border: '1px solid rgba(255, 214, 228, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px', color: '#ffd6e4' }}>Vantagens do CRM</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', lineHeight: 2 }}>
          <li>Visão 360° do cliente em uma única plataforma</li>
          <li>Automação de processos de vendas e pós-venda</li>
          <li>Aumento da retenção e fidelização de clientes</li>
          <li>Análise preditiva para identificar oportunidades</li>
          <li>Melhoria contínua do atendimento e satisfação</li>
        </ul>
      </div>
    </div>
  );
}
