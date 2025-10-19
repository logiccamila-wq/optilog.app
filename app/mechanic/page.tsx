'use client';

import { useState, useMemo } from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function MechanicAppPage() {
  const { effectiveMode, setMode, accent } = useTheme();
  const [tab, setTab] = useState<'os' | 'pneus' | 'posto' | 'qualidade'>('os');

  const colors = useMemo(() => ({
    bg: effectiveMode === 'dark' ? '#0d111b' : '#ffffff',
    text: effectiveMode === 'dark' ? '#ffffff' : '#0f172a',
    surface: effectiveMode === 'dark' ? '#0f172a' : '#f8fafc',
    border: effectiveMode === 'dark' ? '#1f2937' : '#e5e7eb',
    muted: effectiveMode === 'dark' ? '#94a3b8' : '#64748b',
    accent,
  }), [effectiveMode, accent]);

  return (
    <main className="container" style={{ display: 'grid', gap: 16, color: colors.text }}>
      <header style={{ position: 'sticky', top: 0, background: colors.bg, paddingTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Painel do Mecânico • Gestão Integrada</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMode(effectiveMode === 'dark' ? 'light' : 'dark')}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.surface,
                color: colors.text,
              }}
            >
              {effectiveMode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </button>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {[
            { key: 'os', label: 'Ordens de Serviço (OS)' },
            { key: 'pneus', label: 'Gestão de Pneus' },
            { key: 'posto', label: 'Posto Interno' },
            { key: 'qualidade', label: 'Qualidade & KPIs' },
          ].map((i) => (
            <button
              key={i.key}
              onClick={() => setTab(i.key as any)}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: tab === i.key ? colors.accent : colors.surface,
                color: tab === i.key ? '#ffffff' : colors.text,
                fontWeight: tab === i.key ? 600 : 500,
              }}
            >
              {i.label}
            </button>
          ))}
        </nav>
      </header>

      {tab === 'os' && (
        <section style={{ border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, background: colors.surface }}>
          <h2 style={{ marginTop: 0 }}>Abertura e Consulta de OS</h2>
          <p style={{ color: colors.muted }}>Procure o veículo e inicie uma OS com fotos e laudos. Sem uso de verde/amarelo; foco em branco/azul.</p>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr auto' }}>
            <input
              placeholder="Buscar por placa, modelo ou matrícula"
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                color: colors.text,
              }}
            />
            <button
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: 'none',
                background: colors.accent,
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              Abrir OS
            </button>
          </div>

          <div style={{ marginTop: 16, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['OS', 'Veículo', 'Serviço', 'Status', 'Abertura'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: 10, borderBottom: `1px solid ${colors.border}`, color: colors.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'OS-1204', v: 'ABC-1234', serv: 'Troca de Pastilhas', st: 'Pendente', ab: '18/10/2025' },
                  { id: 'OS-1205', v: 'DEF-5678', serv: 'Alinhamento', st: 'Em Execução', ab: '18/10/2025' },
                  { id: 'OS-1206', v: 'GHI-9012', serv: 'Troca de Óleo', st: 'Finalizada', ab: '17/10/2025' },
                ].map((row) => (
                  <tr key={row.id}>
                    <td style={{ padding: 10, borderBottom: `1px solid ${colors.border}` }}>{row.id}</td>
                    <td style={{ padding: 10, borderBottom: `1px solid ${colors.border}` }}>{row.v}</td>
                    <td style={{ padding: 10, borderBottom: `1px solid ${colors.border}` }}>{row.serv}</td>
                    <td style={{ padding: 10, borderBottom: `1px solid ${colors.border}` }}>{row.st}</td>
                    <td style={{ padding: 10, borderBottom: `1px solid ${colors.border}` }}>{row.ab}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'pneus' && (
        <section style={{ border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, background: colors.surface }}>
          <h2 style={{ marginTop: 0 }}>Gestão de Pneus</h2>
          <p style={{ color: colors.muted }}>Registro de vida útil, pressão/temperatura e histórico de manutenção.</p>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {['Calibragem', 'Rodízio', 'Substituição'].map((a) => (
              <div key={a} style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 12, background: colors.bg }}>
                <strong>{a}</strong>
                <p style={{ color: colors.muted, margin: '8px 0 0' }}>Registre eventos por veículo e posição.</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'posto' && (
        <section style={{ border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, background: colors.surface }}>
          <h2 style={{ marginTop: 0 }}>Gestão do Posto Interno (Abastecimento)</h2>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr' }}>
            <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 12, background: colors.bg }}>
              <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <input placeholder="Placa" style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text }} />
                <input placeholder="Litros" style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text }} />
                <input placeholder="Preço/L" style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text }} />
                <input placeholder="Hodômetro" style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text }} />
              </div>
              <div style={{ marginTop: 10 }}>
                <button style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: colors.accent, color: '#fff', fontWeight: 600 }}>Registrar Abastecimento</button>
              </div>
            </div>
            <div style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 12, background: colors.bg }}>
              <strong>Estoque & Preços</strong>
              <ul style={{ marginTop: 10, color: colors.muted }}>
                <li>Diesel S10: 3.200 L • R$ 6,19/L</li>
                <li>Arla32: 410 L • R$ 4,29/L</li>
                <li>Lubrificantes: 120 L • R$ 19,90/L</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {tab === 'qualidade' && (
        <section style={{ border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, background: colors.surface }}>
          <h2 style={{ marginTop: 0 }}>Performance, POPs e Normas de Qualidade</h2>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { label: 'Tempo médio de serviço', value: '1h 25m' },
              { label: 'OS finalizadas (sem retrabalho)', value: '92%' },
              { label: 'Cumprimento de POPs', value: '98%' },
            ].map((m) => (
              <div key={m.label} style={{ border: `1px solid ${colors.border}`, borderRadius: 10, padding: 12, background: colors.bg }}>
                <strong>{m.value}</strong>
                <p style={{ color: colors.muted, margin: '6px 0 0' }}>{m.label}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <strong>Biblioteca Técnica e POPs</strong>
            <p style={{ color: colors.muted, marginTop: 6 }}>Documentos de referência e instruções de manutenção padronizadas.</p>
          </div>
        </section>
      )}
    </main>
  );
}
