# Legacy e diretórios ignorados

Para reduzir confusão e colisões de código, o diretório aninhado `optilog.app/` (snapshot legada) foi ignorado via `.gitignore` e excluído do escopo do TypeScript em `tsconfig.json`.

- Motivo: havia uma cópia antiga do app dentro do próprio repositório, gerando ambiguidade de imports e ruído no build.
- Ação: manter como artefato histórico ignorado. Se precisar resgatar algo, remova temporariamente a regra do `.gitignore` e copie os trechos para os locais atuais.

Outros itens legados (Firebase workflows etc.) permanecem desativados e podem ser arquivados definitivamente após validação.
