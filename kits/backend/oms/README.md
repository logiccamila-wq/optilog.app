# OMS Kit (Order Management)

Objetivo: pedidos, itens, canais e status.

## Tabelas sugeridas

- orders(id, code, customer_id, status, channel, created_at, updated_at)
- order_items(id, order_id, sku, qty, price, created_at, updated_at)

SQL exemplo:

```sql
create table if not exists orders (
  id bigserial primary key,
  code text not null,
  customer_id bigint,
  status text not null default 'new',
  channel text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create unique index if not exists idx_orders_code_unique on orders(code);
```

## Endpoints

- `POST /api/oms/orders`
- `GET /api/oms/orders?page&search&status`
- `PUT /api/oms/orders/[id]`
- `DELETE /api/oms/orders/[id]`

## Observações

- criar status machine simples: new -> confirmed -> shipped -> delivered
