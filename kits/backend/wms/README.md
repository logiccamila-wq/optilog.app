# WMS Kit (Warehouse Management)

Objetivo: recebimento, endereçamento, picking e expedição.

## Tabelas sugeridas

- receipts(id, supplier, doc, received_at, created_at, updated_at)
- putaway(id, receipt_id, location, quantity, sku, created_at, updated_at)
- picks(id, order_id, location, quantity, sku, created_at, updated_at)
- shipments(id, order_id, carrier, tracking, created_at, updated_at)

SQL exemplo:

```sql
create table if not exists receipts (
  id bigserial primary key,
  supplier text not null,
  doc text not null,
  received_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## Endpoints

- `POST /api/wms/receipts`
- `GET /api/wms/receipts?page&search`
- `PUT /api/wms/receipts/[id]`
- `DELETE /api/wms/receipts/[id]`

## Observações

- usar transações para movimentações de estoque
- auditar com `updated_at` e trilha de quem fez