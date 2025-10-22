# ERP Kit (Enterprise Resource Planning)

Objetivo: financeiro/contábil mínimo, produção e ativos.

## Tabelas sugeridas

- ledger_entries(id, doc, account, amount, created_at, updated_at)
- assets(id, tag, description, location, created_at, updated_at)
- work_orders(id, asset_id, title, status, created_at, updated_at)

## Endpoints

- `POST /api/erp/ledger`
- `GET /api/erp/ledger?page&orderBy`
- `POST /api/erp/assets`
- `POST /api/erp/work-orders`

## Observações

- trilha `updated_at` obrigatória
- contas contábeis com validação de plano de contas simplificado