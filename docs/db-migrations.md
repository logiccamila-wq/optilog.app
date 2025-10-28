# Migrações de Banco (Neon/Postgres)

Este projeto usa SQL puro para provisionar módulos principais (OS e Ferramentas).

## Pré-requisitos
- Defina `DATABASE_URL` no `.env.local` (ou no ambiente) com `sslmode=require` (Neon)

## Aplicar migrações
Execute na raiz do repositório:

- `npm run db:migrate` — aplica:
  - `backend/scripts/create_os_tables.sql`
  - `backend/scripts/create_tools_tables.sql`

## Provisionamento básico e seed (opcional)
No diretório `backend/`:
- `npm run db:setup` — cria tabelas básicas e seeds simples
- `npm run db:setup-full` — recria tudo do zero com seed completo (DROPs inclusos)

Observação: `db:setup*` não cria as tabelas avançadas de OS/Ferramentas; use `db:migrate` para isso.
