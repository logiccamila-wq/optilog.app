# 🚀 Guia Completo de Deploy na Vercel com Neon (Português)

> **Stack do Projeto:** Vercel (hosting) + Neon (PostgreSQL) + Next.js 14

Este documento explica, passo a passo, como publicar o projeto na Vercel usando integração com GitHub e CLI local. Inclui configuração de variáveis de ambiente e integração com Neon PostgreSQL.

---

## 📋 Visão Geral

- **Framework:** Next.js 14 (App Router)
- **Hosting:** Vercel (serverless)
- **Banco de Dados:** Neon PostgreSQL
- **Autenticação:** Implementada via banco de dados (sem Firebase/Supabase)

### Rotas Relevantes
- `app/(auth)/first-login/page.tsx`
- `app/(auth)/verify-email/page.tsx`
- `app/(auth)/force-password/page.tsx`
- `app/api/auth/send-verification/route.ts`
- `app/api/auth/change-password/route.ts`

---

## ✅ Pré-requisitos

- [ ] Node.js >= 18 instalado localmente
- [ ] Conta Vercel (https://vercel.com)
- [ ] Conta Neon (https://neon.tech)
- [ ] Repositório GitHub com o código

---

## 📦 Scripts do Projeto

Verifique se o `package.json` possui:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

A Vercel detecta automaticamente Next.js e usa `next build` durante o deploy.

---

## 🗄️ Passo 1: Configurar Banco de Dados Neon

### 1.1 Criar Projeto no Neon

1. Acesse https://console.neon.tech
2. Clique em **"New Project"**
3. Configure:
   - **Nome:** optilog-production
   - **Região:** São Paulo (sa-east-1) - mais próximo do Brasil
   - **PostgreSQL Version:** 16 (recomendado)
4. Clique em **"Create Project"**

### 1.2 Obter Connection Strings

Após criar o projeto, você verá duas connection strings:

```bash
# Pooler (para aplicação - recomendado)
postgresql://[user]:[password]@[host].neon.tech/[dbname]?sslmode=require

# Direct (para migrações)
postgresql://[user]:[password]@[host]-pooler.neon.tech/[dbname]?sslmode=require
```

**Copie ambas!** Você vai precisar delas.

### 1.3 Criar Tabelas

Execute os scripts SQL do projeto:

```bash
# Se tiver scripts de migração
psql "postgresql://[connection-string]" -f backend/scripts/create_tables.sql

# Ou rode os scripts manualmente no Neon SQL Editor
```

---

## 🌐 Passo 2: Deploy na Vercel (via GitHub)

### 2.1 Conectar Repositório

1. Acesse https://vercel.com
2. Clique em **"New Project"**
3. Selecione **"Import Git Repository"**
4. Escolha seu repositório: `logiccamila-wq/optilog.app`
5. Configure:
   - **Framework:** Next.js (detectado automaticamente)
   - **Root Directory:** `./`
   - **Build Command:** `next build` (automático)
   - **Output Directory:** `.next` (automático)

### 2.2 Configurar Variáveis de Ambiente

**ANTES de fazer o deploy**, adicione as variáveis:

1. Clique em **"Environment Variables"**
2. Adicione as seguintes variáveis:

#### Variáveis do Neon (Obrigatórias)

```bash
# Connection string com pooler
DATABASE_URL=postgresql://[user]:[password]@[host].neon.tech/[dbname]?sslmode=require

# Connection string direta (para migrações)
DATABASE_URL_UNPOOLED=postgresql://[user]:[password]@[host]-pooler.neon.tech/[dbname]?sslmode=require
```

#### Variáveis de Autenticação

```bash
# Secret para JWT (gere uma chave aleatória segura)
JWT_SECRET=sua_chave_secreta_minimo_32_caracteres_aqui

# Secret para NextAuth (se usar)
NEXTAUTH_SECRET=outra_chave_secreta_32_chars
NEXTAUTH_URL=https://seu-projeto.vercel.app
```

#### Variáveis Públicas (Frontend)

```bash
# URL base da API
NEXT_PUBLIC_API_URL=https://seu-projeto.vercel.app

# WebSocket URL (se usar)
NEXT_PUBLIC_WS_URL=wss://seu-projeto.vercel.app
```

#### Variáveis Opcionais

```bash
# OpenAI (se usar features de IA)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx

# Node environment
NODE_ENV=production
```

### 2.3 Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (~2-4 minutos)
3. Acesse a URL gerada: `https://optilog-app-xyz.vercel.app`

---

## 💻 Passo 3: Deploy via CLI (Alternativo)

Se preferir usar linha de comando:

### 3.1 Instalar Vercel CLI

```bash
npm i -g vercel
# ou use npx
npx vercel@latest
```

### 3.2 Login

```bash
vercel login
```

### 3.3 Vincular ao Projeto

```bash
# Na raiz do projeto
vercel link
```

Escolha:
- **Scope:** Sua conta/organização
- **Link to existing project?** No (ou Yes se já existe)
- **Project name:** optilog-app

### 3.4 Adicionar Variáveis de Ambiente

```bash
# Banco de dados
vercel env add DATABASE_URL production
# Cole a connection string quando solicitado

vercel env add DATABASE_URL_UNPOOLED production
# Cole a connection string direta

# JWT
vercel env add JWT_SECRET production
# Cole sua chave secreta

vercel env add NEXTAUTH_SECRET production
# Cole sua chave secreta

# URLs públicas
vercel env add NEXT_PUBLIC_API_URL production
# Cole: https://seu-projeto.vercel.app
```

### 3.5 Deploy

```bash
# Preview (teste)
vercel

# Produção
vercel --prod
```

---

## 🔧 Passo 4: Integração de Autenticação com Neon

### 4.1 Estrutura do Banco de Dados

Certifique-se de ter as tabelas:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  terms_accepted BOOLEAN DEFAULT FALSE,
  must_change_password BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Implementar Rotas de API

**`app/api/auth/send-verification/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  const { email } = await request.json();
  
  const sql = neon(process.env.DATABASE_URL!);
  
  // Gerar token de verificação
  const token = crypto.randomUUID();
  
  // Salvar token no banco
  await sql`
    UPDATE users 
    SET verification_token = ${token}
    WHERE email = ${email}
  `;
  
  // Enviar e-mail (implemente aqui)
  // await sendEmail(email, token);
  
  return NextResponse.json({ success: true });
}
```

**`app/api/auth/change-password/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  const sql = neon(process.env.DATABASE_URL!);
  
  // Hash da senha
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Atualizar no banco
  await sql`
    UPDATE users 
    SET password_hash = ${passwordHash},
        must_change_password = FALSE
    WHERE email = ${email}
  `;
  
  return NextResponse.json({ success: true });
}
```

### 4.3 Middleware de Proteção

**`middleware.ts`** (raiz do projeto)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/admin'];
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Verificar sessão/token
    const token = request.cookies.get('session')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verificar no banco
    const sql = neon(process.env.DATABASE_URL!);
    const user = await sql`
      SELECT u.*, s.expires_at
      FROM users u
      JOIN user_sessions s ON u.id = s.user_id
      WHERE s.token = ${token}
      AND s.expires_at > NOW()
    `;
    
    if (!user[0]) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Validar fluxo de primeiro acesso
    if (!user[0].terms_accepted) {
      return NextResponse.redirect(new URL('/first-login', request.url));
    }
    
    if (!user[0].email_verified) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
    
    if (user[0].must_change_password) {
      return NextResponse.redirect(new URL('/force-password', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
```

---

## 🔍 Passo 5: Verificação e Troubleshooting

### 5.1 Verificar Deploy

1. Acesse Vercel Dashboard → Deployments
2. Clique no último deploy
3. Verifique logs de build
4. Teste a URL gerada

### 5.2 Testar Conexão com Neon

```bash
# No Vercel Dashboard, vá em Settings → Environment Variables
# Verifique se DATABASE_URL está configurado

# Teste localmente
npm run dev
# Acesse http://localhost:3000
```

### 5.3 Problemas Comuns

#### Build Failed

```bash
# Erro: Dependências faltando
Solução: npm install && git add package-lock.json && git commit

# Erro: Variável de ambiente não definida
Solução: Adicionar em Vercel Settings → Environment Variables
```

#### Erro 500 na Produção

```bash
# Verificar logs
Vercel Dashboard → Deployments → Runtime Logs

# Comum: DATABASE_URL não configurado
Solução: Adicionar variável e redeploy
```

#### Conexão com Neon Falha

```bash
# Verificar:
1. DATABASE_URL está correta?
2. SSL mode está incluído? (?sslmode=require)
3. IP está whitelisted no Neon? (Vercel não precisa, mas verifique)
```

---

## ✅ Checklist Final

- [ ] Projeto Neon criado e tabelas configuradas
- [ ] Variáveis de ambiente configuradas na Vercel
  - [ ] DATABASE_URL
  - [ ] DATABASE_URL_UNPOOLED
  - [ ] JWT_SECRET
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXT_PUBLIC_API_URL
- [ ] Deploy concluído na Vercel
- [ ] Build passou sem erros
- [ ] Conexão com Neon funcionando
- [ ] Rotas de autenticação implementadas
- [ ] Middleware configurado
- [ ] Testes de fluxo completos:
  - [ ] Login
  - [ ] First-login (aceitar termos)
  - [ ] Verify-email
  - [ ] Force-password
  - [ ] Dashboard

---

## 🔄 Workflow de Desenvolvimento

### Preview Deployments

```bash
# Cada PR cria automaticamente:
https://optilog-app-git-[branch]-[user].vercel.app
```

### Produção

```bash
# Merge para main → deploy automático em:
https://optilog-app.vercel.app
# ou seu domínio custom
```

---

## 🌐 Domínio Personalizado (Opcional)

1. Vercel Dashboard → Settings → Domains
2. Adicionar domínio: `optilog.app`
3. Configurar DNS:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Aguardar propagação (~5 minutos a 48h)

---

## 📊 Monitoramento

### Logs em Tempo Real

```
Vercel Dashboard → Deployments → [Select] → Runtime Logs
```

### Métricas Neon

```
Neon Dashboard → Monitoring
- Conexões ativas
- Queries por segundo
- Latência
```

---

## 🔐 Segurança

### Boas Práticas

✅ **Nunca commitar secrets**
```bash
# Usar .env.local (já no .gitignore)
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

✅ **Usar variáveis de ambiente**
```typescript
// Correto
const dbUrl = process.env.DATABASE_URL;

// Errado
const dbUrl = "postgresql://user:pass@...";
```

✅ **SSL obrigatório no Neon**
```bash
# Sempre incluir
?sslmode=require
```

---

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Neon](https://neon.tech/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [EXPLICACAO_VERCEL.md](./EXPLICACAO_VERCEL.md) - Explicação detalhada
- [VERCEL_REFERENCIA_RAPIDA.md](./VERCEL_REFERENCIA_RAPIDA.md) - Referência rápida

---

## 🆘 Suporte

- Vercel: https://vercel.com/support
- Neon: https://neon.tech/docs/introduction/support
- Documentação do projeto: Este arquivo e links acima

---

**Stack Confirmada:** Vercel + Neon (PostgreSQL) - SEM Firebase/Supabase ✅

*Última atualização: 29/10/2025*
