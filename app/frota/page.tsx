'use client';
import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useI18n } from '@/app/providers/I18nProvider';

export default function FrotaPage() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useI18n();

  const items = [
    {
      key: 'veiculos',
      title: t('fleet.vehicles.title'),
      desc: t('fleet.vehicles.desc'),
      href: '/cadastro/veiculos',
      icon: '🚚',
      color: '#ef4444',
    },
    {
      key: 'motoristas',
      title: t('fleet.drivers.title'),
      desc: t('fleet.drivers.desc'),
      href: '/cadastro/motoristas',
      icon: '🧑\u200d✈️',
      color: '#0ea5e9',
    },
    {
      key: 'ordens',
      title: 'Ordens de Serviço',
      desc: 'Abertura, aprovação e execução de OS',
      href: '/frota/ordens',
      icon: '🧰',
      color: '#f59e0b',
    },
    {
      key: 'pneus',
      title: 'Gestão de Pneus',
      desc: 'Movimentação, vida útil, recapagem, TPMS',
      href: '/frota/pneus',
      icon: '🛞',
      color: '#64748b',
    },
    {
      key: 'manutencoes',
      title: 'Manutenções',
      desc: 'Programação e execução de serviços',
      href: '/frota/manutencoes',
      icon: '🔧',
      color: '#22c55e',
    },
    {
      key: 'abastecimentos',
      title: 'Abastecimentos',
      desc: 'Controle de combustível e consumo',
      href: '/frota/abastecimentos',
      icon: '⛽',
      color: '#3b82f6',
    },
    {
      key: 'estoque',
      title: 'Estoque de Peças',
      desc: 'Cadastro, entradas/saídas e mínimos',
      href: '/frota/estoque',
      icon: '📦',
      color: '#8b5cf6',
    },
    {
      key: 'pedidos',
      title: 'Pedidos/Compras',
      desc: 'Requisições, cotações e pedidos',
      href: '/frota/pedidos',
      icon: '🧾',
      color: '#10b981',
    },
    {
      key: 'lavajato',
      title: 'Lava Jato',
      desc: 'Agenda e histórico de lavagens',
      href: '/frota/lava-jato',
      icon: '🧼',
      color: '#06b6d4',
    },
    {
      key: 'rastreamento',
      title: t('fleet.tracking.title'),
      desc: t('fleet.tracking.desc'),
      href: '/dashboard/logistica',
      icon: '📡',
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', padding: spacing.medium }}>
      <h1 style={{ fontSize: typography.h1, marginTop: 0 }}>{t('fleet.title')}</h1>
      <p style={{ color: colors.muted }}>{t('fleet.subtitle')}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: spacing.medium,
          marginTop: spacing.medium,
        }}
      >
        {items.map((item) => (
          <Link key={item.key} href={item.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: spacing.medium,
                backgroundColor: colors.surface,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 40,
                    height: 40,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 12,
                    backgroundColor: item.color,
                    fontSize: 24,
                  }}
                >
                  {item.icon}
                </span>
                <div>
                  <h2 style={{ fontSize: typography.h2, marginTop: 0, marginBottom: 4 }}>
                    {item.title}
                  </h2>
                  <p style={{ color: colors.muted, marginBottom: 0 }}>{item.desc}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
