# Sistema de Importação de Documentos e Limpeza de Banco

Este documento descreve como usar o sistema de importação de documentos PDF e limpeza de dados do banco de dados PostgreSQL.

## Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Importação de Documentos](#importação-de-documentos)
- [Limpeza do Banco](#limpeza-do-banco)
- [API Endpoints](#api-endpoints)
- [Verificador de Sincronização](#verificador-de-sincronização)
- [Troubleshooting](#troubleshooting)

## Visão Geral

O sistema permite:
- **Importar PDFs** de documentos de transporte (CRLV, CNH, CT-e, ANTT)
- **Limpar dados hipotéticos** do banco mantendo apenas dados reais
- **Verificar sincronização** com o repositório GitHub
- **Monitorar status** do banco via API

### Arquivos Principais

```
backend/
├── scripts/
│   ├── import-documents.mjs      # Script de importação de PDFs
│   ├── clean-database.mjs        # Script de limpeza do banco
│   └── create_documents_tables.sql # SQL das tabelas de documentos
├── routes/
│   └── documents.js              # API endpoints
└── uploads/                      # Diretório de upload de PDFs

scripts/
└── check-sync.mjs                # Verificador de sincronização Git
```

## Pré-requisitos

### Dependências

```bash
# No diretório backend
cd backend
npm install
```

Dependências instaladas:
- `pdf-parse` - Extração de texto de PDFs
- `jsqr` - Leitura de QR Codes
- `sharp` - Processamento de imagens
- `pg` - Cliente PostgreSQL

### Configuração do Banco

1. **Criar as tabelas:**

```bash
# A partir do diretório raiz
npm run db:migrate

# Ou especificamente para documentos
cd backend
npm run db:create-documents
```

2. **Variáveis de ambiente:**

```bash
DATABASE_URL=postgres://user:pass@host:5432/dbname
UPLOAD_DIR=./backend/uploads  # Opcional
BACKUP_DIR=./backend/backups   # Opcional
```

## Importação de Documentos

### Uso Básico

1. **Colocar PDFs no diretório de uploads:**

```bash
# Diretório padrão: backend/uploads
mkdir -p backend/uploads
cp seu-documento.pdf backend/uploads/
```

2. **Executar importação:**

```bash
cd backend
npm run import:documents
```

3. **Importar arquivos específicos:**

```bash
cd backend
node scripts/import-documents.mjs /path/to/file1.pdf /path/to/file2.pdf
```

### Tipos de Documentos Suportados

#### CRLV (Certificado de Registro e Licenciamento de Veículo)

**Campos extraídos:**
- Renavam (11 dígitos)
- Placa (formato ABC-1234 ou ABC1D23)
- Chassis (17 caracteres)
- Tipo de veículo (caminhão, van, carreta, etc)
- Modelo e Marca
- Ano de fabricação e modelo
- Categoria
- Eixos e capacidade de carga
- Dados do proprietário (CPF/CNPJ e nome)

**Tabela:** `veiculos`

#### CNH (Carteira Nacional de Habilitação)

**Campos extraídos:**
- Renach (11 dígitos)
- CPF (11 dígitos)
- Nome completo
- Data de nascimento
- Categoria (A, B, C, D, E, AB, AC, etc)
- Data de validade
- Data da primeira habilitação
- Número de registro
- Restrições (opcional)

**Tabela:** `motoristas`

#### CT-e (Conhecimento de Transporte Eletrônico)

**Campos extraídos:**
- Número do documento
- Chave de acesso (44 dígitos)
- Série
- Data de emissão
- Remetente (CNPJ e nome)
- Destinatário (CNPJ e nome)
- Valores (total, frete)
- Peso total
- Quantidade de volumes
- Impostos (ICMS, PIS, COFINS)
- Natureza da carga

**Tabela:** `cte`

#### ANTT (Documentos da Agência Nacional de Transportes Terrestres)

**Campos extraídos:**
- RNTRC (Registro Nacional de Transportadores)
- Tipo de documento (TAC, ETC, CIPP)
- Número do documento
- Data de validade
- Status

**Tabela:** `antt_documents`

### Formato Esperado dos PDFs

- **Formato:** PDF válido e legível
- **Tamanho máximo:** Configurável via Multer (padrão sem limite)
- **Codificação:** UTF-8 ou similar
- **Texto:** PDFs devem conter texto extraível (não apenas imagens)

### Validações

O sistema valida automaticamente:
- **CRLV:** Presença da placa
- **CNH:** Presença de CPF (11 dígitos) e nome
- **CT-e:** Chave de acesso (44 dígitos) e número

### Logs de Importação

Todos os imports são registrados na tabela `import_logs`:

```sql
SELECT * FROM import_logs ORDER BY created_at DESC LIMIT 10;
```

**Campos do log:**
- `import_type` - Tipo do documento (crlv, cnh, cte, antt)
- `file_name` - Nome do arquivo
- `status` - success, error, partial
- `records_imported` - Quantidade importada
- `records_failed` - Quantidade com falha
- `error_messages` - JSON com erros
- `execution_time_ms` - Tempo de execução

### Exemplo de Saída

```
🚀 Iniciando importação de documentos...

📂 Diretório de uploads: /home/user/backend/uploads
📊 3 arquivo(s) PDF encontrado(s)

📄 Processando: crlv-abc1234.pdf
   Tipo detectado: CRLV
   ✅ CRLV importado - ID: 1, Placa: ABC-1234

📄 Processando: cnh-joao-silva.pdf
   Tipo detectado: CNH
   ✅ CNH importada - ID: 1, CPF: 12345678901

📄 Processando: cte-123456.pdf
   Tipo detectado: CTE
   ✅ CT-e importado - ID: 1, Número: 123456

============================================================
📊 RELATÓRIO DE IMPORTAÇÃO
============================================================
Total de arquivos: 3
✅ Sucesso: 3
❌ Falhas: 0
============================================================
```

## Limpeza do Banco

### Uso Básico

1. **Simulação (dry-run):**

```bash
cd backend
npm run db:clean:dry-run
```

2. **Executar limpeza real:**

```bash
cd backend
npm run db:clean
```

3. **Pular backup (não recomendado):**

```bash
cd backend
node scripts/clean-database.mjs --skip-backup
```

### Critérios de Limpeza

O script identifica dados de teste/hipotéticos através de:

1. **Flag `is_test_data = true`** nas tabelas:
   - `veiculos`
   - `motoristas`
   - `cte`
   - `antt_documents`

2. **Dados antigos** (mais de 6 meses) nas tabelas legadas:
   - `vehicles`
   - `shipments`
   - `maintenances`
   - `customers`
   - `products`
   - `orders`
   - `invoices`
   - `receivables`
   - `payables`
   - `alerts`

### Backup Automático

Antes de limpar, o sistema cria um backup SQL completo em `backend/backups/`:

```
backend/backups/backup-2025-01-15T10-30-00-000Z.sql
```

### Restaurar Backup

```bash
cd backend
node scripts/clean-database.mjs --restore backups/backup-2025-01-15T10-30-00-000Z.sql
```

### Exemplo de Saída

```
🧹 LIMPEZA DE BANCO DE DADOS

============================================================
🔍 Analisando dados de teste...

   📊 veiculos              - Teste: 10, Real: 5
   📊 motoristas            - Teste: 8, Real: 3
   📊 cte                   - Teste: 15, Real: 7

============================================================
   Total dados de teste/antigos: 33
   Total dados reais/recentes: 15
============================================================

⚠️  ATENÇÃO: Esta operação irá deletar dados do banco!
   33 registro(s) será(ão) removido(s)

📦 Criando backup do banco de dados...
   ✅ Backup salvo em: backend/backups/backup-2025-01-15.sql

🧹 Limpando dados de teste...

   ✅ veiculos: 10 registro(s) deletado(s)
   ✅ motoristas: 8 registro(s) deletado(s)
   ✅ cte: 15 registro(s) deletado(s)

============================================================
📊 RELATÓRIO DE LIMPEZA
============================================================
Total de registros deletados: 33
============================================================

✅ Limpeza concluída com sucesso!
📦 Backup disponível em: backend/backups
```

## API Endpoints

### Base URL

```
http://localhost:3001/api/documents
```

### GET /api/documents/status

Retorna status do banco (quantidade de registros reais vs hipotéticos).

**Resposta:**

```json
{
  "tables": [
    {
      "table": "veiculos",
      "realRecords": 5,
      "testRecords": 10,
      "total": 15
    },
    {
      "table": "motoristas",
      "realRecords": 3,
      "testRecords": 8,
      "total": 11
    }
  ],
  "totalReal": 15,
  "totalTest": 33,
  "lastCheck": "2025-01-15T10:30:00.000Z"
}
```

### GET /api/documents/import-logs

Lista logs de importação com paginação.

**Query params:**
- `limit` (padrão: 50)
- `offset` (padrão: 0)

**Resposta:**

```json
{
  "logs": [
    {
      "id": 1,
      "import_type": "crlv",
      "file_name": "crlv-abc1234.pdf",
      "status": "success",
      "records_imported": 1,
      "records_failed": 0,
      "execution_time_ms": 1250,
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ],
  "total": 50,
  "limit": 50,
  "offset": 0
}
```

### POST /api/documents/clean

Limpa dados hipotéticos do banco.

**Body:**

```json
{
  "dryRun": true
}
```

**Resposta:**

```json
{
  "deleted": 33,
  "tables": [
    { "table": "veiculos", "deleted": 10, "dryRun": true },
    { "table": "motoristas", "deleted": 8, "dryRun": true },
    { "table": "cte", "deleted": 15, "dryRun": true }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z",
  "message": "Simulação concluída. Use dryRun=false para executar."
}
```

### GET /api/documents/veiculos

Lista veículos com paginação.

**Query params:**
- `limit` (padrão: 50)
- `offset` (padrão: 0)
- `testOnly` (true/false)

**Resposta:**

```json
{
  "veiculos": [
    {
      "id": 1,
      "placa": "ABC-1234",
      "modelo": "Caminhão Mercedes",
      "is_test_data": false,
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ],
  "total": 5,
  "limit": 50,
  "offset": 0
}
```

### GET /api/documents/motoristas

Lista motoristas (similar ao endpoint de veículos).

### GET /api/documents/cte

Lista CT-e (similar ao endpoint de veículos).

## Verificador de Sincronização

### Uso

```bash
# Verificação padrão
npm run check:sync

# Saída em JSON
node scripts/check-sync.mjs --json
```

### Funcionalidades

- ✅ Verifica branch atual
- ✅ Compara commits locais vs remotos
- ✅ Lista arquivos modificados
- ✅ Sugere comandos git necessários
- ✅ Suporta saída JSON

### Exemplo de Saída

```
🔍 VERIFICADOR DE SINCRONIZAÇÃO COM GITHUB

============================================================
📂 Branch: main
🔗 Remote: https://github.com/logiccamila-wq/optilog.app

📡 Buscando atualizações do remoto...
✅ Atualizações buscadas

💻 Último commit LOCAL:
   Hash: a1b2c3d4
   Mensagem: Implementa importação de documentos
   Autor: João Silva
   Data: 2 hours ago

☁️  Último commit REMOTO:
   Hash: a1b2c3d4
   Mensagem: Implementa importação de documentos
   Autor: João Silva
   Data: 2 hours ago

📊 Status de sincronização:
   Commits à frente: 0
   Commits atrás: 0

✅ Não há alterações não commitadas

============================================================
✅ SINCRONIZADO: Seu repositório está atualizado!
============================================================
```

## Troubleshooting

### Erro: "DATABASE_URL não está definido"

**Solução:** Configure a variável de ambiente no `.env`:

```bash
DATABASE_URL=postgres://user:pass@host:5432/dbname
```

### Erro: "Não foi possível extrair texto do PDF"

**Causas possíveis:**
- PDF corrompido
- PDF contém apenas imagens (sem texto OCR)
- PDF protegido por senha

**Soluções:**
- Verifique integridade do PDF
- Use ferramenta de OCR para PDFs com imagens
- Remova proteção do PDF

### Erro: "Tipo de documento não reconhecido"

**Causa:** O sistema não conseguiu identificar o tipo pelo conteúdo.

**Solução:** 
- Renomeie o arquivo incluindo o tipo: `crlv-placa.pdf`, `cnh-nome.pdf`, `cte-numero.pdf`
- Verifique se o PDF contém as palavras-chave esperadas

### Tabelas não existem

**Solução:** Execute a migração:

```bash
cd backend
npm run db:create-documents
```

### Permissões de escrita no diretório uploads

**Solução:**

```bash
chmod 755 backend/uploads
```

### Import muito lento

**Otimizações:**
- Processe em lotes menores
- Use banco com conexão mais rápida
- Considere índices adicionais nas tabelas

### Backup muito grande

**Solução:** Configure backup incremental ou por tabela específica editando o script.

## Segurança

### Boas Práticas

✅ **Fazer:**
- Validar tamanho de arquivos no upload
- Usar prepared statements (já implementado)
- Manter backups regulares
- Limitar taxa de requisições (rate limiting)

❌ **Não fazer:**
- Expor `DATABASE_URL` no código
- Permitir uploads sem validação
- Executar limpeza sem backup
- Compartilhar arquivos com dados sensíveis

## Performance

### Dicas de Otimização

1. **Índices:** Já criados nas colunas principais (placa, cpf, chave_acesso)

2. **Batch processing:** Processar múltiplos PDFs em lotes:

```javascript
// Ajustar BATCH_SIZE no script
const BATCH_SIZE = 20; // Processar 20 por vez
```

3. **Cache de schemas:** O script mantém cache interno de schemas de tabelas

4. **Transações:** Usar transações para batch inserts múltiplos

## Suporte

Para problemas ou dúvidas:
1. Verifique logs de importação: `SELECT * FROM import_logs`
2. Verifique logs do backend: Console do servidor
3. Consulte este documento
4. Abra issue no repositório GitHub

---

**Última atualização:** 2025-01-15  
**Versão:** 1.0.0
