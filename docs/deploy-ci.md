# Integração Contínua e Deploy (CI)

Este repositório conta com três workflows principais:
- `.github/workflows/ci.yml` — instala dependências, executa lint/test/build em múltiplos pacotes (monorepo-aware) e publica artefatos.
- `.github/workflows/deploy-vercel.yml` — realiza deploy automatizado na Vercel (em pushes para `main`).
- `.github/workflows/build-and-publish-image.yml` — constrói imagem Docker e publica no GitHub Container Registry (opcional).

## Remoções
- Todas as integrações Firebase foram retiradas. Vercel (frontend) e Neon (Postgres) permanecem como provedores oficiais.

## Requisitos para pacotes Node
- `npm run build` para gerar artefatos de produção (quando aplicável).
- `npm run start` para execução em produção (se necessário).
- Scripts `lint` e `test` são opcionais, mas recomendados.

## Fluxo do CI (`ci.yml`)
1. Procura `package.json` em diretórios comuns (`./`, `./frontend`, `./app`, etc.).
2. Executa `npm ci` (ou `npm install`) para cada pacote encontrado.
3. Roda `npm run lint` (se existir) — falhas não quebram o job.
4. Roda `npm test` (se existir) — falhas interrompem o job.
5. Roda `npm run build` (se existir) e salva artefatos em `_ci_build_artifacts`.

## Fluxo de deploy na Vercel (`deploy-vercel.yml`)
- Exige os secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`.
- O job executa `vercel pull`, `vercel build` e `vercel deploy --prebuilt` de forma não interativa.
- Caso os secrets não estejam definidos, o workflow emite um aviso e encerra sem tentar deploy.

## Publicação de imagem (GHCR)
- Configure `GHCR_PAT` (ou amplie permissões do `GITHUB_TOKEN`) para permitir `docker login` e push para `ghcr.io`.
- Use este workflow para hospedar contêineres em Render, Fly.io ou outro provedor.

## Segredos recomendados
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `NEON_DATABASE_URL`, `NEON_REST_URL`, `NEON_API_KEY` (se usar a API REST)
- `GHCR_PAT`

## Como adicionar segredos
- Via UI: `Settings → Secrets and variables → Actions`.
- Via CLI: `gh auth login` e `gh secret set NOME --body "valor"`.

## Dicas adicionais
- Após aplicar mudanças no banco (ex.: GRANTs, RLS), mantenha scripts em `migrations/` para versionamento.
- Utilize ambientes Vercel Preview para validar PRs e integre checks no fluxo de revisão.
