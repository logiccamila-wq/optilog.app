# Backups Directory

Este diretório é usado para armazenar backups automáticos do banco de dados antes de operações de limpeza.

## Uso

Backups são criados automaticamente quando você executa:

```bash
npm run db:clean
```

Para restaurar um backup:

```bash
node scripts/clean-database.mjs --restore backups/backup-YYYY-MM-DD.sql
```

## Segurança

⚠️ **IMPORTANTE:** Backups contêm todos os dados do banco de dados.

- Este diretório está no `.gitignore` e não será commitado
- Mantenha backups em local seguro
- Considere criptografia para backups de longo prazo
- Delete backups antigos periodicamente

## Formato dos Backups

- Nome: `backup-YYYY-MM-DDTHH-MM-SS-MMMZ.sql`
- Formato: SQL INSERT statements
- Conteúdo: Todas as tabelas do sistema

## Retenção

Recomendado:
- Manter backups dos últimos 30 dias
- Fazer backup externo semanal
- Validar integridade mensalmente
