'use client';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function ImpostosPage() {
  const { colors, spacing, typography } = useTheme();

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: spacing.medium }}>
      <h1 style={{ fontSize: typography.h1, marginTop: 0 }}>Impostos</h1>
      <p style={{ color: colors.muted, fontSize: typography.subtitle }}>
        Regimes, apurações, guias e calendário fiscal.
      </p>

      <section style={{ marginTop: spacing.large }}>
        <h2 style={{ fontSize: typography.h2 }}>Regimes Tributários</h2>
        <p style={{ color: colors.muted }}>
          Configuração de regime (Simples, Lucro Presumido, Lucro Real) e alíquotas.
        </p>
        <div
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: spacing.medium,
            backgroundColor: colors.surface,
          }}
        >
          {/* TODO: Formulário de regime + alíquotas por imposto */}
          <div style={{ color: colors.muted }}>
            Em breve: cadastro de regime e regras de apuração.
          </div>
        </div>
      </section>

      <section style={{ marginTop: spacing.large }}>
        <h2 style={{ fontSize: typography.h2 }}>Apurações & Guias</h2>
        <p style={{ color: colors.muted }}>
          Apure tributos e gere guias (ISS, ICMS, PIS/COFINS, IRPJ/CSLL).
        </p>
        <div
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: spacing.medium,
            backgroundColor: colors.surface,
          }}
        >
          {/* TODO: Tabela de apurações + status de guias e exportação */}
          <div style={{ color: colors.muted }}>
            Em breve: extratos de apuração e emissão de guias.
          </div>
        </div>
      </section>

      <section style={{ marginTop: spacing.large }}>
        <h2 style={{ fontSize: typography.h2 }}>Calendário Fiscal</h2>
        <p style={{ color: colors.muted }}>Controle de vencimentos e lembretes automáticos.</p>
        <div
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: spacing.medium,
            backgroundColor: colors.surface,
          }}
        >
          {/* TODO: Calendário com integrações e notificações */}
          <div style={{ color: colors.muted }}>Em breve: calendário integrado com alertas.</div>
        </div>
      </section>
    </div>
  );
}
