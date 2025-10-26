# Integração Contínua e Deploy (CI)

Este documento descreve o workflow adicionado:
- .github/workflows/ci.yml — CI para instalar dependências, lint, testes e builds (monorepo-aware).

Removidas integrações
- As instruções e workflows relacionados a Firebase, Vercel e Neon foram removidos deste repositório por decisão de simplificação. Caso precise reintroduzir um desses provedores, reconfigure os workflows e as secrets adequadamente.

# Integração Contínua e Deploy (CI)

Este documento descreve o workflow adicionado:
 - .github/workflows/ci.yml — CI para instalar dependências, lint, testes e builds (monorepo-aware).

Removidas integrações
 - As instruções e workflows relacionados ao Firebase foram removidos deste repositório por decisão de simplificação. Vercel e Neon foram mantidos como opções recomendadas. Caso precise reintroduzir outro provedor, reconfigure os workflows e as secrets adequadamente.

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

Se precisar de deploy automático (Vercel / Docker / outro)
 - Recomenda-se criar um workflow de deploy dedicado e secrets específicos do provedor (não commitá-los).
 - Posso ajudar a gerar um workflow para Vercel/Netlify/Docker/Cloud Run se quiser.
 
 Segredos recomendados para Vercel + Neon
 - `VERCEL_TOKEN` — token de deploy (se usar Vercel CLI/integração)
 - `NEON_DATABASE_URL` — string de conexão Postgres (Neon)
 - `GHCR_PAT` — se for publicar imagens no GitHub Container Registry (opcional)
 
 Como adicionar segredos
 - Pelo site: Settings -> Secrets -> Actions
 - Via CLI (gh): `gh auth login` e `gh secret set NAME --body "value"`
 
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anonymous;
GRANT USAGE ON SCHEMA public TO authenticated, anonymous;
