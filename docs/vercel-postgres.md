# Vercel Postgres (Neon) — Setup Rápido

## Por que aqui?
- Usamos rotas internas do Next (`/api/posts`) para ler do Postgres.
- Neon (Vercel Postgres) tem plano gratuito e integra com Vercel sem servidor.

## Passo a passo
- No Vercel, crie um recurso "Postgres" (Neon). A integração com o projeto cria duas variáveis:
  - `DATABASE_URL` (com pooler) — ex.: `...-pooler.sa-east-1.aws.neon.tech/...`
  - `DATABASE_URL_UNPOOLED` (sem pooler) — ex.: `...sa-east-1.aws.neon.tech/...`
- Em `Vercel → Settings → Environment Variables`, confirme:
  - `DATABASE_URL` = string do Neon (use `sslmode=require`).
  - `DATABASE_URL_UNPOOLED` = string direta do Neon (use `sslmode=require`).
  - `NEXT_PUBLIC_POSTS_API_URL` = `https://<seu-site>.vercel.app/api` (produção).
- Localmente, em `.env.local`, defina:
  - `DATABASE_URL=postgres://...` (igual ao do Vercel, pode ser diferente)
  - (Opcional) `DATABASE_URL_UNPOOLED=postgres://...` para scripts/migrações
  - `NEXT_PUBLIC_POSTS_API_URL=http://localhost:3000/api`

## Migração SQL (criar tabela)
```sql
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  author_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Ambientes e UNPOOLED
- Vercel ↔ Neon configuram automaticamente `DATABASE_URL` (com pooler) e `DATABASE_URL_UNPOOLED` (sem pooler).
- Use `DATABASE_URL` em tempo de execução (APIs Next.js com `@neondatabase/serverless`).
- Use `DATABASE_URL_UNPOOLED` para operações administrativas, DDL e migrações (ex.: `pg`/`Pool`).
- O arquivo `lib/db.ts` lê `process.env.DATABASE_URL` para conexões do app.

## Migrações e DDL
- O workflow `/.github/workflows/neon_workflow.yml` usa a URL direta do Neon para aplicar `backend/postgres/schema.sql` em branches de PR.
- O script `scripts/migrate-sqlite-to-postgres.js` agora prioriza `DATABASE_URL_UNPOOLED` quando definido.
- Execute migração local:
  - `DATABASE_URL_UNPOOLED="postgres://..." node scripts/migrate-sqlite-to-postgres.js`
  - ou, com variáveis já definidas no ambiente: `node scripts/migrate-sqlite-to-postgres.js`

## Testar
- Dev: `npm install` e `npm run dev`, abra `http://localhost:3000/api/posts`.
- Produção: após deploy no Vercel, acesse `https://<seu-site>.vercel.app/api/posts`.

## Uso no frontend
- O arquivo `utils/posts.ts` já tenta primeiro `NEXT_PUBLIC_POSTS_API_URL`.
- Com `NEXT_PUBLIC_POSTS_API_URL` definido, a home usa `/api/posts` (sem Firebase).

## Observações
- Não usamos ORM; consultas simples com `@neondatabase/serverless`.
- Tempo de execução usa `DATABASE_URL` (pooler).
- Scripts e DDL usam `DATABASE_URL_UNPOOLED` (direto).
- Para inserir dados, crie uma rota `POST /api/posts` ou carregue via SQL.
- Se quiser restringir acesso, use tokens/vercel protection ou adicionar autenticação.