'use client';
import AccessControl from '@/components/AccessControl';
import { Role } from '@/lib/rbac';

export default function ManutencoesPage() {
  return (
    <AccessControl roles={['admin', 'mechanic'] as Role[]}>
      <main style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
        <h1 style={{ marginTop: 0 }}>Manutenções</h1>
        <p style={{ color: '#aaa' }}>Gerencie ordens de serviço e agendamentos.</p>

        <div style={{ border: '1px solid #333', borderRadius: 10, padding: 16, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Nova OS</h3>
          <form
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            <input placeholder="Veículo" />
            <input placeholder="Serviço" />
            <input placeholder="Responsável" />
            <input placeholder="Data" type="date" />
            <button
              type="button"
              style={{
                border: '1px solid #1e3a8a',
                color: '#9ecfff',
                background: 'transparent',
                borderRadius: 8,
                padding: '6px 10px',
              }}
            >
              Salvar (mock)
            </button>
          </form>
        </div>

        <div style={{ border: '1px solid #333', borderRadius: 10, padding: 16, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Pendências (mock)</h3>
          <ul>
            <li>ABC-1234 — Troca de óleo — Mec. João — 2025-10-12</li>
            <li>XYZ-9876 — Freios — Mec. Ana — 2025-10-15</li>
          </ul>
        </div>
      </main>
    </AccessControl>
  );
}
