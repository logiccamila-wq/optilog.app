'use client';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function ScmPage() {
  const features = [
    { 
      title: 'Gestão de Compras', 
      icon: '🛒',
      path: '/frota/pedidos',
      description: 'Requisições, aprovações e controle de fornecedores'
    },
    { 
      title: 'Controle de Inventário', 
      icon: '📦',
      path: '/frota/estoque',
      description: 'Gestão de estoque em tempo real com alertas'
    },
    { 
      title: 'Logística & Distribuição', 
      icon: '🚚',
      path: '/motorista',
      description: 'Otimização de rotas e entregas'
    },
    { 
      title: 'Importação & Exportação', 
      icon: '🌍',
      path: '/cadastro/importacao',
      description: 'Gestão de processos internacionais e documentação'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Package size={48} color="#ffdf99" />
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: '#e5e7eb' }}>
            SCM • Supply Chain Management
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 16 }}>
            Gestão inteligente da cadeia de suprimentos
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
              background: 'linear-gradient(180deg, rgba(255, 223, 153, 0.05), rgba(255, 223, 153, 0.02))',
              border: '1px solid rgba(255, 223, 153, 0.2)',
              borderRadius: 12,
              padding: 24,
              cursor: 'pointer',
              transition: 'all 0.3s',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(255, 223, 153, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 223, 153, 0.2)';
            }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{feature.icon}</div>
              <h3 style={{ margin: '0 0 8px', color: '#ffdf99', fontSize: 18 }}>
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
        background: 'rgba(255, 223, 153, 0.05)',
        borderRadius: 12,
        border: '1px solid rgba(255, 223, 153, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px', color: '#ffdf99' }}>Benefícios do SCM</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', lineHeight: 2 }}>
          <li>Visibilidade end-to-end da cadeia de suprimentos</li>
          <li>Redução de custos operacionais em até 25%</li>
          <li>Otimização de níveis de estoque e capital de giro</li>
          <li>Previsão de demanda com machine learning</li>
          <li>Colaboração em tempo real com fornecedores</li>
        </ul>
      </div>
    </div>
  );
}
