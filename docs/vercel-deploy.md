# Deploy na Vercel

Este projeto é um app Next.js com Firebase/Firestore. Use estas etapas para publicar com sucesso na Vercel.

- Scripts prontos no `package.json`: `dev`, `build`, `start`.
- A Vercel detecta automaticamente o build (`next build`).
- `next.config.js` está configurado para não bloquear o build por erros de ESLint/TypeScript.

## Variáveis de ambiente

Defina em Project Settings → Environment Variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (opcional)
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` (opcional)
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_POSTS_API_URL` (opcional; se usar API externa)

Sem estas variáveis o app usa dados de demonstração e a home exibirá um aviso.

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