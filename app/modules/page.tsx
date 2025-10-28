import Link from 'next/link';
import { Boxes, Package, Truck, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function ModulesHome() {
  const groups = [
    {
      key: 'wms',
      title: 'WMS • Warehouse Management',
      icon: Boxes,
      color: '#8bc8ff',
      items: [
        'Recebimento e separação',
        'Endereçamento e expedição',
        'Inventário e armazenagem',
        'Transferências e controle de entrega',
      ],
    },
    {
      key: 'tms',
      title: 'TMS • Transport Management',
      icon: Truck,
      color: '#a6f0ff',
      items: [
        'Rastreamento de mercadorias',
        'Controle de cargas e documentação',
        'Relatório de faturamento',
        'Simulações de frete e rotas',
      ],
    },
    {
      key: 'oms',
      title: 'OMS • Order Management',
      icon: ShoppingCart,
      color: '#c8f9b6',
      items: [
        'Processamento de pedidos',
        'Gestão multi-canal',
        'Segurança e visão centralizada',
        'Informações em tempo real',
      ],
    },
    {
      key: 'scm',
      title: 'SCM • Supply Chain',
      icon: Package,
      color: '#ffdf99',
      items: ['Compras', 'Inventários', 'Pontos de venda', 'Exportações e distribuição'],
    },
    {
      key: 'crm',
      title: 'CRM • Customer Relationship',
      icon: Users,
      color: '#ffd6e4',
      items: [
        'Registro e atendimento',
        'Captura e análise de dados',
        'Simplificação de tarefas',
        'Projeções e campanhas',
      ],
    },
    {
      key: 'erp',
      title: 'ERP • Enterprise Resource Planning',
      icon: Package,
      color: '#d2c1ff',
      items: ['Financeiro e contabilidade', 'Produção', 'RH', 'Relatórios e gestão de ativos'],
    },
    {
      key: 'finance',
      title: 'Finance • Gestão Financeira',
      icon: DollarSign,
      color: '#90ee90',
      items: ['FPA - Fluxo de Pagamentos', 'Análise de Risco', 'DRE e Contabilidade', 'Contas a Pagar/Receber'],
    },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Visão geral dos módulos</h1>
      <p style={{ color: '#9aa3b0' }}>
        Organização com coluna à esquerda e agrupamentos por domínio. Escolha um módulo para abrir.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <Link key={g.key} href={`/modules/${g.key}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  border: '1px solid #222',
                  borderRadius: 10,
                  padding: 16,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.03))',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Icon color={g.color} />
                  <strong style={{ color: '#e5e7eb' }}>{g.title}</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 14 }}>
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
