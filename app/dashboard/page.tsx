'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import {
  LocalShipping,
  DirectionsCar,
  AttachMoney,
  Assessment,
  TrendingUp,
  Build
} from '@mui/icons-material';

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

interface QuickAction {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function DashboardPage() {
  const router = useRouter();

  const stats: StatCard[] = [
    { 
      label: 'Viagens Ativas', 
      value: '12', 
      icon: <LocalShipping />, 
      color: 'var(--color-primary)', 
      path: '/motorista' 
    },
    { 
      label: 'Veículos Ativos', 
      value: '45', 
      icon: <DirectionsCar />, 
      color: 'var(--color-success)', 
      path: '/frota' 
    },
    { 
      label: 'Receita Mês', 
      value: 'R$ 245k', 
      icon: <AttachMoney />, 
      color: 'var(--color-warning)', 
      path: '/dashboard/financeiro' 
    },
    { 
      label: 'OS Pendentes', 
      value: '8', 
      icon: <Build />, 
      color: 'var(--color-accent)', 
      path: '/service-orders' 
    },
    { 
      label: 'Eficiência', 
      value: '94%', 
      icon: <TrendingUp />, 
      color: 'var(--color-info)', 
      path: '/bi' 
    },
    { 
      label: 'Manutenções', 
      value: '5', 
      icon: <Build />, 
      color: 'var(--color-danger)', 
      path: '/frota/manutencoes' 
    }
  ];

  const quickActions: QuickAction[] = [
    { label: 'Nova Viagem', path: '/motorista', icon: <LocalShipping /> },
    { label: 'Nova OS', path: '/service-orders', icon: <Build /> },
    { label: 'Torre de Controle', path: '/control-tower', icon: <Assessment /> },
    { label: 'Relatórios', path: '/relatorios/capacidade', icon: <Assessment /> }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Visão geral do sistema OptiLog TMS
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="stats-grid" aria-label="Estatísticas do sistema">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="stat-card"
            onClick={() => router.push(stat.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push(stat.path);
              }
            }}
          >
            <div className="stat-card__content">
              <div className="stat-card__info">
                <p className="stat-card__label">{stat.label}</p>
                <h2 className="stat-card__value">{stat.value}</h2>
              </div>
              <div 
                className="stat-card__icon" 
                style={{ backgroundColor: `${stat.color}20` }}
                aria-hidden="true"
              >
                {React.cloneElement(stat.icon as React.ReactElement, { 
                  style: { fontSize: 32, color: stat.color } 
                })}
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="quick-actions" aria-label="Ações rápidas">
        <h2 className="quick-actions__title">Ações Rápidas</h2>
        <div className="quick-actions__grid">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="quick-action-button"
              onClick={() => router.push(action.path)}
              type="button"
            >
              <span className="quick-action-button__icon" aria-hidden="true">
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <style jsx>{`
        .dashboard-container {
          padding: var(--spacing-6);
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: var(--spacing-8);
        }

        .dashboard-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0 0 var(--spacing-2) 0;
          line-height: var(--line-height-tight);
        }

        .dashboard-subtitle {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
          margin: 0;
          line-height: var(--line-height-normal);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-8);
        }

        .stat-card {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-card:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .stat-card__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-4);
        }

        .stat-card__label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0 0 var(--spacing-2) 0;
          font-weight: var(--font-weight-medium);
        }

        .stat-card__value {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0;
          line-height: var(--line-height-tight);
        }

        .stat-card__icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Quick Actions */
        .quick-actions {
          margin-top: var(--spacing-8);
        }

        .quick-actions__title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--spacing-4) 0;
          line-height: var(--line-height-tight);
        }

        .quick-actions__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-3);
        }

        .quick-action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-2);
          padding: var(--spacing-4);
          background-color: var(--color-background-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .quick-action-button:hover {
          background-color: var(--color-background-tertiary);
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .quick-action-button:active {
          transform: translateY(0);
        }

        .quick-action-button:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .quick-action-button__icon {
          display: flex;
          align-items: center;
          color: var(--color-primary);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: var(--spacing-4);
          }

          .dashboard-title {
            font-size: var(--font-size-2xl);
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }

          .stat-card__content {
            padding: var(--spacing-3);
          }

          .stat-card__value {
            font-size: var(--font-size-xl);
          }

          .stat-card__icon {
            width: 48px;
            height: 48px;
          }

          .quick-actions__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}