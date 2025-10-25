# Estrutura Unificada do Projeto

Este documento descreve a organização de pastas e os kits básicos para acelerar desenvolvimento de backend, frontend e integrações de logística.

## Raiz do projeto

- `app/` – Aplicação Next.js 14 (páginas, layout e módulos do dashboard)
- `backend/` – API mínima Node.js (endpoints de frota, pneus, entregas)
- `components/` – Biblioteca de componentes UI (tabelas, cards, mapas, gráficos)
- `docs/` – Documentação (arquitetura, roadmaps, setup)
- `kits/` – Kits prontos (templates reutilizáveis de backend e frontend)
- `templates/` – Templates simples de rotas e módulos
- `scripts/` – Scripts utilitários (build, scaffold)
- `utils/` – Helpers (API, posts, sanitização)

## Módulos do Dashboard (Next.js)

- `app/dashboard/[module]/page.tsx` – Página dinâmica com módulos:
  - `visao-geral`, `logistica`, `estoque`, `frota`, `pneus`, `financeiro`, `crm`, `analise`
- Integrações: `components/map/LiveMap.tsx` (Mapbox), `components/charts/*` (gráficos), `components/ui/*` (UI)

## Backend (API)

- `backend/server.js` – API mínima com `/ping`, `/tires`, `/vehicles`, `/shipments`
- `backend/data/*.json` – Dados de exemplo (frota, pneus, entregas)

## Ambiente

- `.env.local` – Variáveis locais (ex.: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_MAPBOX_TOKEN`)
- `.env.example` – Modelo base para replicar

## Kits

- `kits/backend/express-basic` – Express básico
- `kits/backend/ors-route-proxy` – Proxy de rotas via Openrouteservice
- `kits/backend/ws-basic` – WebSocket/Socket.IO para tracking
- `kits/frontend/next-module` – Módulo padrão Next.js (tabela + ações)
- `kits/frontend/map-livemap` – Integração de mapa LiveMap (Mapbox)

## Convenções

- Nome de módulos em português com `kebab-case` (ex.: `gestao-frota` em rotas; UI usa chaves definidas no array `modules`)
- Código client em páginas com `'use client'` e dados carregados via `apiFetch`
- Endpoints simples e consistentes no backend (`/tires`, `/vehicles`, `/shipments`) com JSON

## Como usar kits

1. Escolha um kit em `kits/*`.
2. Use o script de scaffold: `npm run scaffold -- --kit <path> --dest <path>`.
3. Ajuste variáveis no `.env.local` e reinicie o dev server.
