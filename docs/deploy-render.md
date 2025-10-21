# Checklist de Deploy (Render + Neon)

Este documento orienta como publicar o `optilog-frontend` (Next.js) e o `optilog-backend` no Render usando o `render.yaml` do repositório `logiccamila-wq/optilog.app`.

## Pré-requisitos
- Acesso ao Render com os serviços:
  - Web Service: `optilog-frontend` (Service ID `srv-d3pke9ripnbc73a01m4g`)
  - Web Service: `optilog-backend`
- Variável de ambiente `DATABASE_URL` (Neon) no formato `postgres://...`.
- Branch `main` conectado ao Render.

## Variáveis de Ambiente (Render)
Configure no Render (Settings → Environment):
- Frontend (`optilog-frontend`)
  - `NODE_VERSION=20.19.5`
  - `NEXT_TELEMETRY_DISABLED=1`
  - `NEXT_PUBLIC_DISABLE_FIREBASE=1`
  - `DATABASE_URL` → valor da conexão Neon
  - Opcional: `NEXT_PUBLIC_BACKEND_URL` → URL pública do backend
  - Opcional: `NEXT_PUBLIC_POSTS_API_URL`
  - Opcional: `OPENAI_API_KEY` — para a rota `/api/ai` no Next.js
- Backend (`optilog-backend`)
  - `NODE_VERSION=20.19.5`
  - `DATABASE_URL` → valor da conexão Neon
  - `JWT_SECRET` → um segredo forte
  - `CORS_ORIGIN` → origem permitida (ex.: `https://optilog-app.onrender.com`)

Observações:
- `render.yaml` já define os serviços e `healthCheckPath` (`/api/health` no frontend e `/health` no backend).
- `output: 'standalone'` está habilitado no `next.config.js` para builds compatíveis com App Hosting.

## Fluxo de Deploy
1. Confirmar que o `main` foi atualizado (GitHub → `logiccamila-wq/optilog.app`).
2. No Render, abrir o serviço `optilog-frontend`.
3. Em `Environment`, conferir/definir `DATABASE_URL`.
4. Em `Manual Deploy`, clicar `Deploy latest commit`.
5. Acompanhar os logs do build e start.
6. Repetir para `optilog-backend` caso necessário.

## Validações Pós-Deploy
- Frontend (Next.js)
  - `GET https://optilog-app.onrender.com/api/health` deve retornar `{ ok: true }`.
  - Acessar `/cadastro/motoristas` e `/cadastro/veiculos`; enviar formulários e validar inserts no Neon.
  - `GET https://optilog-app.onrender.com/api/functions-status` deve retornar `{"status":"stubbed"}` (stub provisório).
- Banco (Neon)
  - Verificar tabelas `drivers` e `vehicles` e registros inseridos.

## Problemas comuns
- Free Instance do Render: pode hibernar e atrasar a primeira resposta (~50s).
- Porta ocupada local (`EADDRINUSE`): usar `3001` ao testar local.
- Husky bloqueando commit por lint: usar `git commit --no-verify` quando necessário.

## Rollback
- Use `Manual Deploy` para redeploy do commit anterior ou ajuste env vars e redeploy.

## Referências
- `render.yaml`: serviços `optilog-frontend` e `optilog-backend`
- `lib/db.ts`: conexão Neon (`getSql()`)
- APIs: `/api/drivers`, `/api/vehicles`, `/api/functions-status`, `/api/health`