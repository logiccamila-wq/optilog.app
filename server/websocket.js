const WebSocket = require('ws');
const http = require('http');

// Criar servidor HTTP
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Armazenar conexões ativas
const connections = new Map();
const vehicles = new Map();
const alerts = [];

console.log('🚀 Servidor WebSocket iniciado');

wss.on('connection', (ws, req) => {
  const connectionId = generateId();
  connections.set(connectionId, {
    ws,
    type: null,
    driverId: null,
    vehicleId: null,
    connectedAt: new Date()
  });

  console.log(`📱 Nova conexão: ${connectionId}`);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(connectionId, message);
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
    }
  });

  ws.on('close', () => {
    console.log(`📱 Conexão fechada: ${connectionId}`);
    connections.delete(connectionId);
  });

  ws.on('error', (error) => {
    console.error(`❌ Erro na conexão ${connectionId}:`, error);
  });

  // Enviar mensagem de boas-vindas
  sendToConnection(connectionId, {
    type: 'connected',
    connectionId,
    timestamp: new Date().toISOString()
  });
});

function handleMessage(connectionId, message) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  console.log(`📨 Mensagem recebida de ${connectionId}:`, message.type);

  switch (message.type) {
    case 'register':
      handleRegister(connectionId, message);
      break;
    
    case 'location_update':
      handleLocationUpdate(connectionId, message);
      break;
    
    case 'journey_event':
      handleJourneyEvent(connectionId, message);
      break;
    
    case 'status_change':
      handleStatusChange(connectionId, message);
      break;
    
    case 'alert':
      handleAlert(connectionId, message);
      break;
    
    case 'ping':
      sendToConnection(connectionId, { type: 'pong', timestamp: new Date().toISOString() });
      break;
    
    default:
      console.log(`⚠️ Tipo de mensagem desconhecido: ${message.type}`);
  }
}

function handleRegister(connectionId, message) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  connection.type = message.clientType;
  connection.driverId = message.driverId;
  connection.vehicleId = message.vehicleId;

  console.log(`✅ Cliente registrado: ${message.clientType} - Driver: ${message.driverId} - Vehicle: ${message.vehicleId}`);

  // Confirmar registro
  sendToConnection(connectionId, {
    type: 'registered',
    clientType: message.clientType,
    timestamp: new Date().toISOString()
  });

  // Se for um motorista, inicializar dados do veículo
  if (message.clientType === 'driver' && message.vehicleId) {
    vehicles.set(message.vehicleId, {
      id: message.vehicleId,
      driverId: message.driverId,
      status: 'idle',
      location: null,
      lastUpdate: new Date(),
      connectionId
    });
  }
}

function handleLocationUpdate(connectionId, message) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  const vehicleId = connection.vehicleId || message.vehicleId;
  const driverId = connection.driverId || message.driverId;
  if (!vehicleId) return;

  const vehicle = vehicles.get(vehicleId);
  if (vehicle) {
    vehicle.location = message.data || message.location || null;
    vehicle.lastUpdate = new Date();
  }

  // Broadcast para Torre de Controle
  broadcastToControlTowers({
    type: 'vehicle_location_update',
    vehicleId,
    driverId,
    location: message.data || message.location || null,
    timestamp: new Date().toISOString()
  });
}

function handleJourneyEvent(connectionId, message) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  const vehicleId = connection.vehicleId || message.vehicleId;
  const driverId = connection.driverId || message.driverId;
  const event = (message.data && message.data.event) || message.event;

  console.log(`🚛 Evento de jornada: ${event} - Vehicle: ${vehicleId}`);

  // Atualizar status do veículo
  const vehicle = vehicles.get(vehicleId);
  if (vehicle) {
    switch (event) {
      case 'journey_start':
        vehicle.status = 'in_transit';
        break;
      case 'journey_end':
        vehicle.status = 'idle';
        break;
      case 'break_start':
        vehicle.status = 'on_break';
        break;
      case 'break_end':
        vehicle.status = 'in_transit';
        break;
      case 'delivery_start':
        vehicle.status = 'delivering';
        break;
      case 'delivery_complete':
        vehicle.status = 'in_transit';
        break;
    }
    vehicle.lastUpdate = new Date();
  }

  // Broadcast para Torre de Controle
  broadcastToControlTowers({
    type: 'journey_event',
    vehicleId,
    driverId,
    event,
    data: message.data,
    timestamp: new Date().toISOString()
  });
}

function handleStatusChange(connectionId, message) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  const vehicleId = connection.vehicleId || message.vehicleId;
  const driverId = connection.driverId || message.driverId;
  const status = (message.data && message.data.status) || message.status;

  // Broadcast para Torre de Controle
  broadcastToControlTowers({
    type: 'status_change',
    vehicleId,
    driverId,
    status,
    timestamp: new Date().toISOString()
  });
}

function handleAlert(connectionId, message) {
  const connection = connections.get(connectionId);
  const vehicleId = (message && message.vehicleId) || (connection && connection.vehicleId);
  const driverId = (message && message.driverId) || (connection && connection.driverId);

  const alert = {
    id: generateId(),
    vehicleId,
    driverId,
    type: message.alertType,
    message: message.message,
    severity: message.severity || 'medium',
    timestamp: new Date().toISOString(),
    resolved: false
  };

  alerts.push(alert);
  console.log(`🚨 Alerta criado: ${alert.type} - ${alert.message}`);

  // Broadcast para Torre de Controle
  broadcastToControlTowers({
    type: 'new_alert',
    alert
  });
}

function broadcastToControlTowers(message) {
  connections.forEach((connection, connectionId) => {
    if (connection.type === 'control_tower') {
      sendToConnection(connectionId, message);
    }
  });
}

function sendToConnection(connectionId, message) {
  const connection = connections.get(connectionId);
  if (connection && connection.ws.readyState === WebSocket.OPEN) {
    connection.ws.send(JSON.stringify(message));
  }
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Enviar dados periódicos para Torre de Controle
setInterval(() => {
  const dashboardData = {
    type: 'dashboard_update',
    vehicles: Array.from(vehicles.values()),
    alerts: alerts.filter(alert => !alert.resolved),
    stats: {
      totalVehicles: vehicles.size,
      activeVehicles: Array.from(vehicles.values()).filter(v => v.status === 'in_transit').length,
      onBreakVehicles: Array.from(vehicles.values()).filter(v => v.status === 'on_break').length,
      idleVehicles: Array.from(vehicles.values()).filter(v => v.status === 'idle').length,
      totalAlerts: alerts.filter(alert => !alert.resolved).length
    },
    timestamp: new Date().toISOString()
  };

  broadcastToControlTowers(dashboardData);
}, 10000); // A cada 10 segundos

// Iniciar servidor
const PORT = process.env.WS_PORT || 8080;
server.listen(PORT, () => {
  console.log(`🌐 Servidor WebSocket rodando na porta ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Encerrando servidor WebSocket...');
  wss.close(() => {
    server.close(() => {
      console.log('✅ Servidor WebSocket encerrado');
      process.exit(0);
    });
  });
});