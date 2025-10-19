'use client';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function ContasAReceberPage() {
  const { colors, spacing, typography } = useTheme();
  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: spacing.medium }}>
      <h1 style={{ fontSize: typography.h1, marginTop: 0 }}>Contas a Receber</h1>
      <p style={{ color: colors.muted, fontSize: typography.subtitle }}>
        Faturas, boletos/PIX, inadimplência, renegociação e cobrança.
      </p>
      <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, backgroundColor: colors.surface, padding: spacing.medium }}>
        <p style={{ margin: 0 }}>Tabela e fluxo de recebimento serão adicionados.</p>
      </div>
    </div>
  );
}