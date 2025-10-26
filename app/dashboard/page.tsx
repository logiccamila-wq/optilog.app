"use client";
import Link from 'next/link';
import AuthStatus from '@/app/AuthStatus';
import { useTheme } from '@/app/providers/ThemeProvider';

const modules = [
  { key: 'visao-geral', title: 'Visão Geral', desc: 'KPIs e status operacional em tempo real.' },
  { key: 'pedidos', title: 'Pedidos', desc: 'Gestão de pedidos, tracking e SLA.' },
  { key: 'logistica', title: 'Logística', desc: 'Rotas, last-mile e custos.' },
  { key: 'estoque', title: 'Estoque', desc: 'Níveis, reposição e rupturas.' },
  { key: 'financeiro', title: 'Financeiro', desc: 'Faturamento, custos e conciliações.' },
  { key: 'analise', title: 'Análise', desc: 'Relatórios e insights preditivos.' },
];

export default function DashboardPage() {
  const { colors, spacing, typography } = useTheme();

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: spacing.medium }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.medium }}>
        <h1 style={{ fontSize: typography.h1, margin: 0 }}>Dashboard EJG</h1>
        <AuthStatus />
      </div>

      <p style={{ color: colors.muted, fontSize: typography.subtitle, marginBottom: spacing.medium }}>
        Explore os módulos abaixo. Para acessar dados reais, faça <Link href="/login">login</Link> ou <Link href="/signup">cadastro</Link>.
      </p>

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
  );
}