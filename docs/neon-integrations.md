# Neon Integrations – Optilog App

Este guia conecta seu projeto às principais integrações do Neon para melhorar DX, preview por PR e observabilidade, com custo baixo no ambiente de desenvolvimento.

## GitHub – Branch por PR

- Objetivo: Criar um branch de banco para cada Pull Request e aplicar o schema automaticamente.
- Como habilitar:
  1. No Neon Console → Integrations → GitHub → Connect.
  2. Selecione o repositório deste projeto (optilog-app).
  3. Ative "branch database per PR".
- Workflow já incluso: `.github/workflows/neon_workflow.yml`.
  - Usa `neondatabase/create-branch-action@v6` para criar o branch `preview/pr-<number>-<branch>`.
  - Aplica `backend/postgres/schema.sql` com `psql` no branch efêmero.
- Secrets/Vars necessários no GitHub Repo:
  - `vars.NEON_PROJECT_ID` → ID do projeto no Neon (Settings → Project → ID).
  - `secrets.NEON_API_KEY` → API Key do Neon (Settings → API keys).

## Vercel – Preview por Deploy

- Objetivo: Criar branch de DB para cada preview deployment da Vercel.
- Como habilitar:
  1. Neon Console → Integrations → Vercel → Connect.
  2. Selecione o projeto Vercel do Optilog.
  3. Ative "Create a database branch for every preview deployment".
- Env mapeados na Vercel:
  - `DATABASE_URL` (pooled) para runtime do app.
  - `DATABASE_URL_UNPOOLED` para migrações (opcional, DDL direto).

## Prisma (opcional)

- Benefício: Schema declarativo, migrações versionadas e tipagem forte.
- Instalação rápida:
  - `npm i prisma @prisma/client`
  - `npx prisma init` → ajusta `DATABASE_URL` e modela `posts`.
  - `npx prisma migrate dev`

## Observabilidade

- Datadog: Neon → Integrations → Datadog → configure `DD_API_KEY`. Visualize conexões/latência sem aumentar recursos locais.
- OpenTelemetry (beta): requer plano. Envia métricas para qualquer backend compatível.

## Ambiente Local

- `.env.local` (exemplo no `.env.local.example`):
  - `DATABASE_URL` (pooled) e `DATABASE_URL_UNPOOLED` (direto) — para DDL/migrações.
  - `npm run db:seed` cria `posts` e insere dados.
- Endpoints:
  - `GET /api/posts` → lista publicados.
  - `GET /api/posts/[slug]` → detalhe.

## Dicas

- Use pooled para runtime (`@neondatabase/serverless`); direto para DDL/psql.
- PRs ficam isolados com branches efêmeros; ao fechar PR, o branch é removido.
- Configure envs por ambiente (local, preview, production) e mantenha `schema.sql` atualizado.