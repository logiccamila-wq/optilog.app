# Deploy na Vercel (Next.js + Neon/Postgres)

Este projeto é um app Next.js com rotas API que usam Postgres (Neon). O suporte direto a Firebase/Firestore foi removido/está desativado por padrão (veja `lib/firebaseClient.ts` e a página `app/status`).

- Scripts prontos no `package.json`: `dev`, `build`, `start`.
- A Vercel detecta automaticamente o build (`next build`).
- `next.config.js` permite build sem travar por ESLint/TypeScript.
- Node 20.x: o projeto define `engines.node = 20.x` no `package.json`.

## Variáveis de ambiente

Defina em Project Settings → Environment Variables:

- `NEXT_PUBLIC_DISABLE_FIREBASE` — "1" para manter SDK Firebase desativado (padrão).
- `DATABASE_URL` — conexão Neon usada pelas rotas `app/api/*` (driver serverless `@neondatabase/serverless`).
- `DATABASE_URL_UNPOOLED` — opcional; conexão direta para DDL/migrações.
- `NEON_DATA_API_URL` — opcional; base da Data API quando usar JWT nas rotas `api/data/*`.
- `NEON_AUTH_JWKS_URL`, `NEON_AUTH_ISSUER`, `NEON_AUTH_AUDIENCE` — opcionais; validação JWT nas rotas Data API.
- `NEXT_PUBLIC_POSTS_API_URL` — opcional; se consumir uma API externa para posts (base sem `/posts` no final; o app requisita `${BASE}/posts`).
- `NEXT_PUBLIC_BACKEND_URL` — opcional; se o frontend consumir um backend externo (Express/Render). Garanta CORS no backend.
- `ADMIN_EMAILS` — opcional; lista de e-mails admin liberados na aplicação.

Observação: variáveis `NEXT_PUBLIC_*` são expostas no cliente.

## Rotas e dados

- `GET /api/health` — saúde do app (responde `{"health":"ok"}`).
- `GET /api/posts` — lista posts publicados via Neon (driver serverless). Sem JWT.
- `GET /api/data/posts` e `GET /api/data/posts/[slug]` — integração com Neon Data API. Com JWT (RLS/claims), sem JWT cai para driver serverless com filtros de segurança.
- Se `NEXT_PUBLIC_POSTS_API_URL` estiver definido, utilitário `utils/posts.ts` tenta primeiro `${BASE}/posts`; se falhar, cai para dados de demonstração.

## Backend externo (opcional)

- Defina `NEXT_PUBLIC_BACKEND_URL` com a URL pública do backend (ex.: Render).
- No backend, configure `CORS_ORIGIN` para incluir o domínio da Vercel.

## Erros comuns

- "Usando dados de demonstração": sem `NEXT_PUBLIC_POSTS_API_URL` ou sem dados em `posts`. Solução: definir a variável para sua API externa ou popular a tabela `posts` no Neon.
- "Token inválido" nas rotas `api/data/*`: revise `NEON_AUTH_*` e o JWT enviado no header `Authorization: Bearer <token>`.
- "Nenhum post encontrado": verifique se a tabela `posts` está populada com `slug`, `title`, `content`, `is_published`, `created_at`.

## Verificação rápida

- Após o deploy, abra `https://<seu-site>.vercel.app/api/health`.
- Se tiver dados em Neon, teste `https://<seu-site>.vercel.app/api/posts`.
- Se usa Data API + JWT, teste:
  ```bash
  curl -H "Authorization: Bearer <JWT>" https://<seu-site>.vercel.app/api/data/posts
  ```

## Observações de estrutura

O repositório contém pastas auxiliares (`functions/`, `frontend/`, `streamlit-app/`), mas a Vercel deve construir apenas o app Next.js em `optilog-app`. Não é necessário configurar monorepo.
