export default function RoadmapPage() {
  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Cronograma de Desenvolvimento</h1>
      <p style={{ color: '#9aa3b0' }}>
        Planejamento por fases (1–8 semanas) cobrindo WMS, TMS, OMS, SCM, CRM e ERP.
      </p>

      <h2>Fase 0 — Preparação</h2>
      <ul style={{ paddingLeft: 18 }}>
        <li>Fixar Node 20.19.5 (engines, .nvmrc)</li>
        <li>Configurar render.yaml (build/start) e .env.local (JWT/Neon)</li>
      </ul>

      <h2>Fase 1 — Fundamentos</h2>
      <ul style={{ paddingLeft: 18 }}>
        <li>Rotas base: /vehicles, /tires, /shipments, /users</li>
        <li>Layout /modules com sidebar e páginas por módulo</li>
        <li>Proteção JWT + RBAC simples</li>
      </ul>

      <h2>Fase 2 — KPIs e Automação</h2>
      <ul style={{ paddingLeft: 18 }}>
        <li>WMS/TMS/OMS com tabelas, filtros e KPIs</li>
        <li>Alertas (cron) e webhooks para eventos críticos</li>
      </ul>

      <h2>Fase 3 — Expansão</h2>
      <ul style={{ paddingLeft: 18 }}>
        <li>SCM, CRM, ERP com dashboards e relatórios</li>
        <li>UI Kit padronizado (tabelas/cards/gráficos/mapa)</li>
      </ul>

      <h2>Fase 4 — Resiliência</h2>
      <ul style={{ paddingLeft: 18 }}>
        <li>Observabilidade (logs, métricas, tracing)</li>
        <li>Hardening (RBAC avançado, validações, rate limits)</li>
        <li>Multi-agente para otimização de cargas</li>
      </ul>

      <p style={{ color: '#9aa3b0' }}>
        Detalhes completos em <code>docs/roadmaps.md</code>.
      </p>
    </section>
  )
}