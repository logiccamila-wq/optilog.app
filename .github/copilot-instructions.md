## Guia rápido para agentes de codificação (optilog.app)

Objetivo: instruções práticas e exemplos para ser produtivo neste repositório Next.js + backend Node/Express.

### Estrutura principal
- Frontend Next.js (App Router) em `/app` com configurações em `next.config.js`.
- Backend Node/Express em `/backend` (entrypoints: `backend/server.js`, `backend/app.js`).
- Kits e templates em `kits/` usados por `scripts/scaffold.js`.

### Scripts chave (`package.json` raiz)
- `npm run dev` — roda Next em dev.
- `npm run api` — inicia o backend (`node backend/server.js`).
- `npm run dev:api` — dev frontend + backend (usa `concurrently`).
- `npm run build` — build Next (usa `node -r ./scripts/polyfill-self.js` antes do binário do Next).
- `npm run start:prod` — inicia o bundle standalone: `node .next/standalone/server.js`.
- `npm run test:e2e` — executa Playwright.

### Backend (`/backend`)
- Scripts: `start` (node app.js), `db:setup` e `db:setup-full` (scripts de DB em `backend/scripts`).
- Use `npm run api` da raiz para ligar o backend quando for trabalhar no monorepo.

### Deploy (Vercel + Neon)
- Alvo recomendado: Vercel (Next.js) + Neon (Postgres). `vercel.json` já define `framework: nextjs` e `buildCommand: npm run build`.
- Variáveis obrigatórias no projeto Vercel:
	- `DATABASE_URL` — string do Neon (use `sslmode=require`).
	- `JWT_SECRET` — segredo para JWT nas rotas do backend.
	- `NEXT_PUBLIC_API_URL` — base das rotas API se necessário (pode ser a própria URL do app).
	- (Opcional) `DATABASE_URL_UNPOOLED` — conexão direta do Neon para migrações/DDL.
	- (Opcional) `NEON_DATA_API_URL`, `NEON_AUTH_JWKS_URL`, `NEON_AUTH_ISSUER`, `NEON_AUTH_AUDIENCE` — apenas se usar a Data API com JWT.
- Integração Vercel ↔ Neon:
	- Use “Add Integration → Postgres (Neon)” no Vercel. Isso popula `DATABASE_URL` (pooler) e `DATABASE_URL_UNPOOLED` automaticamente.
	- Código que consome: `backend/db.ts` usa `@neondatabase/serverless` lendo `process.env.DATABASE_URL`.
- Deploy no Vercel:
	- Push na `main` dispara build. Build local: `npm run build`. Start local prod: `npm run start:prod`.
	- Verifique status no dashboard da Vercel e logs de build se necessário.

### Padrões e armadilhas frequentes
- O `next.config.js` define `output: 'standalone'`. Production start espera `.next/standalone/server.js` (use `start:prod`).
- `eslint` e `typescript` estão configurados para ignorar erros em build (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`). Tenha cautela ao alterar tipos/ESLint: builds podem compilar mesmo com erros.
- Webpack stubs/fallbacks (fs/net/tls/crypto = false) para evitar bundling de módulos Node no cliente — respeite boundaries server/client.
- O build roda um polyfill (`scripts/polyfill-self.js`) — não remova sem entender por que foi adicionado.

### Integrações importantes
- OpenAI (pacote `openai`) é usado tanto no frontend quanto no backend: procure `openai.js`/`openai.ts` em `backend/` e na raiz.
- Banco (Neon/Postgres):
	- Driver serverless: `@neondatabase/serverless` (ver `backend/db.ts` e `backend/test-neon.mjs`).
	- Envs: `DATABASE_URL` (pooler) e opcional `DATABASE_URL_UNPOOLED` (direto). Docs: `SETUP_DATABASE.md`, `docs/vercel-postgres.md`.
- Sockets: `socket.io` no backend e `socket.io-client` no frontend — ver `ws-server.js` em `/backend`.

### Como validar alterações pequenas (workflow rápido)
1. Instalar dependências: `npm install` (raiz).
2. Rodar em dev: `npm run dev` (frontend) e `npm run api` (backend) ou `npm run dev:api`.
3. Para checar produção local: `npm run build` então `npm run start:prod` (start usa `.next/standalone/server.js`).

### Onde buscar exemplos e padrões
- Entrypoints: `app/` (Next App Router), `backend/server.js`, `backend/app.js`.
- Banco/Neon: `backend/db.ts`, `backend/test-neon.mjs`, `backend/scripts/db_setup*.mjs`.
- Scaffolders: `scripts/scaffold.js` e `kits/` (ex.: `kits/frontend/next-module`).
- Deploy/Hosting: `vercel.json`, `docs/vercel-deploy.md`, `docs/vercel-postgres.md` e `SETUP_DATABASE.md`.

### Regras específicas para agentes
- Faça mudanças pequenas e testáveis primeiro (ex.: ajustar script, adicionar export, corrigir import).
- Ao tocar build/deploy, sempre execute `npm run build` localmente e verifique `npm run start:prod` antes de abrir PR.
- Não alterar `next.config.js` sem rodar build completo — ele controla stubs que evitam bundling de APIs Node no cliente.
- Para alterações que tocam auth/keys (Clerk, JWT, Neon, OpenAI), documente quais ENV vars são necessárias; não exponha segredos em código.

Se algo estiver confuso ou se você quiser que eu execute o build/local deploy agora, diga qual alvo: `vercel`, `firebase` ou `local` — eu posso tentar o build local e anotar/fixar erros simples primeiro.

---
Arquivo gerado a partir da análise de `package.json`, `next.config.js`, `vercel.json` e `README.md`.
