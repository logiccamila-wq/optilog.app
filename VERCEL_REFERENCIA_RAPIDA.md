# 📋 Guia Rápido: Vercel - Referência Rápida

> **Para explicação completa, veja:** [EXPLICACAO_VERCEL.md](./EXPLICACAO_VERCEL.md)

## 🎯 O que é Vercel?

Plataforma de hospedagem para aplicações web que faz deploy automático do seu código.

**Em uma frase:** Você faz `git push`, a Vercel compila e publica seu site automaticamente.

---

## ⚡ Deploy Rápido (3 Passos)

### 1️⃣ Conectar GitHub
```
https://vercel.com/new
→ Import Git Repository
→ Selecionar: logiccamila-wq/optilog.app
```

### 2️⃣ Configurar Variáveis
```
Settings → Environment Variables → Adicionar:

DATABASE_URL=postgresql://...
JWT_SECRET=sua_chave_32_chars
NEXTAUTH_SECRET=outra_chave_32_chars
NEXT_PUBLIC_API_URL=https://seu-projeto.vercel.app
```

### 3️⃣ Deploy
```
Deployments → Redeploy (ou git push)
Aguardar ~3 minutos
Pronto! Site no ar em: https://seu-projeto.vercel.app
```

---

## 🔄 Como Funciona?

```
Você: git push
  ↓
GitHub: notifica Vercel
  ↓
Vercel: npm install → npm run build → deploy
  ↓
Site: https://seu-projeto.vercel.app
```

---

## 📝 Comandos Essenciais

### Via Dashboard (Interface Web)
```
1. vercel.com/login
2. Selecionar projeto
3. Settings → Environment Variables
4. Deployments → View Logs
5. Domains → Add Domain
```

### Via CLI (Terminal)
```bash
# Instalar
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Ver logs
vercel logs

# Adicionar variável
vercel env add NOME_VARIAVEL production
```

---

## 🔧 Configuração do Projeto

### vercel.json (já configurado)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build"
}
```

### package.json (scripts)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## 🌍 Variáveis de Ambiente

### Privadas (Backend/API)
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXTAUTH_SECRET=...
```

### Públicas (Frontend)
```bash
# Precisa do prefixo NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://...
NEXT_PUBLIC_WS_URL=wss://...
```

---

## 🚨 Problemas Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| Build failed | Dependência faltando | `npm install [pacote]` |
| 500 Error | Variável de ambiente faltando | Adicionar no Vercel Dashboard |
| Tela branca | JavaScript não carregou | Verificar Console (F12) |
| Build lento | Pouca memória | Já configurado: `NODE_OPTIONS` |

---

## 📊 Monitoramento

### Ver Logs
```
Vercel Dashboard
→ Deployments
→ Selecionar deploy
→ Runtime Logs / Build Logs
```

### Analytics
```
Settings → Analytics → Enable
- Page views
- Performance
- Errors
```

---

## 🔄 Workflow Diário

### Desenvolvimento
```bash
1. git checkout -b feature/nova-funcao
2. # Fazer alterações
3. npm run dev  # Testar local
4. git commit -m "descrição"
5. git push
```

### Preview
```
Vercel cria automaticamente:
https://optilog-app-git-feature-nova-funcao.vercel.app
```

### Produção
```bash
1. Testar preview OK?
2. Mergear PR para main
3. Vercel faz deploy automático
4. Site atualizado!
```

---

## 🎯 Checklist de Deploy

### Antes
- [ ] `npm run build` funciona local
- [ ] Variáveis de ambiente documentadas
- [ ] Banco de dados Neon criado
- [ ] Código commitado no GitHub

### Durante
- [ ] Build completou sem erros
- [ ] Preview deployment funciona

### Depois
- [ ] Site carrega
- [ ] Login funciona
- [ ] Banco conecta
- [ ] Performance OK (< 3s)

---

## 📚 Links Úteis

### Documentação Detalhada
- [EXPLICACAO_VERCEL.md](./EXPLICACAO_VERCEL.md) - Explicação completa
- [docs/vercel-flow-diagram.md](./docs/vercel-flow-diagram.md) - Diagramas visuais
- [DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md) - Deploy em 15 minutos
- [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) - Guia passo a passo completo

### Oficial
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Neon + Vercel](https://neon.tech/docs/guides/vercel)

---

## 💡 Dicas Rápidas

✅ **Sempre testar build local antes de deploy**
```bash
npm run build
npm run start:prod
```

✅ **Usar Preview Deployments para testar**
```
Cada branch = URL única de teste
```

✅ **Monitorar logs após deploy**
```
Vercel Dashboard → Runtime Logs
```

✅ **Guardar segredos nas variáveis de ambiente**
```
Nunca commitar senhas/chaves no código!
```

✅ **Fazer rollback se algo der errado**
```
Deployments → Deploy anterior → Promote to Production
```

---

## 🚀 Próximos Passos

1. **Primeiro deploy?**
   → Siga [DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md)

2. **Quer entender como funciona?**
   → Leia [EXPLICACAO_VERCEL.md](./EXPLICACAO_VERCEL.md)

3. **Precisa de diagrama visual?**
   → Veja [docs/vercel-flow-diagram.md](./docs/vercel-flow-diagram.md)

4. **Deploy completo passo a passo?**
   → Use [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

---

**Resumo:** Vercel = Git push → Site no ar automaticamente! 🎉

*Este documento é uma referência rápida. Para explicação completa, consulte EXPLICACAO_VERCEL.md*
