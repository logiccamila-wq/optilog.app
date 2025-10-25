# Base Padrão — Next.js + Neon + Vercel

Este documento define a base mínima e escalável para qualquer módulo/sistema: Next.js (frontend + rotas API), Neon Postgres (DB), deploy em Vercel. Evita retrabalho e garante padronização.

## Stack

- Next.js 14 + TypeScript
- UI: TailwindCSS + shadcn/ui (opcional, já temos tema próprio em `app/providers/ThemeProvider`)
- Banco: Neon Postgres via `@neondatabase/serverless` (`lib/db.ts`)
- Auth/JWT: via `lib/jwt.ts` com JWKS remoto
- Deploy: Vercel (Render/AWS possível, mas escolher apenas um)

## Estrutura

- `app/` com rotas, layout e providers (Theme, I18n, Toast)
- `app/api/` para endpoints (ex: `posts`, `health`)
- `lib/` para serviços (db, jwt, utils)
- `docs/` para referência rápida
- `scripts/` para start, seed, scaffold

## Variáveis de Ambiente

Use `.env.local` (dev) e Vercel Project Env (prod):

- `DATABASE_URL` — Neon pooled connection
- `NEON_DATA_API_URL` — opcional (Data API)
- `NEON_AUTH_JWKS_URL`, `NEON_AUTH_ISSUER`, `NEON_AUTH_AUDIENCE` — JWT verificação
- Outras já exemplificadas em `.env.local.example`

## Health Check

- `GET /api/health` — testa `select 1` no Neon e reporta envs críticas
- `GET /status` — checa serviços Firebase (existe no projeto)

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run start` — start com `scripts/start.js`
- `npm run db:seed` — seed inicial (se aplicável)

## Passo a Passo — Provisionamento Rápido

1. Escolha o deploy: Vercel (recomendado pela integração com Next/Neon)
2. Crie o banco Neon, copie `DATABASE_URL`
3. Configure envs no Vercel Project
4. Conecte repo (GitHub/GitLab) e habilite deploy automático
5. Valide `GET /api/health` no preview
6. Defina fase 1 (MVP) e backlog: sem mudanças de stack/hosting

## Convenções

- Não alterar stack após fase definida
- Rotas API em `app/api/*` com `getSql()`
- Tokens de tema via `useTheme()` para páginas novas
- Documentar módulos novos em `docs/` antes de criar

## Próximas Ações (exemplos)

- Modelos Financeiro em `lib/models/*` (AP/AR, conciliação, DRE)
- CI (lint, build) simples no Vercel
- Observabilidade: logs de API via console, Vercel Logs

Este kit base suporta expansão sem refazer estrutura. Foque em fases curtas e releases frequentes.
