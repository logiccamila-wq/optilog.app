# Backend Review — backend

Gerado em: 2025-10-19 20:12:46
Base: $TargetPath = C:\Users\Pichau\devoptilog-app\optilog-app\backend

## Visão Geral
- Profundidade analisada: $MaxDepth = 3
- Ignorados: node_modules, .next, .cache, .firebase, .vercel, dist, build, coverage, tmp, .temp, .git, .pnpm-store, out
- Saída: ./optilog-app/docs/backend-review.md

## Árvore de Pastas (até 3 níveis)
```
├── data
├── functions
├── postgres
├── routes
├── uploads
```

## Dependências e Scripts (backend/package.json)
**Dependencies**
- bcryptjs: ^2.4.3
- cors: ^2.8.5
- dotenv: ^16.4.5
- express: ^4.18.2
- jsonwebtoken: ^9.0.2
- multer: ^1.4.5-lts.1
- openai: ^6.5.0
- socket.io: ^4.8.1
- sqlite3: ^5.1.6

**DevDependencies**
- (nenhuma)

**Scripts**
- start: node app.js

## Entrypoints
- C:\Users\Pichau\devoptilog-app\optilog-app\backend\server.js
- C:\Users\Pichau\devoptilog-app\optilog-app\backend\app.js

## Variáveis de Ambiente (.env*)
- Arquivo: C:\Users\Pichau\devoptilog-app\optilog-app\.env
  - Keys: FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_DASHBOARD_URL, NEXT_PUBLIC_DEFAULT_LOCALE, NEXT_PUBLIC_IOT_WS_URL, NEXT_PUBLIC_MAPBOX_TOKEN, NEXT_PUBLIC_ORS_PROXY_URL, PORT, RESPONSIVE_CLUSTERS_URL, SUNFLOW_SERVICE_URL
- Arquivo: C:\Users\Pichau\devoptilog-app\optilog-app\.env.example
  - Keys: DATABASE_URL, NEON_AUTH_AUDIENCE, NEON_AUTH_ISSUER, NEON_AUTH_JWKS_URL, NEON_DATA_API_URL, NEXT_PUBLIC_COMPANY_ADDRESS, NEXT_PUBLIC_COMPANY_CLIENT, NEXT_PUBLIC_COMPANY_CLIENT_STATUS, NEXT_PUBLIC_COMPANY_CNPJ, NEXT_PUBLIC_COMPANY_EMAIL, NEXT_PUBLIC_COMPANY_FOOTER_NOTE, NEXT_PUBLIC_COMPANY_NAME, NEXT_PUBLIC_COMPANY_PHONE, NEXT_PUBLIC_DISABLE_FIREBASE
- Arquivo: C:\Users\Pichau\devoptilog-app\optilog-app\.env.local
  - Keys: ADMIN_EMAILS, DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_AUTH_AUDIENCE, NEON_AUTH_ISSUER, NEON_AUTH_JWKS_URL, NEON_DATA_API_URL, NEXT_PUBLIC_DEFAULT_LOCALE, NEXT_PUBLIC_DISABLE_FIREBASE
- Arquivo: C:\Users\Pichau\devoptilog-app\optilog-app\.env.local.example
  - Keys: DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_AUTH_AUDIENCE, NEON_AUTH_ISSUER, NEON_AUTH_JWKS_URL, NEON_DATA_API_URL, NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_COMPANY_ADDRESS, NEXT_PUBLIC_COMPANY_CNPJ, NEXT_PUBLIC_COMPANY_EMAIL, NEXT_PUBLIC_COMPANY_NAME, NEXT_PUBLIC_COMPANY_PHONE, NEXT_PUBLIC_DASHBOARD_URL, NEXT_PUBLIC_DEFAULT_LOCALE, NEXT_PUBLIC_DELETE_GRACE_MS, NEXT_PUBLIC_DISABLE_FIREBASE, NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_APP_ID, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FOOTER_LABEL_PILOT_CLIENT, NEXT_PUBLIC_FOOTER_LABEL_STARTUP, NEXT_PUBLIC_IOT_WS_URL, NEXT_PUBLIC_ML_URL, NEXT_PUBLIC_ORS_PROXY_URL, NEXT_PUBLIC_POSTS_API_URL, NEXT_PUBLIC_STACK_AUTH_AUTHORIZE_URL, NEXT_PUBLIC_STACK_AUTH_PROJECT_ID, NEXT_PUBLIC_STACK_AUTH_REDIRECT_URL, STACK_AUTH_JWKS_URL
- Arquivo: C:\Users\Pichau\devoptilog-app\optilog-app\backend\.env
  - Keys: DATABASE_URL, DB_PATH, JWT_SECRET, OPENAI_API_KEY, PORT
- Arquivo: C:\Users\Pichau\devoptilog-app\optilog-app\backend\.env.local.example
  - Keys: DATABASE_URL, DB_PATH, JWT_SECRET, OPENAI_API_KEY, PORT

## Top 25 Arquivos Maiores
- 104 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\package-lock.json
- 68 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\optilog.db
- 10 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\db.js
- 6 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\postgres\schema.sql
- 6 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\postgres\schema_additions.sql
- 5 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\server.js
- 3 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\app.js
- 2 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\auth.js
- 2 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\customers.js
- 2 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\products.js
- 2 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\orders.js
- 1 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routeProxy.js
- 1 KB — C:\Users\Pichau\devoptilog-app\optilog-app\backend\ws-server.js
- 687 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\openai.js
- 559 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\auth.ts
- 482 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\shipments.js
- 471 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\data\tires.json
- 470 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\generator.js
- 457 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\maintenances.js
- 440 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\checklist.js
- 440 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\invoices.js
- 440 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\receivables.js
- 438 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\alerts.js
- 435 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\routes\payables.js
- 414 B — C:\Users\Pichau\devoptilog-app\optilog-app\backend\test-neon.mjs

## Padrões Ignorados
- node_modules
- .next
- .cache
- .firebase
- .vercel
- dist
- build
- coverage
- tmp
- .temp
- .git
- .pnpm-store
- out

## Como Rodar (se aplicável)
- Verificar Node e npm: `node -v` / `npm -v`
- A partir do backend: `npm install`
- Executar: `npm run start` (conforme scripts do package.json)
- Configurar `.env` conforme chaves detectadas (valores sensíveis não são exibidos).
