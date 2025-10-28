'use client';
import Link from 'next/link';
import { Settings, TrendingUp, Users, FileText } from 'lucide-react';

export default function ErpPage() {
  const modules = [
    { 
      title: 'Financeiro & Contabilidade', 
      icon: '💰',
      path: '/dashboard/financeiro',
      description: 'Gestão completa de contas, DRE e contabilidade'
    },
    { 
      title: 'Recursos Humanos', 
      icon: '👥',
      path: '/usuarios',
      description: 'Gestão de colaboradores e folha de pagamento'
    },
    { 
      title: 'Gestão de Ativos', 
      icon: '🏢',
      path: '/frota/gestao',
      description: 'Controle de frota, equipamentos e patrimônio'
    },
    { 
      title: 'Relatórios Gerenciais', 
      icon: '📊',
      path: '/relatorios/capacidade',
      description: 'Análises e indicadores de desempenho'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Settings size={48} color="#a6d3ff" />
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: '#e5e7eb' }}>
            ERP • Enterprise Resource Planning
          </h1>
          <p style={{ margin: '8px 0 0', color: '#9aa3b0', fontSize: 16 }}>
            Planejamento integrado de recursos empresariais
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 20,
        marginTop: 32 
      }}>
        {modules.map((module, idx) => (
          <Link 
            key={idx} 
            href={module.path}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              border: '1px solid rgba(166, 211, 255, 0.2)',
              borderRadius: 12,
              padding: 24,
              cursor: 'pointer',
              transition: 'all 0.3s',
              height: '100%'
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
              <div style={{ fontSize: 48, marginBottom: 12 }}>{module.icon}</div>
              <h3 style={{ margin: '0 0 8px', color: '#a6d3ff', fontSize: 18 }}>
                {module.title}
              </h3>
              <p style={{ margin: 0, color: '#9aa3b0', fontSize: 14, lineHeight: 1.5 }}>
                {module.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{
        marginTop: 40,
        padding: 24,
        background: 'rgba(166, 211, 255, 0.05)',
        borderRadius: 12,
        border: '1px solid rgba(166, 211, 255, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px', color: '#a6d3ff' }}>Benefícios do ERP Integrado</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#cbd5e1', lineHeight: 2 }}>
          <li>Centralização de dados e processos empresariais</li>
          <li>Redução de custos operacionais e retrabalho</li>
          <li>Tomada de decisão baseada em dados em tempo real</li>
          <li>Conformidade fiscal e contábil automatizada</li>
          <li>Integração entre setores (financeiro, RH, operacional)</li>
        </ul>
      </div>
    </div>
  );
}
