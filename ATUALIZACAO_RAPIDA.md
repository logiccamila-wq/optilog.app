# ⚡ Atualização Rápida - Optilog.app

## 🚀 Como Atualizar Tudo de Uma Vez

### **Método 1: Script Automático (Recomendado)**

```powershell
.\update-full.ps1
```

**O que faz:**
1. ✅ Verifica alterações locais
2. ✅ Commita mudanças (se houver)
3. ✅ Faz push para GitHub
4. ✅ Atualiza banco de dados (opcional)
5. ✅ Abre Vercel + Site no navegador

---

### **Método 2: Manual**

```powershell
# 1. Commitar alterações
git add .
git commit -m "sua mensagem aqui"

# 2. Enviar para GitHub
git push

# 3. Atualizar banco (se configurado)
node backend/scripts/db_setup_full.mjs
```

---

## 🗄️ Configurar Banco de Dados (Primeira Vez)

### **Passo 1: Criar Conta Neon (Grátis)**
- Acesse: https://neon.tech
- Crie projeto: `optilog-app`
- Região: `sa-east-1` (São Paulo)

### **Passo 2: Configurar Localmente**

Crie arquivo `.env.local` na raiz:

```bash
DATABASE_URL=postgresql://seu-usuario:senha@ep-xxx.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

### **Passo 3: Criar Tabelas**

```powershell
node backend/scripts/db_setup_full.mjs
```

### **Passo 4: Configurar na Vercel**

1. Vercel → Settings → Environment Variables
2. Adicione `DATABASE_URL` com valor do Neon
3. Redeploy automático!

**📘 Guia Completo:** Veja `SETUP_DATABASE.md`

---

## 🌐 URLs Importantes

- **App Produção:** https://optilog-app.vercel.app
- **Vercel Dashboard:** https://vercel.com/logiccamila-wq/optilog-app
- **Repositório:** https://github.com/logiccamila-wq/optilog.app
- **Neon Console:** https://console.neon.tech

---

## 📊 Status dos Módulos

✅ **24/24 módulos implementados (100%)!**

Ver detalhes: `MODULOS_STATUS.md`

---

## 🆘 Problemas Comuns

### **Push rejeitado:**
```powershell
git pull --rebase
git push
```

### **Banco não conecta:**
```powershell
# Testar conexão
node backend/test-neon.mjs

# Recriar tabelas
node backend/scripts/db_setup_full.mjs
```

### **Deploy não atualiza:**
1. Vercel → Deployments → Redeploy
2. Ou: Force push com `git push --force-with-lease`

---

## 📝 Comandos Úteis

```powershell
# Ver status
git status

# Ver diferenças
git diff

# Ver últimos commits
git log --oneline -5

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Limpar cache node
rm -r node_modules
npm install

# Dev local
npm run dev
```

---

**Última atualização:** 26/10/2025  
**Commit:** be7af88  
**Status:** ✅ 100% Funcional
