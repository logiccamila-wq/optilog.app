// WebSocket/Socket.IO Basic Kit
// Requisitos: npm i express cors socket.io
// Objetivo: broadcast de posições/atualizações de entregas em tempo real

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Estado simples de entregas
let shipments = [
  { id: 'S-3001', lat: -23.5505, lng: -46.6333, status: 'in_transit' },
  { id: 'S-3002', lat: -23.5990, lng: -46.6550, status: 'scheduled' },
];

io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  socket.emit('shipments:init', shipments);

  socket.on('shipments:update', (payload) => {
    // payload: { id, lat, lng, status }
    shipments = shipments.map((s) => (s.id === payload.id ? { ...s, ...payload } : s));
    io.emit('shipments:changed', shipments);
  });

  socket.on('disconnect', () => console.log('client disconnected', socket.id));
});

app.get('/ping', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4010;
server.listen(PORT, () => console.log(`WS kit listening on ws://localhost:${PORT}`));