'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';

interface FleetModule {
  key: string;
  title: string;
  desc: string;
  href: string;
  icon: string;
  color: string;
}

export default function FrotaPage() {
  const [loading] = useState(false);

  const modules: FleetModule[] = [
    {
      key: 'veiculos',
      title: 'Veículos',
      desc: 'Cadastro e gestão da frota',
      href: '/cadastro/veiculos',
      icon: '🚚',
      color: 'var(--color-danger)',
    },
    {
      key: 'motoristas',
      title: 'Motoristas',
      desc: 'Cadastro e gestão de motoristas',
      href: '/cadastro/motoristas',
      icon: '🧑‍✈️',
      color: 'var(--color-info)',
    },
    {
      key: 'ordens',
      title: 'Ordens de Serviço',
      desc: 'Abertura, aprovação e execução de OS',
      href: '/service-orders',
      icon: '🧰',
      color: 'var(--color-warning)',
    },
    {
      key: 'pneus',
      title: 'Gestão de Pneus',
      desc: 'Movimentação, vida útil, recapagem, TPMS',
      href: '/frota/pneus',
      icon: '🛞',
      color: 'var(--color-gray)',
    },
    {
      key: 'manutencoes',
      title: 'Manutenções',
      desc: 'Programação e execução de serviços',
      href: '/frota/manutencoes',
      icon: '🔧',
      color: 'var(--color-success)',
    },
    {
      key: 'abastecimentos',
      title: 'Abastecimentos',
      desc: 'Controle de combustível e consumo',
      href: '/frota/abastecimentos',
      icon: '⛽',
      color: 'var(--color-primary)',
    },
    {
      key: 'estoque',
      title: 'Estoque de Peças',
      desc: 'Cadastro, entradas/saídas e mínimos',
      href: '/frota/estoque',
      icon: '📦',
      color: 'var(--color-accent)',
    },
    {
      key: 'ferramentas',
      title: 'Ferramentas',
      desc: 'Inventário, empréstimos e manutenção',
      href: '/frota/ferramentas',
      icon: '🛠️',
      color: 'var(--color-info)',
    },
    {
      key: 'pedidos',
      title: 'Pedidos/Compras',
      desc: 'Requisições, cotações e pedidos',
      href: '/frota/pedidos',
      icon: '🧾',
      color: 'var(--color-success)',
    },
    {
      key: 'lavajato',
      title: 'Lava Jato',
      desc: 'Agenda e histórico de lavagens',
      href: '/frota/lava-jato',
      icon: '🧼',
      color: 'var(--color-info)',
    },
    {
      key: 'rastreamento',
      title: 'Rastreamento',
      desc: 'Monitoramento em tempo real',
      href: '/dashboard/logistica',
      icon: '📡',
      color: 'var(--color-accent)',
    },
  ];

  return (
    <div className="frota-container">
      {/* Header */}
      <header className="frota-header">
        <h1 className="frota-title">Gestão de Frota</h1>
        <p className="frota-subtitle">
          Módulos completos para gestão de veículos, motoristas e manutenções
        </p>
      </header>

      {/* Modules Grid */}
      <section className="modules-grid" aria-label="Módulos da frota">
        {modules.map((module) => (
          <Link 
            key={module.key} 
            href={module.href}
            className="module-link"
          >
            <Card className="module-card">
              <div className="module-card__content">
                <div 
                  className="module-card__icon"
                  style={{ backgroundColor: `${module.color}20` }}
                  aria-hidden="true"
                >
                  <span style={{ fontSize: 24 }}>{module.icon}</span>
                </div>
                <div className="module-card__info">
                  <h2 className="module-card__title">{module.title}</h2>
                  <p className="module-card__desc">{module.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </section>

      <style jsx>{`
        .frota-container {
          padding: var(--spacing-6);
          max-width: 1400px;
          margin: 0 auto;
        }

        .frota-header {
          margin-bottom: var(--spacing-8);
        }

        .frota-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0 0 var(--spacing-2) 0;
          line-height: var(--line-height-tight);
        }

        .frota-subtitle {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
          margin: 0;
          line-height: var(--line-height-normal);
        }

        /* Modules Grid */
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-4);
        }

        .module-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .module-card {
          height: 100%;
          transition: all 0.2s ease;
        }

        .module-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .module-card__content {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-3);
          padding: var(--spacing-4);
        }

        .module-card__icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .module-card__info {
          flex: 1;
          min-width: 0;
        }

        .module-card__title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--spacing-1) 0;
          line-height: var(--line-height-tight);
        }

        .module-card__desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
          line-height: var(--line-height-normal);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .frota-container {
            padding: var(--spacing-4);
          }

          .frota-title {
            font-size: var(--font-size-2xl);
          }

          .modules-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }

          .module-card__content {
            padding: var(--spacing-3);
          }

          .module-card__icon {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
}