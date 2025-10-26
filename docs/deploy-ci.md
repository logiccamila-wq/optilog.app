# Integração Contínua e Deploy (CI)

Este documento descreve o workflow adicionado:
- .github/workflows/ci.yml — CI para instalar dependências, lint, testes e builds (monorepo-aware).

Removidas integrações
- As instruções e workflows relacionados a Firebase, Vercel e Neon foram removidos deste repositório por decisão de simplificação. Caso precise reintroduzir um desses provedores, reconfigure os workflows e as secrets adequadamente.

Requisitos
- Os pacotes devem expor scripts no package.json:
  - "build" para geração de artefatos de produção
  - "start" para execução em produção (quando necessário)
  - "test" (opcional)
  - "lint" (opcional)

Como o CI funciona
- O workflow tenta localizar package.json em vários caminhos comuns:
  - ./, ./optilog-app, ./frontend, ./packages/frontend, ./app, ./optilog-app/frontend, ./optilog-app/backend, ./backend
- Para cada diretório com package.json:
  - instala dependências (npm ci quando houver package-lock.json)
  - executa lint (se existir)
  - executa testes (se existir) — falha o job se os testes falharem
  - executa build (se existir) e preserva artifacts para inspeção

Se precisar de deploy automático (Render / Docker / outro)
- Recomenda-se criar um workflow de deploy dedicado e secrets específicos do provedor (não commitá-los).
- Posso ajudar a gerar um workflow para Render/Netlify/Docker/Cloud Run se quiser.
