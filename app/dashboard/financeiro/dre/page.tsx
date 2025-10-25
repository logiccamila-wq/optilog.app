'use client';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function DREPage() {
  const { colors, spacing, typography } = useTheme();
  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: spacing.medium }}>
      <h1 style={{ fontSize: typography.h1, marginTop: 0 }}>DRE</h1>
      <p style={{ color: colors.muted, fontSize: typography.subtitle }}>
        Demonstração do Resultado com filtros por período, empresa e centro de custo.
      </p>
      <div
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          backgroundColor: colors.surface,
          padding: spacing.medium,
        }}
      >
        <p style={{ margin: 0 }}>Tabela/árvore de contas e agregações virão aqui.</p>
      </div>
    </div>
  );
}
