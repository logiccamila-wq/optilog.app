# WebSocket/Socket.IO Basic Kit

Servidor Socket.IO para atualizações em tempo real.

## Uso
1. `npm i express cors socket.io`
2. Copie `ws.template.js` para `backend/ws-server.js`
3. Execute: `node backend/ws-server.js`
4. No frontend, conecte com `socket.io-client`:
```ts
import { io } from 'socket.io-client';
const socket = io(process.env.NEXT_PUBLIC_IOT_WS_URL || 'ws://localhost:4010');
socket.on('shipments:init', (data) => console.log(data));
socket.on('shipments:changed', (data) => console.log(data));
```

## Integração
- Use `shipments:changed` para animar marcadores no `LiveMap`.
- Combine com `backend/server.js` para persistência.