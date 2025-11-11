# Gerenciamento de Codespaces - Optilog.app

## 🚨 Problema: Custos de Armazenamento

Se você está enfrentando problemas de billing com GitHub Codespaces, este guia vai ajudar você a gerenciar e otimizar seus codespaces sem prejudicar o projeto.

## 📊 Entendendo o Consumo de Armazenamento

Codespaces acumulam armazenamento de várias formas:
- **node_modules/** - Dependências do projeto (~200-400 MB)
- **.next/** - Build cache do Next.js (~100-300 MB)
- **playwright-report/** e **test-results/** - Relatórios de testes
- **Cache do Docker** - Imagens e layers
- **Histórico Git** - Clone completo do repositório

## 🛠️ Como Cancelar/Deletar Codespaces Sem Riscos

### Passo 1: Identificar Codespaces Desnecessários

1. Acesse: https://github.com/codespaces
2. Revise a lista de codespaces:
   - **"Last used"** - Codespaces não usados há mais de 7 dias podem ser deletados
   - **Storage** - Codespaces com mais de 2 GB devem ser investigados

### Passo 2: Deletar Codespaces Antigos

**✅ Seguro para deletar:**
- Codespaces que você não usa há mais de 7 dias
- Codespaces duplicados (múltiplos do mesmo repo/branch)
- Codespaces de branches que já foram merged

**⚠️ Cuidado ao deletar:**
- Codespaces com trabalho não commitado
- Codespaces que você está usando ativamente

**Como deletar:**
1. Clique nos três pontos (...) ao lado do codespace
2. Selecione "Delete"
3. Confirme a exclusão

### Passo 3: Recuperar Trabalho Antes de Deletar

Se você tem mudanças não salvas em um codespace:

```bash
# Dentro do codespace, verifique mudanças
git status

# Commit as mudanças
git add .
git commit -m "Salvando trabalho antes de deletar codespace"

# Push para o GitHub
git push origin sua-branch
```

## 🎯 Configurações Recomendadas

### Configurar Auto-Delete de Codespaces

1. Vá para: https://github.com/settings/codespaces
2. Configure "Default retention period": **7 dias** ou **30 dias**
3. Isso vai deletar automaticamente codespaces inativos

### Reduzir Tamanho do Codespace

Este repositório já está otimizado com:
- ✅ `.gitignore` ignora `node_modules/`, `.next/`, build artifacts
- ✅ Devcontainer configurado para cache eficiente de Playwright
- ✅ Postbuild scripts otimizados

## 💡 Boas Práticas

### 1. Use um Codespace por Vez
- Pare codespaces quando não estiver usando
- Delete codespaces antigos regularmente

### 2. Commit Frequentemente
- Não deixe trabalho importante apenas no codespace
- Push para o GitHub regularmente

### 3. Configure Limites de Gasto (Billing)
1. Vá para: https://github.com/settings/billing
2. Em "Spending limits", configure um limite mensal
3. GitHub vai parar de criar novos codespaces quando atingir o limite

### 4. Use Prebuilds (Opcional - Requer Team/Enterprise)
- Prebuilds reduzem tempo de criação
- Mas aumentam custos se configurados incorretamente

## 🔍 Verificar Uso Atual

### No GitHub:
1. https://github.com/settings/billing
2. "Usage this month" - veja horas de compute e storage GB-month

### Calcular Custos:
**Nota**: Preços de referência do GitHub Codespaces (verificar preços atuais em https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces)

- **Compute**: ~$0.18/hora para 2-core, 8GB RAM (preço pode variar)
- **Storage**: ~$0.07/GB-month (preço pode variar)

**Exemplo:**
- 5 codespaces x 2 GB cada = 10 GB storage
- 10 GB x $0.07 = ~$0.70/mês apenas em storage

## 🚀 Trabalhando Localmente (Alternativa)

Se preferir evitar custos de Codespaces:

```bash
# Clone o repositório
git clone https://github.com/logiccamila-wq/optilog.app.git
cd optilog.app

# Instale dependências
npm ci

# Rode localmente
npm run dev
```

## 📝 Checklist de Limpeza Mensal

- [ ] Deletar codespaces não usados há mais de 7 dias
- [ ] Verificar billing usage no GitHub
- [ ] Fazer backup/push de trabalho importante
- [ ] Manter apenas 1-2 codespaces ativos
- [ ] Parar codespaces quando não estiver usando

## 🆘 Ajuda Adicional

- **GitHub Docs**: https://docs.github.com/en/codespaces
- **Billing**: https://github.com/settings/billing
- **Support**: https://support.github.com/

---

## ⚡ Quick Actions

### Deletar TODOS os codespaces antigos de uma vez:

**⚠️ ATENÇÃO: Isso vai deletar TODOS os seus codespaces deste repo!**

1. Vá para https://github.com/codespaces
2. Filtre por "logiccamila-wq/optilog.app"
3. Para cada codespace:
   - Verifique se tem trabalho não salvo
   - Delete se não for necessário

### Limpar um codespace específico sem deletar:

```bash
# Dentro do codespace
rm -rf node_modules .next playwright-report test-results
npm ci  # Reinstala dependências limpas
```

Isso pode recuperar 500MB+ de espaço sem perder seu trabalho.
