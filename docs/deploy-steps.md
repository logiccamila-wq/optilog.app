# Guia rápido de Deploy (Vercel, Neon, GHCR)

## Objetivo
Este guia descreve passos simples para publicar a aplicação sem Firebase e usando Vercel (frontend) e Neon (banco), com opção de imagem Docker no GHCR.

## 1) Vercel (frontend)
- Conecte o repositório no painel do Vercel.
- Configure variáveis de ambiente necessárias (ex.: NEXT_PUBLIC_API_URL, DATABASE_URL se for usar serverless functions).
- Vercel fará deploy automático em pushes para branches configuradas (ex.: `main`).

## 2) Neon (database)
- Crie um projeto no Neon e copie a connection string.
- Adicione a connection string como secret nas configurações do Vercel (ou como GitHub Secret se usar Actions).

## 3) Deploy via Docker (GHCR) — opcional
- Workflow `.github/workflows/build-and-publish-image.yml` constrói e publica imagem para GHCR.
- Certifique-se que `GITHUB_TOKEN` tem permissão `packages: write` (configurado no workflow que adicionamos).
- Para rodar localmente:
  - `docker build -t optilog:local .`
  - `docker run -p 3000:3000 optilog:local`

## 4) Recomendações
- Não commit logs, caches ou builds no repo (já adicionei `.gitignore`).
- Revise os endpoints que usavam Firebase e substitua pela sua camada de backend (Neon/Postgres, ou APIs serverless).
