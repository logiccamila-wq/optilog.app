# Cronograma de Desenvolvimento (PT-BR)

Este cronograma organiza o que está sendo construído por módulos (WMS, TMS, OMS, SCM, CRM, ERP), com marcos, entregáveis, critérios de aceite e dependências.

## Visão Geral
- Semanas: 1–8 (4 fases / 8 sprints semanais)
- Padrões: Next.js 14 + API Node, i18n, UI Neon/Tech, JWT + RBAC
- Infra: Render/Firebase Hosting, Neon (Postgres Data API)

## Fase 0 — Preparação (Semana 0)
- Fixar versão Node `20.19.5` (engines, .nvmrc) e `.npmrc` (engine-strict=false)
- Ajustar `render.yaml` (build: `npm ci && npm run build`, start: `npm run start`)
- `.env.local`: JWT + Neon (`DATABASE_URL`, `NEON_*`) e flags de frontend
- Critério de aceite: dev server sobe; `/admin` e `/modules` acessíveis

## Fase 1 — Fundamentos (Semanas 1–2)
- Backend base: rotas `/vehicles`, `/tires`, `/shipments`, `/users` (lista e CRUD básico)
- Frontend base: `/modules` com sidebar (WMS, TMS, OMS, SCM, CRM, ERP)
- Segurança: proteção JWT nas rotas admin/listagem; RBAC simples (admin/emails)
- Dados: criação sob demanda de tabelas mínimas (users, vehicles, tires)
- Aceite: listar usuários no `/admin` com ordenação e paginação; módulos visíveis em `/modules`

## Fase 2 — KPIs e Automação (Semanas 3–4)
- WMS: inventário, recebimento/expedição, transferência (tabela + filtros)
- TMS: rastreamento, cargas, documentação; simulação de rotas
- OMS: processamento de pedidos, visão centralizada, tempo real
- KPIs: vida do pneu, pressão, temp.; alertas (cron) + webhooks
- Aceite: dashboards de KPIs por módulo com export CSV/PDF mínimo

## Fase 3 — Expansão (Semanas 5–6)
- SCM: compras, inventários, pontos de venda, exportações
- CRM: registro/atendimento, captura/análise, campanhas
- ERP: financeiro/contabilidade, produção, RH, relatórios
- UI Kit: padronizar tabelas, cards, gráficos, mapas
- Aceite: navegação integrada entre módulos; relatórios consolidam dados

## Fase 4 — Resiliência (Semanas 7–8)
- Observabilidade: logs, métricas, tracing, monitoramento
- Hardening: RBAC avançado, validações, limites/rate
- Multi-agente: reagendamento/otimização de cargas
- Aceite: testes de carga básicos e auditoria de segurança nas rotas sensíveis

---

## Backlog por Módulo
- WMS: Recebimento, Separação, Endereçamento, Expedição, Inventário, Armazenagem, Transferências
- TMS: Rastreamento, Controle de cargas, Documentação, Faturamento, Simulações de frete/rotas, Ocorrências
- OMS: Processar pedidos, Multicanal, Segurança, Centralização, Tempo real
- SCM: Compras, Inventários, PDV, Exportações/Distribuição
- CRM: Registro/atendimento, Captura/análise de dados, Tarefas, Projeções/campanhas
- ERP: Financeiro/Contábil, Produção, RH, Relatórios, Gestão de ativos

## Dependências & Riscos
- Versão Node no deploy (fixada); builds com `npm ci`
- `.env.local` consistente (JWT/Neon) e acesso à Data API
- Falhas de `next: not found`: mitigadas pela configuração de engines + start script

## Critérios de Aceite (gerais)
- Páginas com loading/error states consistentes
- Tabelas com paginação, ordenação, busca e ações rápidas
- Rotas protegidas por JWT e verificação de autorização
- Logs de erro úteis em backend e frontend

## Entregáveis
- APIs principais funcionando (CRUD mínimo)
- Dashboards com KPIs relevantes
- Documentação atualizada (este cronograma + estrutura)
- Scripts e `render.yaml` prontos para deploy