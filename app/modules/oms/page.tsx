'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function OmsPage() {
  const features = [
    { 
      title: 'Processamento de Pedidos', 
      icon: '📦',
      path: '/dashboard/pedidos',
      description: 'Gestão completa do ciclo de vida dos pedidos'
    },
    { 
      title: 'Gestão Multi-canal', 
      icon: '🌐',
      path: '/cadastro/clientes',
      description: 'Integração com e-commerce, loja física e parceiros'
    },
    { 
      title: 'Rastreamento em Tempo Real', 
      icon: '📍',
      path: '/motorista',
      description: 'Visibilidade total da jornada do pedido'
    },
    { 
      title: 'Analytics & Insights', 
      icon: '📊',
      path: '/relatorios/capacidade',
      description: 'Relatórios de performance e tendências de vendas'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <ShoppingCart size={48} color="#c8f9b6" />
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: '#e5e7eb' }}>
            OMS • Order Management System
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 16 }}>
            Sistema inteligente de gestão de pedidos
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
              background: 'linear-gradient(180deg, rgba(200, 249, 182, 0.05), rgba(200, 249, 182, 0.02))',
              border: '1px solid rgba(200, 249, 182, 0.2)',
              borderRadius: 12,
              padding: 24,
              cursor: 'pointer',
              transition: 'all 0.3s',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(200, 249, 182, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(200, 249, 182, 0.2)';
            }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{feature.icon}</div>
              <h3 style={{ margin: '0 0 8px', color: '#c8f9b6', fontSize: 18 }}>
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
        background: 'rgba(200, 249, 182, 0.05)',
        borderRadius: 12,
        border: '1px solid rgba(200, 249, 182, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px', color: '#c8f9b6' }}>Benefícios do OMS</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', lineHeight: 2 }}>
          <li>Processamento 3x mais rápido de pedidos</li>
          <li>Redução de erros e devoluções em até 40%</li>
          <li>Experiência omnichannel consistente</li>
          <li>Automação de regras de negócio e aprovações</li>
          <li>Integração nativa com TMS e WMS</li>
        </ul>
      </div>
    </div>
  );
}
