# Deploy no Cloud Run (ws-server e ORS routeProxy)

Este guia cria dois serviços no Cloud Run:
- `ws-server` para WebSocket (Socket.IO) em Node.js
- `ors-proxy` para proxy de rotas da OpenRouteService

Pré‑requisitos:
- `gcloud` configurado com seu projeto: `gcloud init`
- Projeto e região (ex.: `PROJECT_ID=seu-projeto` e `REGION=us-central1`)

## 1) Deploy direto do source
Cloud Run pode construir e implantar diretamente do código fonte.

### ws-server
```bash
PROJECT_ID=<seu-projeto>
REGION=<sua-região>

# Porta padrão do Cloud Run é 8080; configuramos via env.
gcloud run deploy ws-server \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars PORT=8080
```

### ors-proxy
```bash
PROJECT_ID=<seu-projeto>
REGION=<sua-região>
ORS_API_KEY=<sua-chave-ors>

# Porta 8080 e chave do ORS
gcloud run deploy ors-proxy \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars PORT=8080,ORS_API_KEY=$ORS_API_KEY
```

Observação: Os comandos acima usam o diretório raiz; como `ws-server.js` e `routeProxy.js` estão em `backend/`, você pode executar dentro de `backend/` ou ajustar `--source backend/`.

## 2) Mapping de domínios
Depois do deploy, faça o mapeamento de domínios:

```bash
# ws.xyzlogicflow.tech → ws-server
gcloud run domain-mappings create \
  --service ws-server \
  --domain ws.xyzlogicflow.tech \
  --region $REGION \
  --project $PROJECT_ID

# api.xyzlogicflow.tech → ors-proxy
gcloud run domain-mappings create \
  --service ors-proxy \
  --domain api.xyzlogicflow.tech \
  --region $REGION \
  --project $PROJECT_ID
```

O Cloud Run mostrará os registros DNS a criar (normalmente `CNAME <subdomínio> → ghs.googlehosted.com`). Crie-os na Hostinger conforme o guia `domains-setup.md`.

## 3) CORS e segurança
- Em `ws-server.js`, ajuste `cors.origin` para `https://dashboard.xyzlogicflow.tech` (evita `*` em produção).
- Em `routeProxy.js`, mantenha `ORS_API_KEY` apenas no servidor.

## 4) Variáveis no frontend (produção)
- `NEXT_PUBLIC_IOT_WS_URL=wss://ws.xyzlogicflow.tech`
- `NEXT_PUBLIC_ORS_PROXY_URL=https://api.xyzlogicflow.tech/route`
- `NEXT_PUBLIC_MAPBOX_TOKEN=<seu_token_mapbox>`
- `NEXT_PUBLIC_DASHBOARD_URL=` (vazio, exceto se quiser redireciono)

## 5) Troubleshooting
- Porta: garanta `PORT=8080` nos serviços Cloud Run.
- Certificados: aguardam emissão automática após criar os mapeamentos.
- DNS: verifique propagação com `nslookup` e `dig`. TTL menor ajuda.

Pronto — com isso, seus serviços backend rodam gerenciados com HTTPS/WSS e se integram ao domínio.