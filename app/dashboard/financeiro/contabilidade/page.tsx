'use client';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function ContabilidadePage() {
  const { colors, spacing, typography } = useTheme();

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: spacing.medium }}>
      <h1 style={{ fontSize: typography.h1, marginTop: 0 }}>Contabilidade</h1>
      <p style={{ color: colors.muted, fontSize: typography.subtitle }}>
        Plano de contas, lançamentos contábeis, balancete e fechamento.
      </p>

      <section style={{ marginTop: spacing.large }}>
        <h2 style={{ fontSize: typography.h2 }}>Plano de Contas</h2>
        <p style={{ color: colors.muted }}>Estruture contas (receitas, despesas, impostos) com hierarquia.</p>
        <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: spacing.medium, backgroundColor: colors.surface }}>
          {/* TODO: Tree de contas + CRUD (adicionar/editar/remover) */}
          <div style={{ color: colors.muted }}>Em breve: árvore de contas com níveis e tipos.</div>
        </div>
      </section>

      <section style={{ marginTop: spacing.large }}>
        <h2 style={{ fontSize: typography.h2 }}>Lançamentos</h2>
        <p style={{ color: colors.muted }}>Registre débitos/créditos por centro de custo e período.</p>
        <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: spacing.medium, backgroundColor: colors.surface }}>
          {/* TODO: Tabela de lançamentos + filtro por período/centro */}
          <div style={{ color: colors.muted }}>Em breve: tabela com lançamentos contábeis e filtros.</div>
        </div>
      </section>

      <section style={{ marginTop: spacing.large }}>
        <h2 style={{ fontSize: typography.h2 }}>Balancete & Fechamento</h2>
        <p style={{ color: colors.muted }}>Concilie contas, gere balancetes e feche períodos.</p>
        <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: spacing.medium, backgroundColor: colors.surface }}>
          {/* TODO: Agregações por conta + export CSV/PDF */}
          <div style={{ color: colors.muted }}>Em breve: agregações e exportações para auditoria.</div>
        </div>
      </section>
    </div>
  );
}