'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthStatus from '@/app/AuthStatus';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useI18n } from '@/app/providers/I18nProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { hasAnyRole } from '@/lib/rbac';

export default function DashboardPage() {
  const { colors, spacing, typography } = useTheme();
  const { t } = useI18n();
  const externalUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;
  const router = useRouter();
  const { user } = useAuth();

  const modules = [
    {
      key: 'visao-geral',
      title: t('modules.overview.title'),
      desc: t('modules.overview.desc'),
      icon: '📊',
      color: '#0ea5e9',
    },
    {
      key: 'pedidos',
      title: t('modules.orders.title'),
      desc: t('modules.orders.desc'),
      icon: '📦',
      color: '#8b5cf6',
    },
    {
      key: 'crm',
      title: t('modules.crm.title'),
      desc: t('modules.crm.desc'),
      icon: '👥',
      color: '#14b8a6',
    },
    {
      key: 'logistica',
      title: t('modules.logistics.title'),
      desc: t('modules.logistics.desc'),
      icon: '🛣️',
      color: '#22c55e',
    },
    {
      key: 'estoque',
      title: t('modules.inventory.title'),
      desc: t('modules.inventory.desc'),
      icon: '🏷️',
      color: '#f59e0b',
    },
    {
      key: 'frota',
      title: t('modules.fleet.title'),
      desc: t('modules.fleet.desc'),
      icon: '🚚',
      color: '#ef4444',
    },
    {
      key: 'pneus',
      title: t('modules.tires.title'),
      desc: t('modules.tires.desc'),
      icon: '🛞',
      color: '#64748b',
    },
    {
      key: 'financeiro',
      title: t('modules.finance.title'),
      desc: t('modules.finance.desc'),
      icon: '💰',
      color: '#0f766e',
    },
    {
      key: 'analise',
      title: t('modules.analytics.title'),
      desc: t('modules.analytics.desc'),
      icon: '🔎',
      color: '#334155',
    },
  ];

  const filteredModules = modules.filter(
    (m) => m.key !== 'financeiro' || hasAnyRole(user, ['admin', 'finance'])
  );

  // Se existir URL externa configurada, redireciona automaticamente
  useEffect(() => {
    if (externalUrl) {
      router.replace(externalUrl);
    }
  }, [externalUrl, router]);

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '2rem auto',
        padding: spacing.medium,
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: spacing.medium,
      }}
    >
      {/* Sidebar fixa, mesmo padrão dos módulos */}
      <aside
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: spacing.medium,
          height: 'fit-content',
          backgroundColor: colors.surface,
        }}
      >
        <h3 style={{ marginTop: 0 }}>{t('common.modules')}</h3>
        <div style={{ display: 'grid', gap: spacing.small }}>
          {filteredModules.map((m) => (
            <Link key={m.key} href={`/dashboard/${m.key}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  padding: '8px 12px',
                  background: '#111',
                  color: '#ddd',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 8,
                    backgroundColor: m.color,
                  }}
                >
                  {m.icon}
                </span>
                <div>
                  <strong>{m.title}</strong>
                  <div style={{ color: '#888', fontSize: 12 }}>{m.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <hr style={{ borderColor: colors.border, margin: `${spacing.small} 0` }} />
        <h4 style={{ marginTop: 0 }}>{t('common.shortcuts')}</h4>
        <div style={{ display: 'grid', gap: 6 }}>
          <Link href="/driver" style={{ color: '#9ecfff' }}>
            {t('shortcuts.driver_app')}
          </Link>
          <Link href="/mechanic" style={{ color: '#9ecfff' }}>
            {t('shortcuts.mechanic_app')}
          </Link>
          <Link href="/usuarios" style={{ color: '#9ecfff' }}>
            {t('shortcuts.register_users')}
          </Link>
          <Link href="/cadastro/motoristas" style={{ color: '#9ecfff' }}>
            {t('shortcuts.register_drivers')}
          </Link>
          <Link href="/cadastro/veiculos" style={{ color: '#9ecfff' }}>
            {t('shortcuts.register_vehicles')}
          </Link>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.medium,
          }}
        >
          <h1 style={{ fontSize: typography.h1, margin: 0 }}>{t('dashboard.title')}</h1>
          <AuthStatus />
        </div>

        {!externalUrl && (
          <div
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: spacing.medium,
              backgroundColor: colors.surface,
              marginBottom: spacing.medium,
            }}
          >
            <p style={{ color: colors.muted, fontSize: typography.subtitle, margin: 0 }}>
              {t('dashboard.external.help')}
            </p>
          </div>
        )}

        <div style={{ marginBottom: spacing.medium }}>
          {externalUrl && (
            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: spacing.medium,
                backgroundColor: colors.surface,
                marginBottom: spacing.small,
              }}
            >
              <p style={{ color: colors.muted, fontSize: typography.subtitle, margin: 0 }}>
                {t('dashboard.external.redirecting')}
              </p>
              <p style={{ marginTop: spacing.small }}>
                {t('dashboard.external.click')}{' '}
                <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                  {externalUrl}
                </a>
              </p>
            </div>
          )}
          <p style={{ color: colors.muted, fontSize: typography.subtitle, margin: 0 }}>
            {t('dashboard.explore')} <Link href="/login">login</Link> {''}
            ou <Link href="/signup">cadastro</Link>.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: spacing.medium,
          }}
        >
          {filteredModules.map((m) => (
            <Link key={m.key} href={`/dashboard/${m.key}`} style={{ textDecoration: 'none' }}>
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
                      backgroundColor: m.color,
                      fontSize: 24,
                    }}
                  >
                    {m.icon}
                  </span>
                  <div>
                    <h2 style={{ fontSize: typography.h2, marginTop: 0, marginBottom: 4 }}>
                      {m.title}
                    </h2>
                    <p style={{ color: colors.muted, marginBottom: 0 }}>{m.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
