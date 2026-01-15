# 🚀 Guia de Deploy Netlify - OptiLog.app

**Para quem prefere Netlify em vez de Vercel!** ✅

---

## 📋 Por que Netlify?

✅ **Mais estável** - Menos erros de build no frontend  
✅ **Gratuito** - Plano generoso sem custo  
✅ **Simples** - Configuração automática para Next.js  
✅ **Rápido** - Deploy em minutos  

---

## 🎯 Deploy Automático (Recomendado)

### Passo 1: Conectar ao Netlify

1. Acesse: **https://app.netlify.com**
2. Faça login com GitHub
3. Clique em **"Add new site"** → **"Import an existing project"**
4. Selecione **GitHub** como provider
5. Procure e selecione: **`logiccamila-wq/optilog.app`**

### Passo 2: Configurar Build

O Netlify detecta automaticamente Next.js, mas confirme:

```
Build command: npm run build
Publish directory: .next
Node version: 22
```

✅ **O arquivo `netlify.toml` já está configurado!**

### Passo 3: Variáveis de Ambiente

Adicione em **Site settings** → **Environment variables**:

```bash
# Database (Neon Postgres)
DATABASE_URL=postgresql://user:pass@host.neon.tech/optilog?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:pass@host.neon.tech/optilog

# Auth & Security
JWT_SECRET=seu-secret-minimo-32-caracteres-aqui
NEXTAUTH_SECRET=outro-secret-diferente-32-chars
NEXTAUTH_URL=https://seu-site.netlify.app

# API
NEXT_PUBLIC_API_URL=https://seu-site.netlify.app

# Build flags (já configurados no netlify.toml, mas adicione se necessário)
SKIP_ENV_VALIDATION=true
SKIP_LINT=true
```

### Passo 4: Deploy!

1. Clique em **"Deploy site"**
2. Aguarde 3-5 minutos
3. Seu site estará em: **`https://random-name.netlify.app`**

✅ **Pronto!** Seu OptiLog.app está no ar!

---

## 🔧 Customizar Domínio (Opcional)

1. Em **Site settings** → **Domain management**
2. Clique em **"Add custom domain"**
3. Configure seu domínio (ex: `optilog.app`)
4. Siga as instruções para DNS

---

## 🚨 Troubleshooting

### Build Falha?

**Erro comum**: "Cannot find module"
- ✅ Adicione `NPM_FLAGS = "--legacy-peer-deps"` nas env vars

**Erro comum**: "Environment variable not found"
- ✅ Verifique se todas as variáveis estão configuradas
- ✅ Redeploy após adicionar variáveis

**Erro comum**: "Build timed out"
- ✅ Isso é raro no Netlify, mas pode acontecer
- ✅ Tente fazer deploy de novo (geralmente resolve)

### Deploy Lento?

- O primeiro deploy demora mais (3-5 min)
- Deploys seguintes são mais rápidos (1-2 min)

---

## 📊 Monitorar Deploy

### Logs em Tempo Real

1. Vá em **Deploys** no dashboard
2. Clique no deploy atual
3. Veja os logs em tempo real

### Status do Site

- 🟢 **Published** - Tudo ok!
- 🟡 **Building** - Deploy em andamento
- 🔴 **Failed** - Verifique os logs

---

## 🔄 Deploy Automático

**Configurado automaticamente!**

- Push na branch `main` → Deploy automático
- Pull Request → Preview deploy (opcional)

### Desabilitar Auto Deploy (se quiser)

1. **Site settings** → **Build & deploy**
2. **Continuous deployment** → **Build settings**
3. Mude para "Manual deploy"

---

## 📱 Deploy Preview (PRs)

**Ativar previews de Pull Requests:**

1. **Site settings** → **Build & deploy**
2. **Deploy contexts** → **Deploy Previews**
3. Ative **"Any pull request against main"**

Agora cada PR terá uma URL de preview! 🎉

---

## 🎨 Netlify vs Vercel - Comparação

| Recurso | Netlify ✅ | Vercel |
|---------|-----------|--------|
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Plano Grátis** | 300 min build/mês | 100 GB bandwidth |
| **Edge Functions** | ✅ Sim | ✅ Sim |
| **Deploy Time** | ~3 min | ~2-4 min |

**Nossa experiência com OptiLog.app:** Netlify apresentou menos erros de build frontend comparado ao Vercel. Sua experiência pode variar dependendo da configuração do projeto.

**Recomendação:** Netlify é uma boa alternativa se você está tendo problemas recorrentes com deploy em outra plataforma.

---

## 🆘 Precisa de Ajuda?

### Documentação Oficial
- Netlify Next.js: https://docs.netlify.com/frameworks/next-js/overview/
- Plugin Next.js: https://github.com/netlify/next-runtime

### Suporte
- Discord Netlify: https://discord.gg/netlify
- Forums: https://answers.netlify.com/

---

## ✅ Checklist Final

Antes de fazer deploy, confirme:

- [ ] Repositório conectado ao Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Node version: 22
- [ ] Todas variáveis de ambiente configuradas
- [ ] `netlify.toml` existe na raiz (✅ já existe!)
- [ ] Build local funciona: `npm run build`

---

## 🎉 Deploy Concluído!

Seu OptiLog.app está agora rodando no Netlify! 

**URL do site:** https://seu-site.netlify.app  
**Dashboard:** https://app.netlify.com

Para mudar o nome do site:
1. **Site settings** → **Site details**
2. **Change site name**
3. Escolha um nome disponível (ex: `optilog-app.netlify.app`)

---

**Dúvidas?** Verifique os logs de build no dashboard do Netlify!

**Tudo certo?** 🚀 Seu sistema está no ar e funcionando!
