# Cronograma de Construção

Premissas

- 1 dev dedicado; Next.js (App Router) + MUI.
- Cadastros Motoristas/Veículos com CRUD básico concluído.
- APIs em `app/api/*` e dev em `http://localhost:3033`.

Status Atual (Concluído)

- CRUD motoristas e veículos: POST/GET/PUT/DELETE e unicidade (`drivers.cnh`, `vehicles.plate`).
- UI cadastros: tabelas com busca, feedback, modo edição/cancelar e atualização automática.

Fase 1 — Endurecer Cadastros (UX e Dados)

1. Validações e máscaras de entrada (CNH, Telefone, Placa, limites/formatos).
2. Paginação simples e ordenação por `created_at` (default desc).
3. Metadados: `updated_at` nas tabelas e preenchimento em `PUT`.
   Critérios: erros de validação no cliente e servidor; paginação funcional.

Fase 2 — Autenticação e Autorização

- Proteger páginas e APIs; papéis básicos (`admin`, `operator`).
- 401/403 aplicados corretamente.

Fase 3 — Auditoria e Logs

- Auditoria de usuário/tempo nas operações.
- Logs padronizados de erros/CRUD.

Fase 4 — Outras Entidades Base

- Vínculo Motorista–Veículo com histórico.
- Manutenções (tipo, data, custo, hodômetro).
- Abastecimentos (data, litros, preço, hodômetro).

Fase 5 — Relatórios e Dashboard

- KPIs: totais, custos, últimos eventos.
- Tabelas agregadas com filtros.

Fase 6 — Testes e Qualidade

- Testes de API para drivers/vehicles (sucesso, validação, duplicidade).
- E2E (login, cadastro, editar, excluir, buscar).

Fase 7 — Deploy Staging

- Deploy (Render/Vercel) e migração de banco (Postgres recomendado).
- Variáveis de ambiente, seed e verificação de logs.

Fase 8 — Observabilidade e Alertas

- Erros/performance (Sentry/LogRocket) e métricas básicas.

Fase 9 — Produção e Operação

- Hardening de segurança, runbooks de rollback/migração.

Sequência Resumida

1. Fase 1 (validações, paginação, `updated_at`).
2. Fase 2 (auth/roles) e proteção das APIs.
3. Fase 3 (auditoria/logs).
4. Fase 4 (novas entidades).
5. Fase 5 (dashboard/KPIs).
6. Fase 6 (testes/CI).
7. Fase 7 (staging/migração).
8. Fase 8 (observabilidade/alertas).
9. Fase 9 (produção/operação).
