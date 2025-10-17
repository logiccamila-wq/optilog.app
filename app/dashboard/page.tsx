"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthStatus from '@/app/AuthStatus';
import { useTheme } from '@/app/providers/ThemeProvider';

const modules = [
  { key: 'visao-geral', title: 'Visão Geral', desc: 'KPIs e status operacional em tempo real.' },
  { key: 'pedidos', title: 'Pedidos', desc: 'Gestão de pedidos, tracking e SLA.' },
  { key: 'logistica', title: 'Logística', desc: 'Rotas, last-mile e custos.' },
  { key: 'estoque', title: 'Estoque', desc: 'Níveis, reposição e rupturas.' },
  { key: 'frota', title: 'Gestão de Frota', desc: 'Veículos, manutenções e pneus.' },
  { key: 'financeiro', title: 'Financeiro', desc: 'Faturamento, custos e conciliações.' },
  { key: 'analise', title: 'Análise', desc: 'Relatórios e insights preditivos.' },
];

export default function DashboardPage() {
  const { colors, spacing, typography } = useTheme();
  const externalUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;
  const router = useRouter();

  // Se existir URL externa configurada, redireciona automaticamente
  useEffect(() => {
    if (externalUrl) {
      router.replace(externalUrl);
    }
  }, [externalUrl, router]);

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: spacing.medium, display: 'grid', gridTemplateColumns: '260px 1fr', gap: spacing.medium }}>
      {/* Sidebar fixa, mesmo padrão dos módulos */}
      <aside style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: spacing.medium, height: 'fit-content', backgroundColor: colors.surface }}>
        <h3 style={{ marginTop: 0 }}>Módulos</h3>
        <div style={{ display: 'grid', gap: spacing.small }}>
          {modules.map((m) => (
            <Link key={m.key} href={`/dashboard/${m.key}`} style={{ textDecoration: 'none' }}>
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 12px', background: '#111', color: '#ddd' }}>
                <strong>{m.title}</strong>
                <div style={{ color: '#888', fontSize: 12 }}>{m.desc}</div>
              </div>
            </Link>
          ))}
        </div>
        <hr style={{ borderColor: colors.border, margin: `${spacing.small} 0` }} />
        <h4 style={{ marginTop: 0 }}>Atalhos</h4>
        <div style={{ display: 'grid', gap: 6 }}>
          <Link href="/driver" style={{ color: '#9ecfff' }}>App do Motorista</Link>
          <Link href="/mechanic" style={{ color: '#9ecfff' }}>App do Mecânico</Link>
          <Link href="/usuarios" style={{ color: '#9ecfff' }}>Cadastro: Usuários</Link>
          <Link href="/cadastro/motoristas" style={{ color: '#9ecfff' }}>Cadastro: Motoristas</Link>
          <Link href="/cadastro/veiculos" style={{ color: '#9ecfff' }}>Cadastro: Veículos</Link>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.medium }}>
          <h1 style={{ fontSize: typography.h1, margin: 0 }}>Dashboard EJG</h1>
          <AuthStatus />
        </div>

        {!externalUrl && (
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: spacing.medium, backgroundColor: colors.surface, marginBottom: spacing.medium }}>
            <p style={{ color: colors.muted, fontSize: typography.subtitle, margin: 0 }}>
              Para habilitar o redirecionamento automático, defina a variável de ambiente <code>NEXT_PUBLIC_DASHBOARD_URL</code> com a URL do Cloud Run.
            </p>
          </div>
        )}

        <div style={{ marginBottom: spacing.medium }}>
          {externalUrl && (
            <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: spacing.medium, backgroundColor: colors.surface, marginBottom: spacing.small }}>
              <p style={{ color: colors.muted, fontSize: typography.subtitle, margin: 0 }}>
                Redirecionando para o Dashboard externo configurado...
              </p>
              <p style={{ marginTop: spacing.small }}>
                Caso não redirecione automaticamente, clique: <a href={externalUrl} target="_blank" rel="noopener noreferrer">{externalUrl}</a>
              </p>
            </div>
          )}
          <p style={{ color: colors.muted, fontSize: typography.subtitle, margin: 0 }}>
            Explore os módulos locais abaixo. Para acessar dados reais, faça <Link href="/login">login</Link> ou <Link href="/signup">cadastro</Link>.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: spacing.medium }}>
          {modules.map((m) => (
            <Link key={m.key} href={`/dashboard/${m.key}`} style={{ textDecoration: 'none' }}>
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: spacing.medium, backgroundColor: colors.surface }}>
                <h2 style={{ fontSize: typography.h2, marginTop: 0 }}>{m.title}</h2>
                <p style={{ color: colors.muted, marginBottom: 0 }}>{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}