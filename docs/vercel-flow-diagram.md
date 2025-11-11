# 🔄 Diagrama de Fluxo: Deploy na Vercel

## Visão Geral do Processo de Deploy

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE DEPLOY VERCEL                      │
└─────────────────────────────────────────────────────────────────────┘

DESENVOLVEDOR                   GITHUB                      VERCEL                    USUÁRIO
     │                            │                           │                          │
     │  1. Código desenvolvido    │                           │                          │
     │  (npm run dev)             │                           │                          │
     │                            │                           │                          │
     │  2. git commit             │                           │                          │
     ├──────────────────────────> │                           │                          │
     │  git push origin main      │                           │                          │
     │                            │                           │                          │
     │                            │  3. Webhook notification  │                          │
     │                            ├─────────────────────────> │                          │
     │                            │                           │                          │
     │                            │                           │  4. Clone repository     │
     │                            │ <─────────────────────────┤                          │
     │                            │                           │                          │
     │                            │                           │  5. npm install          │
     │                            │                           │  (instala dependências)  │
     │                            │                           │                          │
     │                            │                           │  6. npm run build        │
     │                            │                           │  (compila Next.js)       │
     │                            │                           │                          │
     │                            │                           │  7. Otimização           │
     │                            │                           │  - Minificação           │
     │                            │                           │  - Code splitting        │
     │                            │                           │  - Image optimization    │
     │                            │                           │                          │
     │                            │                           │  8. Deploy CDN           │
     │                            │                           │  (70+ regiões globais)   │
     │                            │                           │                          │
     │  9. Notificação de Deploy  │                           │                          │
     │ <──────────────────────────┼───────────────────────────┤                          │
     │                            │                           │                          │
     │                            │                           │  10. Site disponível     │
     │                            │                           ├────────────────────────> │
     │                            │                           │  https://seu-site.com    │
     │                            │                           │                          │
```

---

## Detalhamento das Etapas

### 1️⃣ Desenvolvimento Local
```bash
# O desenvolvedor trabalha localmente
npm run dev              # Server de desenvolvimento
http://localhost:3000    # Testa localmente
```

### 2️⃣ Commit e Push
```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

### 3️⃣ Webhook do GitHub
```
GitHub detecta push → Envia notificação para Vercel
```

### 4️⃣ Clone do Repositório
```
Vercel clona a última versão do código
```

### 5️⃣ Instalação de Dependências
```bash
npm install
# Baixa todos os pacotes do package.json
```

### 6️⃣ Build Process
```bash
npm run build
# Next.js compila:
# - TypeScript → JavaScript
# - React components → HTML/CSS/JS
# - Rotas e páginas otimizadas
```

### 7️⃣ Otimização Automática
```
✓ Minificação de JavaScript e CSS
✓ Code splitting (divide código em chunks)
✓ Tree shaking (remove código não usado)
✓ Image optimization (WebP, lazy loading)
✓ Font optimization
```

### 8️⃣ Deploy para CDN
```
Arquivos distribuídos em 70+ servidores globais:
├─ São Paulo (latência: ~10ms para usuários BR)
├─ Miami (latência: ~50ms para usuários BR)
├─ Frankfurt
├─ Tóquio
└─ Sydney
```

### 9️⃣ Notificação
```
Email/Slack: "Deploy bem-sucedido!"
URL: https://optilog-app.vercel.app
```

### 🔟 Site no Ar
```
Usuários acessam:
https://optilog-app.vercel.app
ou
https://seu-dominio.com
```

---

## Preview Deployments (Branches)

```
DESENVOLVEDOR                   GITHUB                      VERCEL
     │                            │                           │
     │  git checkout -b feature   │                           │
     ├──────────────────────────> │                           │
     │  git push origin feature   │                           │
     │                            │                           │
     │                            │  Webhook                  │
     │                            ├─────────────────────────> │
     │                            │                           │
     │                            │                           │  Build & Deploy
     │                            │                           │  (Preview URL única)
     │                            │                           │
     │  Preview URL disponível    │                           │
     │ <──────────────────────────┼───────────────────────────┤
     │                            │                           │
     │  https://optilog-app-      │                           │
     │  git-feature-xyz.vercel.app│                           │
     │                            │                           │
     │  Testar → OK → Merge PR    │                           │
     ├──────────────────────────> │                           │
     │                            │                           │
     │                            │  Novo deploy em production │
     │                            ├─────────────────────────> │
     │                            │                           │
```

**Vantagem:** Cada branch/PR gera uma URL única para testar antes de mergear!

