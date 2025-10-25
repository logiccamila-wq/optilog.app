# CRM Kit (Customer Relationship)

Objetivo: cadastros de clientes, tickets e campanhas.

## Tabelas sugeridas

- customers(id, name, email, phone, created_at, updated_at)
- tickets(id, customer_id, title, status, created_at, updated_at)
- campaigns(id, name, start_at, end_at, created_at, updated_at)

## Endpoints

- `POST /api/crm/customers`
- `GET /api/crm/customers?q&page`
- `POST /api/crm/tickets`
- `PUT /api/crm/tickets/[id]`

## Observações

- e-mail único em `customers`
- status de ticket: open -> in_progress -> closed
