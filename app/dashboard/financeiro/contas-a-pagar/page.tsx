'use client';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function ContasAPagarPage() {
  const { colors, spacing, typography } = useTheme();
  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: spacing.medium }}>
      <h1 style={{ fontSize: typography.h1, marginTop: 0 }}>Contas a Pagar</h1>
      <p style={{ color: colors.muted, fontSize: typography.subtitle }}>
        Cadastre lançamentos, gerencie vencimentos, aprovações e pagamentos.
      </p>
      <div
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          backgroundColor: colors.surface,
          padding: spacing.medium,
        }}
      >
        <p style={{ margin: 0 }}>Tabela e CRUD virão aqui (integração com backend).</p>
      </div>
    </div>
  );
}
