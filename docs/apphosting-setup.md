# Firebase App Hosting: configuração rápida (IAM, Cloud Shell, GitHub)

Este guia sincroniza seu projeto com Firebase App Hosting, ajusta permissões para gerar logs e acelera o ciclo de erros e deploys.

## 1) Ajuste de IAM para App Hosting

Erro comum: "firebase-app-hosting-compute@... não tem permission para escrever logs".

- Projeto: `studio-4793785332-8ea02`
- Service Account: `firebase-app-hosting-compute@studio-4793785332-8ea02.iam.gserviceaccount.com`

Conceda o papel `Logs Writer (roles/logging.logWriter)`:

Console:
- IAM & Admin → IAM → Adicionar papel ao membro acima → `Logs Writer`.

CLI (gcloud):
```bash
gcloud projects add-iam-policy-binding studio-4793785332-8ea02 \
  --member="serviceAccount:firebase-app-hosting-compute@studio-4793785332-8ea02.iam.gserviceaccount.com" \
  --role="roles/logging.logWriter"
```

Após isso, reexecute o build no App Hosting para ver logs no Cloud Logging.

## 2) Deploy via GitHub Actions (Produção e Preview)

Secrets necessários no repositório:
- `FIREBASE_SERVICE_ACCOUNT`: JSON minificado da Service Account (produção manual)
- `NEXT_PUBLIC_FIREBASE_*`: API keys públicas usadas no build (`lib/firebase.js`)

Workflows principais:
- Produção manual: `Deploy to Firebase Hosting (Service Account)`
- Preview por PR: `Deploy to Firebase Hosting on PR` e `Firebase Preview Deploy (WIF)` (comentam URL no PR)

Segurança:
- Todas as actions pinadas por **commit SHA**.
- Permissões mínimas.
- Preview bloqueado para forks.

Cache:
- `actions/setup-node` com `cache: npm` para acelerar instalações.

## 3) Deploy manual no Google Cloud Shell (sem máquina local)

No Cloud Shell:
```bash
git clone https://github.com/logiccamila-wq/optilog.app.git
cd optilog.app
npm ci
npm run build \
  --NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
  --NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
  --NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
  --NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
  --NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
  --NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID"

# Deploy (se tiver token ou SA JSON)
npx firebase-tools deploy --only hosting \
  --project studio-4793785332-8ea02
```

Alternativas de autenticação:
- `firebase login` (interativo) ou `FIREBASE_TOKEN` como secret/env.
- Service Account JSON via `--token` (usando token gerado por CI) ou workflows.

## 4) Dicas para ciclos rápidos

- Use PRs para gerar previews automáticos com comentário de URL.
- Mantenha o `package-lock.json` atualizado para `npm ci` rápido.
- Se builds ficarem lentos, considere ativar `concurrency` nos workflows para cancelar execuções antigas.