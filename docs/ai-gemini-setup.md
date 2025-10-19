# Integração Gemini (geminiProxy)

Este guia descreve como usar o endpoint `geminiProxy` para a página `/ai` no Next.js.

## Pré-requisitos

- Projeto Firebase configurado e `firebase-tools` instalado.
- Acesso a Google AI Studio (Gemini) e uma API Key.

## Configuração do segredo

Armazene a chave da API como segredo gerenciado nas Cloud Functions:

```
firebase functions:secrets:set GEMINI_API_KEY
```

Durante o deploy, o segredo será vinculado automaticamente ao runtime.

## Deploy

O projeto já contém uma Cloud Function HTTP `geminiProxy` na região `us-central1`.

```
firebase deploy --only functions:geminiProxy
```

## Uso no Frontend

- A página `app/ai/page.tsx` suporta alternar entre `Gemini` e `OpenAI`.
- Ela monta a URL do endpoint `https://us-central1-<projectId>.cloudfunctions.net/geminiProxy` usando `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.

Defina no seu `.env.local`:

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<seu-project-id>
```

## Modelos

- Padrão: `gemini-1.5-flash-latest`.
- Você pode enviar `{ model: 'gemini-1.5-pro-latest' }` no corpo do POST se desejar outro modelo.

## CORS

O endpoint `geminiProxy` habilita CORS básico (`Access-Control-Allow-Origin: *`). Ajuste conforme necessidade em produção.

## Erros comuns

- 400 Missing prompt: envie `{ prompt: "..." }`.
- 500 Missing GEMINI_API_KEY: configure o segredo com o comando acima.
- 405 Method not allowed: use `POST`.
