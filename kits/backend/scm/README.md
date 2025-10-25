# SCM Kit (Supply Chain)

Objetivo: compras, fornecedores, inventários e distribuição.

## Tabelas sugeridas

- suppliers(id, name, tax_id, created_at, updated_at)
- purchases(id, supplier_id, doc, status, created_at, updated_at)
- inventory(id, sku, qty, location, created_at, updated_at)

## Endpoints

- `POST /api/scm/suppliers`
- `GET /api/scm/suppliers?q&page`
- `POST /api/scm/purchases`
- `GET /api/scm/inventory?q&page`

## Observações

- relacionar com WMS para movimentação
- validação de `tax_id` única
