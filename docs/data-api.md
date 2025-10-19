# Data API (Neon) – Integração via Next.js

Este projeto oferece rotas proxy para a Neon Data API com suporte a JWT (Stack Auth) e fallback para o driver serverless do Neon quando o token não está presente.

## Rotas

- GET `/api/data/posts`
  - Com `Authorization: Bearer <JWT>`: consulta via Data API, respeitando RLS/claims.
  - Sem token: retorna apenas posts publicados via driver serverless (`@neondatabase/serverless`).

- GET `/api/data/posts/[slug]`
  - Com `Authorization: Bearer <JWT>`: consulta via Data API por slug, RLS decide visibilidade.
  - Sem token: fallback retorna o post somente se estiver publicado.

## Variáveis de Ambiente

- `NEON_DATA_API_URL`: URL base do endpoint da Data API.
- `NEON_AUTH_JWKS_URL`: JWKS do provedor (Stack Auth).
- `NEON_AUTH_ISSUER`: Issuer esperado no JWT.
- `NEON_AUTH_AUDIENCE`: Audience esperado no JWT.
- `DATABASE_URL`: conexão pooled do Neon (driver HTTP).
- `DATABASE_URL_UNPOOLED`: conexão direta do Neon (driver HTTP).

## Exemplo de chamada

```bash
# Sem token (fallback)
curl http://localhost:3000/api/data/posts

# Com token (RLS)
curl -H "Authorization: Bearer <JWT>" http://localhost:3000/api/data/posts
```

## Observações

- Em desenvolvimento, reinicie o servidor após alterar `.env.local`.
- O fallback usa apenas dados publicados para segurança.
- Para emitir tokens, integre Stack Auth no frontend e envie o `idToken` ou JWT válido nas requisições.