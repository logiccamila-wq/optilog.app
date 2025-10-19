# Cultura de Engenharia

Nossa cultura organiza o desenvolvimento com uma base única, previsível e escalável.

## Princípios
- Stack única: `Next.js 14 + TypeScript` (frontend/API) e `Neon Postgres` (DB).
- Deploy preferencial: `Vercel` (preview e produção) com envs seguras.
- Modularidade orientada a domínio (Financeiro, Contabilidade, Fiscal, Risco, BI, Jurídico).
- Código tipado: modelos em `lib/models`, utilitários em `lib/*`, rotas em `app/api/*`.
- Observabilidade: `/api/health` cobre DB e variáveis críticas.
- Documentação viva em `docs/*` com guias operacionais e arquitetura.
- Convenções: nomes em português claro para páginas (`/dashboard/financeiro/*`) e tabelas snake_case.
- Segurança: JWT com JWKS, princípio de mínimo privilégio, RLS onde aplicável.

## Fluxo de Trabalho
- Planejamento em módulos com épicos/tarefas e checklists de entrega.
- Dev local com `npm run dev` e `.env.local` contendo `DATABASE_URL`.
- Dados: schema principal em `backend/postgres/schema.sql` e extensões em `schema_additions.sql`.
- Migração: aplicar `schema.sql` + `schema_additions.sql` na Neon; seeds via `scripts/seed.mjs`.
- Revisão: PRs curtos, alinhados à arquitetura, testes básicos dos endpoints e páginas.
- Release: branches por feature, preview em Vercel, produção após validação funcional.

## Estrutura de Pastas (essencial)
- `app/` páginas e rotas (`/dashboard/financeiro`, `/api/*`).
- `lib/` conexão DB (`lib/db.ts`), modelos (`lib/models/*`), JWT (`lib/jwt.ts`).
- `backend/postgres/` schema SQL e migrações auxiliares.
- `scripts/` tarefas utilitárias (`seed.mjs`, migrações).
- `docs/` base stack, cultura, estrutura e roadmap de módulos.
- `kits/` padrões e guias para frontend/backend.

## Qualidade e Padrões
- UI usa `ThemeProvider` com tokens; componentes simples e acessíveis.
- Internacionalização com `I18nProvider`; chaves por módulo.
- API segue REST simples com verbos consistentes, usando `getSql()` para Neon.
- Nomes previsíveis de rotas: `/api/finance/*`, `/dashboard/financeiro/*`.
- Performance: consultas indexadas, paginação na API, lazy data no frontend.

## Segurança e Compliance
- Autenticação via Bearer JWT, verificação em `lib/jwt.ts`.
- Configurações `.env.local.example` como referência; segredos só em runtime.
- Logs mínimos em produção, sem dados sensíveis.
- RLS aplicada em tabelas expostas a usuários finais; auditoria em lançamentos contábeis.

## Colaboração
- Decisões arquiteturais registradas em `docs/*`.
- Tarefas complexas acompanhadas por lista de TODOs e estados.
- Comunicação objetiva, foco em entregáveis e validação por preview.