---

## Configuração de Variáveis de Ambiente

```
VERCEL DASHBOARD
     │
     │  Settings → Environment Variables
     │
     ├─ DATABASE_URL (Production)
     ├─ JWT_SECRET (Production)
     ├─ NEXT_PUBLIC_API_URL (Production, Preview, Development)
     └─ [outras variáveis]
     
     ↓  Redeploy necessário
     
NOVA BUILD COM VARIÁVEIS ATUALIZADAS
```

---

## Monitoramento em Tempo Real

```
PRODUÇÃO                        VERCEL ANALYTICS              DESENVOLVEDOR
     │                                 │                            │
     │  Usuário acessa site           │                            │
     ├──────────────────────────────> │                            │
     │  Page view registrado           │                            │
     │                                 │                            │
     │  Erro 500!                      │                            │
     ├──────────────────────────────> │  Alerta automático         │
     │                                 ├──────────────────────────> │
     │                                 │  Email: "Erro detectado"   │
     │                                 │                            │
     │                                 │  Dashboard atualizado      │
     │                                 │  - Error rate              │
     │                                 │  - Performance metrics     │
     │                                 │  - Logs em tempo real      │
     │                                 │                            │
```

---

## Rollback (Voltar Versão Anterior)

```
SITUAÇÃO: Deploy novo causou bug crítico

VERCEL DASHBOARD
     │
     │  Deployments → Selecionar deploy anterior
     │
     ├─ Deploy de 10 minutos atrás (sem bug)
     │
     │  Clique: "Promote to Production"
     │
     ↓  Rollback instantâneo (< 1 minuto)
     
PRODUÇÃO RESTAURADA PARA VERSÃO ESTÁVEL
```

---

## Integração com Banco de Dados

```
VERCEL (Frontend/API Routes)           NEON (PostgreSQL)
          │                                   │
          │  1. Requisição API                │
          │  /api/vehicles                    │
          │                                   │
          │  2. API Route executa             │
          │                                   │
          │  3. Query SQL                     │
          ├─────────────────────────────────> │
          │  SELECT * FROM vehicles           │
          │                                   │
          │  4. Dados retornados              │
          │ <───────────────────────────────┤
          │                                   │
          │  5. JSON para frontend            │
          │  { vehicles: [...] }              │
          │                                   │
          
Variável de ambiente:
DATABASE_URL=postgresql://user:pass@pooler.neon.tech/db
```

---

## Resumo: Por que Vercel é Eficiente?

| Aspecto | Como Funciona | Benefício |
|---------|---------------|-----------|
| **Deploy Automático** | Git push → Build → Deploy | Sem comandos manuais |
| **CDN Global** | 70+ servidores mundiais | Site rápido em qualquer lugar |
| **Preview URLs** | Cada PR = URL única | Testar antes de produção |
| **SSL Grátis** | Let's Encrypt automático | HTTPS sem configuração |
| **Rollback** | Clique para versão anterior | Recuperação instantânea |
| **Analytics** | Monitoramento automático | Insights em tempo real |
| **Otimização** | Minificação, code splitting | Performance máxima |

---

## Diagrama de Arquitetura Completa

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            ARQUITETURA COMPLETA                          │
└─────────────────────────────────────────────────────────────────────────┘

USUÁRIO
   │
   │  HTTPS (SSL/TLS)
   ↓
VERCEL EDGE NETWORK (CDN)
   │
   ├─────────────────────┬─────────────────────┬─────────────────────
   │                     │                     │
   ↓                     ↓                     ↓
STATIC FILES        API ROUTES          SERVERLESS FUNCTIONS
(HTML/CSS/JS)       (/api/*)            (SSR/ISR)
   │                     │                     │
   │                     ↓                     │
   │              NEON POSTGRES               │
   │              (Banco de dados)            │
   │                     ↑                     │
   │                     │                     │
   └─────────────────────┴─────────────────────┘
                         │
                         ↓
                  GITHUB (Código fonte)
                         ↑
                         │
                   DESENVOLVEDOR
```

---

**Conclusão:** Vercel automatiza todo o processo de deploy, permitindo que você foque no código!

Para mais detalhes, consulte:
- [EXPLICACAO_VERCEL.md](../EXPLICACAO_VERCEL.md) - Explicação completa
- [DEPLOY_RAPIDO.md](../DEPLOY_RAPIDO.md) - Guia rápido
- [DEPLOY_GUIDE.md](../DEPLOY_GUIDE.md) - Guia detalhado
