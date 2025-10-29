# Uploads Directory

Este diretório é usado para armazenar arquivos PDF temporariamente durante o processo de importação.

## Uso

Coloque os arquivos PDF (CRLV, CNH, CT-e, ANTT) neste diretório antes de executar o script de importação:

```bash
npm run import:documents
```

## Segurança

⚠️ **IMPORTANTE:** Arquivos PDF podem conter dados sensíveis (CPF, CNH, placas, etc).

- Este diretório está no `.gitignore` e não será commitado
- Limpe periodicamente arquivos antigos
- Considere criptografia em repouso para dados sensíveis

## Estrutura

```
uploads/
├── .gitkeep         # Mantém o diretório no Git
├── README.md        # Este arquivo
└── *.pdf            # Arquivos PDF (não commitados)
```
