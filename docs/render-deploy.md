# Deploy no Render

Este projeto inclui um manifesto `render.yaml` para provisionar dois serviços:

- Frontend Next.js (`optilog-frontend`)
- Backend Express (`optilog-backend`)

O Render cria/atualiza serviços automaticamente conforme pushs no branch configurado (por padrão, `main`).

## Node.js

- O `render.yaml` fixa `NODE_VERSION` em `20.19.5`. Você pode usar qualquer Node 20.x suportado pelo Render.
- No projeto, `package.json` define `"engines.node": "20.x"` para compatibilidade com Vercel/Render.

## Variáveis de ambiente (Frontend)
Defina no serviço `optilog-frontend`:

- `NEXT_PUBLIC_DISABLE_FIREBASE` — "1" para desativar Firebase (demo/local)
- `NEXT_PUBLIC_POSTS_API_URL` — opcional; se usar uma API externa para posts
- `NEXT_PUBLIC_BACKEND_URL` — URL pública do backend no Render (ex.: `https://optilog-backend.onrender.com`)
- `DATABASE_URL` — se páginas API do Next acessarem Neon/DB diretamente
- `DATABASE_URL_UNPOOLED` — opcional, quando usar Data API unpooled
- `NEON_AUTH_JWKS_URL` — se validação JWT for habilitada
- `NEON_AUTH_ISSUER` — emissor do JWT
- `NEON_AUTH_AUDIENCE` — audience do JWT
- `ADMIN_EMAILS` — lista separada por vírgulas para liberar acesso administrativo

Observação: variáveis `NEXT_PUBLIC_*` são expostas no cliente.

## Variáveis de ambiente (Backend)
Defina no serviço `optilog-backend`:

- `DATABASE_URL` — conexão para Postgres (Neon)
- `JWT_SECRET` — segredo para assinar/verificar JWTs
- `OPENAI_API_KEY` — chave da OpenAI (se recursos de IA forem usados)
- `CORS_ORIGIN` — origens permitidas, separadas por vírgula. Exemplos:
  - `http://localhost:3000`
  - `https://optilog-frontend.onrender.com`
  - `http://localhost:3000,https://seu-dominio.com`

O backend já implementa CORS dinâmico lendo `CORS_ORIGIN`. Se não definido, o CORS será permissivo (apenas em desenvolvimento). Configure sempre em produção.

## Health checks

- Frontend: `GET /status`
- Backend: `GET /health`

## Build & Start

- Frontend
  - Build: `npm ci && npm run build`
  - Start: `node .next/standalone/server.js`
- Backend
  - Build: `npm ci`
  - Start: `node app.js`

## Dicas

- Sincronize valores sensíveis via Dashboard do Render (marcadas como `sync: false` no `render.yaml`).
- Para múltiplos ambientes (staging/prod), duplique os serviços com branches distintos.
- Se o frontend consome o backend, mantenha `CORS_ORIGIN` e `NEXT_PUBLIC_BACKEND_URL` consistentes.