# ORS Route Proxy Kit

Proxy simples para Openrouteservice Directions.

## Uso
1. `npm i express cors node-fetch`
2. Defina variáveis no `.env.local` ou ambiente:
   - `ORS_API_URL=https://api.openrouteservice.org/v2`
   - `ORS_API_KEY=SEU_TOKEN_ORS`
3. Copie `routeProxy.template.js` para `backend/route-proxy.js` (opcional) e execute `node backend/route-proxy.js`.
4. Faça POST em `/route` com:
```json
{
  "profile": "driving-car",
  "coordinates": [[-46.6333,-23.5505],[-46.652,-23.58]]
}
```

## Integração com frontend
- No `LiveMap`, substitua a rota placeholder pela geometria retornada (GeoJSON LineString).
- Exiba o caminho com camada `line` e ajuste estilo conforme necessidade.