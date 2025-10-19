# Guia de DNS e Domínios (Hostinger, Vercel e Cloud Run)

Este passo a passo configura seu domínio `xyzlogicflow.tech` para servir:
- Frontend Next.js (dashboard)
- WebSocket (Socket.IO)
- Proxy de rotas (OpenRouteService)

## 1) Nameservers
- Mantenha os nameservers da Hostinger: `ns1.dns-parking.com`, `ns2.dns-parking.com`.
- Assim, e‑mail (Zoho) e demais registros continuam funcionando.

## 2) Subdomínios
Crie subdomínios para cada serviço:
- `dashboard.xyzlogicflow.tech` → frontend Next.js (Vercel)
- `ws.xyzlogicflow.tech` → WebSocket (Socket.IO)
- `api.xyzlogicflow.tech` → Proxy ORS (`/route`)

## 3) Frontend no Vercel
1. No projeto do Vercel (Settings → Domains): Add `dashboard.xyzlogicflow.tech`.
2. Vercel informará o registro DNS:
   - `CNAME dashboard → cname.vercel-dns.com`
3. Se quiser usar o domínio raiz (`xyzlogicflow.tech`) para abrir o dashboard:
   - `A @ → 76.76.21.21` (IP da Vercel)

## 4) Backend (WS e ORS Proxy)
Você pode hospedar no Cloud Run ou em outro provedor (Render/Railway/VM).

### Cloud Run (recomendado)
- Crie dois serviços: `ws-server` e `ors-proxy`.
- Cada serviço responderá em `PORT=8080`.
- Faça o mapeamento de domínios:
  - `ws.xyzlogicflow.tech` → serviço `ws-server`
  - `api.xyzlogicflow.tech` → serviço `ors-proxy`
- Cloud Run fornecerá os registros DNS, geralmente:
  - `CNAME ws → ghs.googlehosted.com`
  - `CNAME api → ghs.googlehosted.com`
- Certificados TLS são gerenciados automaticamente.

## 5) TTL e CAA
- Durante ajustes, use `TTL=300` ou `600` (propaga rápido). Depois pode voltar a `14400`.
- Seus registros CAA já permitem várias CAs (Let’s Encrypt, Digicert, Google, etc.). Deixe como está.

## 6) E‑mail (Zoho)
- Não altere MX/TXT/DKIM/SPF existentes. Eles continuam válidos.

## 7) Variáveis no frontend
Ajuste variáveis em produção:
- `NEXT_PUBLIC_IOT_WS_URL=wss://ws.xyzlogicflow.tech`
- `NEXT_PUBLIC_ORS_PROXY_URL=https://api.xyzlogicflow.tech/route`
- `NEXT_PUBLIC_DASHBOARD_URL=` (vazio, a menos que queira redirecionar `/dashboard` para outro host)
- `NEXT_PUBLIC_MAPBOX_TOKEN=<seu_token_mapbox>`

## 8) Testes
- `nslookup dashboard.xyzlogicflow.tech`
- `nslookup ws.xyzlogicflow.tech`
- `nslookup api.xyzlogicflow.tech`
- Verifique o app:
  - LiveMap renderiza com token Mapbox válido.
  - WS conecta em `wss://ws.xyzlogicflow.tech`.
  - ORS Proxy responde em `https://api.xyzlogicflow.tech/route` (com `ORS_API_KEY` no servidor).

## 9) Segurança
- No `ws-server.js`, habilite CORS para seu domínio de dashboard.
- No `routeProxy.js`, defina `ORS_API_KEY` somente no servidor (não exponha no frontend).

Pronto — com esses passos, seu domínio fica organizado e cada serviço resolve no subdomínio correto com TLS.