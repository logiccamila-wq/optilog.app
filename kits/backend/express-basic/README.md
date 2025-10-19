# Express Basic API Kit

API de exemplo com Express e CORS.

## Endpoints
- `GET /ping` – healthcheck
- `GET /tires` / `POST /tires` – gestão de pneus
- `GET /vehicles` – listagem de veículos
- `GET /shipments` / `POST /shipments` – entregas e tracking

## Uso
1. `npm i express cors`
2. Copie `server.template.js` para `backend/server.js` ou outra pasta.
3. `node backend/server.js` ou adicione script no `package.json`: `"api": "node backend/server.js"`.

## Próximos passos
- Trocar armazenamento in-memory por JSON/DB.
- Adicionar autenticação (JWT) e rate limiting.
- Incluir logs e validação de payloads.