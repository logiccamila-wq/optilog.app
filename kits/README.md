# Kits Básicos

Este diretório reúne kits prontos para acelerar a criação de novas funcionalidades no backend e no frontend.

## Como usar (scaffold)
- Após criar o script `scripts/scaffold.js`, use:
  - `npm run scaffold -- --kit kits/backend/express-basic --dest backend/`
  - `npm run scaffold -- --kit kits/frontend/next-module --dest app/dashboard/nova-feature`
- Alternativamente, copie e ajuste manualmente os arquivos do kit para o destino.

## Catálogo
- Backend
  - `backend/express-basic` – API Express com endpoints `/ping`, `/tires`, `/vehicles`, `/shipments`
  - `backend/ors-route-proxy` – Proxy para Openrouteservice (rotas otimizadas)
  - `backend/ws-basic` – WebSocket/Socket.IO para tracking em tempo real
- Frontend
  - `frontend/next-module` – Página padrão Next.js (tabela CRUD + helpers)
  - `frontend/map-livemap` – Componente de mapa com Mapbox integrado

## Requisitos
- Backend kits podem necessitar: `express`, `cors`, `socket.io`, `node-fetch`.
- Frontend kits utilizam Next.js 14, React 18, MUI 5 e opcionalmente Mapbox GL JS.
- Defina `NEXT_PUBLIC_BACKEND_URL` e, para mapas, `NEXT_PUBLIC_MAPBOX_TOKEN` no `.env.local`.

## Dicas
- Use nomes de pastas descritivos e consistentes: `gestao-frota`, `logistica`, `pneus`.
- Evite sobrescrever arquivos sem backup. O scaffold suporta `--force` para substituição.