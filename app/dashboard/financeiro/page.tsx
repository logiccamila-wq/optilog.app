'use client';
import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function FinanceiroPage() {
  const { colors, spacing, typography } = useTheme();

  const features = [
    {
      href: '/dashboard/financeiro/contas-a-pagar',
      title: 'Contas a Pagar',
      desc: 'Lançamentos, vencimentos, pagamentos e fornecedores.',
    },
    {
      href: '/dashboard/financeiro/contas-a-receber',
      title: 'Contas a Receber',
      desc: 'Faturas, boletos/PIX, inadimplência e cobrança.',
    },
    {
      href: '/dashboard/financeiro/conciliacao',
      title: 'Conciliação Bancária',
      desc: 'Importe extratos, reconcilie e audite diferenças.',
    },
    {
      href: '/dashboard/financeiro/dre',
      title: 'DRE',
      desc: 'Demonstração de resultado com filtros e períodos.',
    },
    {
      href: '/dashboard/financeiro/centros-de-custo',
      title: 'Centros de Custo',
      desc: 'Estruture centros, aloque despesas e analise por unidade.',
    },
    {
      href: '/dashboard/financeiro/contabilidade',
      title: 'Contabilidade',
      desc: 'Plano de contas, lançamentos, balancete e fechamento.',
    },
    {
      href: '/dashboard/financeiro/impostos',
      title: 'Impostos',
      desc: 'Tributação, guias, apurações e obrigações.',
    },
    {
      href: '/dashboard/financeiro/analise-de-custos',
      title: 'Análise de Custos',
      desc: 'Diesel, pedágio, pneus, diárias, custo por km.',
    },
    {
      href: '/dashboard/financeiro/folha',
      title: 'Folha de Pagamento',
      desc: 'Processamento, adiantamentos, eventos e integrações.',
    },
    {
      href: '/dashboard/financeiro/rh-dp',
      title: 'RH / DP',
      desc: 'Pessoas, cargos, jornada, documentação e compliance.',
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: spacing.medium }}>
      <h1 style={{ fontSize: typography.h1, marginTop: 0 }}>Financeiro</h1>
      <p style={{ color: colors.muted, fontSize: typography.subtitle }}>
        Módulos financeiros essenciais para empresas de transporte, logística e frota.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: spacing.medium,
        }}
      >
        {features.map((f) => (
          <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: spacing.medium,
                backgroundColor: colors.surface,
              }}
            >
              <h2 style={{ fontSize: typography.h2, marginTop: 0 }}>{f.title}</h2>
              <p style={{ color: colors.muted, marginBottom: 0 }}>{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
