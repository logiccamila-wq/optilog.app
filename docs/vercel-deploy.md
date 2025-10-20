# Deploy na Vercel

Este projeto é um app Next.js com Firebase/Firestore. Use estas etapas para publicar com sucesso na Vercel.

- Scripts prontos no `package.json`: `dev`, `build`, `start`.
- A Vercel detecta automaticamente o build (`next build`).
- `next.config.js` está configurado para não bloquear o build por erros de ESLint/TypeScript.
- Node 20.x: o projeto define `engines.node = 20.x` no `package.json` para compatibilidade do runtime e evitar EBADENGINE.

## Variáveis de ambiente

Defina em Project Settings → Environment Variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (opcional)
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` (opcional)
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_POSTS_API_URL` (opcional; se usar API externa)
- `NEXT_PUBLIC_BACKEND_URL` (opcional; se consumir backend externo)
- `DATABASE_URL` (se usar Neon/DB nas rotas `app/api/*`)
- `NEON_DATA_API_URL` (opcional)
- `NEON_AUTH_JWKS_URL`, `NEON_AUTH_ISSUER`, `NEON_AUTH_AUDIENCE` (opcionais; para validação JWT)

Sem estas variáveis o app usa dados de demonstração e a home exibirá um aviso.

### Backend externo (opcional)
- Se o frontend consumir um backend externo (ex.: Render), aponte `NEXT_PUBLIC_BACKEND_URL` para a URL pública do backend.
- Garanta que o backend permita CORS via `CORS_ORIGIN` contendo a URL do domínio do Vercel.

## Firestore

- Coleção: `posts`
- Campos: `slug` (string), `title` (string), `content` (string), `is_published` (boolean)
- Paginação atual ordena por `slug`. Para ordenar por data, adicione `created_at` e ajuste a consulta em `utils/posts.ts`.

## Erros comuns

- “Nenhum post encontrado”: verifique a coleção `posts` e os campos.
- “Usando dados de demonstração”: confirme `NEXT_PUBLIC_FIREBASE_*` na Vercel e Firestore habilitado.
- API externa sem paginação: se sua API não suporta `?limit=&after=`, o utilitário cai para Firestore ou demo.

## Observações de monorepo

O repositório possui pastas auxiliares (`functions/`, `frontend/`, `streamlit-app/`). A Vercel deve construir apenas o app Next.js na raiz. Não é necessário configurar monorepo.
