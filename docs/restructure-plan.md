# Plano de Reestruturação para Monorepo `optilog`

Objetivo: consolidar em uma estrutura clara e enxuta, com apps separados (web e api) e compartilhamento de modelos/utilitários.

## Estrutura Alvo
```
optilog/
├── apps/
│   ├── web/                  # Next.js (App Router)
│   │   ├── app/
│   │   ├── components/
│   │   ├── pages/ (se necessário)
│   │   ├── styles/
│   │   ├── lib/
│   │   └── package.json
│   └── api/                  # Backend serverless (Express modular ou Nest adaptado)
│       ├── src/
│       │   ├── modules/
│       │   │   ├── frota/
│       │   │   ├── motoristas/
│       │   │   ├── clientes/
│       │   │   ├── quimicos/
│       │   │   ├── financeiro/
│       │   │   └── chatbot/
│       │   ├── database/
│       │   │   ├── prisma.schema
│       │   │   └── client.ts
│       │   ├── middleware/
│       │   ├── utils/
│       │   ├── app.ts
│       │   └── serverless.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/               # Modelos TS e utils compartilhados
│   │   ├── src/lib/models/
│   │   └── package.json
│   └── ui/                   # Componentes UI (opcional)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/
├── .env
├── vercel.json
├── turbo.json (opcional)
└── README.md
```

## Mapeamento do estado atual
- `optilog-app/` contém Next.js + rotas API; será base para `apps/web` (mantendo `app/`, `providers/`, `lib/`, `app/api/*`).
- `backend/` contém código Node e SQLite/Prisma legados; será base para `apps/api` modular.
- `lib/models/finance.ts` e similares irão para `packages/shared` para uso comum.
- `backend/postgres/schema.sql` e `schema_additions.sql` permanecem sob `docs`/`backend` ou dentro de `apps/api` (conforme padrão de infra escolhido).

## Passos de migração (incremental)
1. Criar diretórios `optilog/apps/web` e `optilog/apps/api`.
2. Mover `optilog-app/app`, `optilog-app/lib`, `optilog-app/providers`, `optilog-app/components` para `apps/web` (ajustar imports `@/*`).
3. Mover módulos úteis de `backend/` para `apps/api/src` (Express modular), mantendo `database/`, `middleware/`, `routes` por domínio.
4. Criar `packages/shared` e mover modelos tipados (ex.: `lib/models/*`) para `packages/shared/src/lib/models` com `tsconfig` e `package.json`.
5. Configurar workspaces (`npm`, `pnpm` ou `yarn`) para resolver dependências entre `apps/*` e `packages/*`.
6. Atualizar `vercel.json` para apontar funções serverless de `apps/api` e app Next de `apps/web`.
7. Ajustar CI/CD (GitHub Actions) e scripts (`npm run dev`, `build`, `start`) para monorepo.

## Boas práticas para o monorepo
- Workspaces para não duplicar `node_modules` e reduzir tamanho.
- Shared models/utilities com versionamento semântico interno.
- Feature flags para integrações externas (Open Banking, NF-e).
- Observabilidade: `/api/health` e logs mínimos.

## Observações importantes
- Não mover SDKs e caches para dentro do monorepo; mantenha-os fora.
- Evitar binários pesados dentro do repo (veja `docs/cleanup.md` e `.gitignore`).
- Migrar por etapas com PRs pequenos e testes.