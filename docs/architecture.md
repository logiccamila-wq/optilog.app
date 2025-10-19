Arquitetura Unificada

- Frontend: Next.js 14, React 18, MUI 5; i18n via `I18nProvider`; módulos dinâmicos em `app/dashboard/[module]/page.tsx`.
- Backend: Node/Express em `backend/`; APIs consumidas com `utils/api.ts`.
- Dados: Firestore/SQL; estados e métricas carregadas no `useEffect` por módulo.
- IoT: sensores de pneus (pressão/temperatura) integráveis via endpoints `/tires` e coleções `pneus`.

Módulo Pneus
- Navegação: presente na landing do dashboard e na Sidebar.
- Dados: usa coleções `pneus` no Firestore ou `GET /tires`.
- UI: tabela de pneus com vida baixa e indicadores de manutenção.

Padronização
- i18n: chaves `modules.*` e `tires.*` criadas em `I18nProvider`.
- Tabelas: usar componentes MUI e labels i18n.
- Estrutura de pastas:
  - `kits/` (frontend e backend)
  - `templates/` (dashboard e API)
  - `docs/` (arquitetura, roadmaps)

Integrações de Supply Chain
- Otimização de redes e custos com SunFlow (Python) — referência (GitHub - SunFlow: https://github.com/aitechtools/SunFlow ).
- Coordenação multi-agente responsiva — referência (GitHub - Responsive AI Clusters: https://github.com/Appointat/Responsive-AI-Clusters-in-Supply-Chain ).
- Abordagem: rodar serviços auxiliares (Python/Go) separados e expor endpoints para consumo pelo backend Express; persistir resultados em coleções específicas e exibir dashboards.