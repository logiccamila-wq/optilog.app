# PR: Remover integrações Firebase; adicionar CI e Docker

Resumo
- Remove arquivos e artefatos do Firebase
- Adiciona workflow de CI (build & test monorepo-aware)
- Adiciona workflow para construir e publicar imagem no GHCR
- Adiciona Dockerfile e .dockerignore

O que revisar
- Verificar se a remoção do `lib/firebase*.ts/js` e `frontend/public/firebase-config.js` não quebra integrações esperadas.
- Rever `README.md` e `docs/*` adicionados.

Como testar localmente
1. Checkout da branch: `git checkout ci/remove-firebase-vercel-neon`
2. Instalar dependências: `npm ci`
3. Rodar dev: `npm run dev` no frontend/backend conforme necessário

Deploy
- Após merge, os workflows poderão construir a imagem e publicar no GHCR.

Notas
- Não há remoção de Vercel/Neon — mantive os arquivos relacionados a Vercel/Neon.
- Recomendo adicionar secrets no repositório antes de ativar deploys automáticos (ex.: `GHCR_PAT` se necessário, ou usar `GITHUB_TOKEN`).
