# 📊 Integração Tabela de Frete - Google Sheets

## 🔗 Link da Planilha EJG Transportes
https://docs.google.com/spreadsheets/d/1tm5Sd_cjClZy2FpkAL_IyeBIG17ymWCZ/edit

---

## ⚙️ Configuração Necessária

### 1. Tornar a Planilha Pública

Para que o sistema consiga importar os dados automaticamente:

1. **Abra a planilha** no Google Sheets
2. Clique em **"Compartilhar"** (botão superior direito)
3. Em **"Acesso geral"**, selecione:
   - 🌐 **"Qualquer pessoa com o link"**
   - 👁️ **"Leitor"** (apenas visualizar)
4. Clique em **"Concluído"**

✅ Pronto! Agora o sistema pode ler os dados automaticamente.

---

## 📋 Estrutura Esperada da Planilha

A primeira linha deve conter os **cabeçalhos** (nomes das colunas):

| Origem | Destino | Distancia | Preco/km | Pedagio | Tempo | Total |
|--------|---------|-----------|----------|---------|-------|-------|
| São Paulo, SP | Rio de Janeiro, RJ | 428 | 2.85 | 87 | 5h 20min | 1307 |
| São Paulo, SP | Belo Horizonte, MG | 586 | 2.70 | 92 | 7h 10min | 1674 |

### Colunas Obrigatórias:
- **Origem**: Cidade/estado de origem (ex: "São Paulo, SP")
- **Destino**: Cidade/estado de destino (ex: "Rio de Janeiro, RJ")
- **Distancia**: Distância em km (número inteiro, ex: 428)
- **Preco/km**: Preço por quilômetro em R$ (decimal, ex: 2.85)
- **Pedagio**: Valor total de pedágios em R$ (número, ex: 87)
- **Tempo**: Tempo estimado (texto, ex: "5h 20min")
- **Total**: Valor total da rota em R$ (número, ex: 1307)

---

## 🚀 Como Usar no Sistema

### Importação Manual:
1. Acesse **Financeiro > Tabela de Frete** no menu
2. Clique em **"📥 Importar Google Sheets"**
3. Aguarde a sincronização (2-3 segundos)
4. ✅ Dados atualizados!

### Sincronização Automática:
- O sistema sincroniza **automaticamente a cada 1 hora**
- Última sincronização exibida no banner azul
- Clique em **"🔄 Sincronizar Agora"** para forçar atualização

---

## 💰 Integração com Precificação Dinâmica

Os valores da tabela de frete são usados como **base** pela IA de Precificação Dinâmica:

1. **Cliente solicita cotação** (ex: SP → RJ)
2. **Sistema busca** na tabela de frete o preço base (R$ 2,85/km)
3. **IA ajusta dinamicamente** considerando:
   - 📊 Demanda histórica
   - ⛽ Preço do diesel em tempo real
   - 🚦 Condições de trânsito
   - 🔄 Disponibilidade de backhaul
   - 🎯 Competitividade no mercado
4. **Resultado**: Preço otimizado com margem saudável

### Exemplo Real:
```
Tabela Base:     R$ 2,85/km (SP → RJ, 428 km) = R$ 1.220
IA Ajusta:       +8% (demanda alta) = R$ 1.318
                 -3% (backhaul disponível) = R$ 1.278
Preço Final:     R$ 1.278 (margem 32%, probabilidade aceite 87%)
```

---

## 📊 Recursos Disponíveis

### ✅ Já Implementado:
- 📥 **Importação Google Sheets** (manual)
- 📤 **Exportação CSV** (backup local)
- 📊 **Estatísticas em tempo real** (média de preços, distâncias, pedágios)
- ✏️ **Edição individual** de rotas
- 🔗 **Link direto** para planilha original

### 🔜 Próximas Funcionalidades:
- 🔄 **Sincronização automática** (cron job a cada hora)
- 📈 **Analytics avançado** (rotas mais rentáveis, tendências)
- 💡 **Sugestões de IA** (ajustes de preço inteligentes)
- 📝 **Histórico de versões** (rastreamento de alterações)
- ⚡ **Bulk update** (atualizar várias rotas de uma vez)
- 🔐 **Controle de permissões** (quem pode editar preços)

---

## 🛠️ Troubleshooting

### ❌ Erro: "Erro ao acessar a planilha"
**Solução**: Verifique se a planilha está pública (passo 1 acima)

### ❌ Dados não aparecem após importação
**Solução**: 
1. Verifique se a primeira linha tem os cabeçalhos corretos
2. Certifique-se de que as colunas estão na ordem correta
3. Veja o console do navegador (F12) para erros detalhados

### ❌ Valores importados incorretos
**Solução**:
1. Use **ponto** (.) como separador decimal (ex: 2.85, não 2,85)
2. Não use símbolos de moeda (R$) nas células de valor
3. Distâncias e valores devem ser apenas números

---

## 📞 Suporte

Qualquer problema com a integração, entre em contato:
- 📧 Email: logiccamila@gmail.com
- 💬 WhatsApp: (inserir número)

---

**Última atualização**: 28/10/2025
**Versão**: 1.0.0
