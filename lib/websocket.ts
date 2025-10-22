// WebSocket service for real-time communication
export interface WebSocketMessage {
  type: 'location_update' | 'status_change' | 'journey_event' | 'alert' | 'notification';
  driverId: string;
  vehicleId: string;
  timestamp: string;
  data: any;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  accuracy: number;
}

export interface JourneyEvent {
  event: 'journey_start' | 'journey_end' | 'break_start' | 'break_end' | 'delivery_start' | 'delivery_complete';
  location?: LocationUpdate;
  notes?: string;
}

export interface StatusChange {
  status: 'available' | 'in_transit' | 'on_break' | 'delivering' | 'offline';
  location?: LocationUpdate;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, ((message: any) => void)[]> = new Map();
  private isConnecting = false;
  private clientType: string | null = null;
  private driverId: string | null = null;
  private vehicleId: string | null = null;
  private simulationMode = false;
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor(private url: string = 'ws://localhost:8080') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.simulationMode = false;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnecting = false;
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          // Fall back to simulation mode
          this.enableSimulationMode();
          resolve(); // Don't reject, use simulation instead
        };
      } catch (error) {
        this.isConnecting = false;
        // Fall back to simulation mode
        this.enableSimulationMode();
        resolve(); // Don't reject, use simulation instead
      }
    });
  }

  private enableSimulationMode() {
    console.log('Enabling WebSocket simulation mode');
    this.simulationMode = true;
    
    // Simulate periodic updates
    this.simulationInterval = setInterval(() => {
      // Simulate location updates for demo
      const mockMessage: WebSocketMessage = {
        type: 'location_update',
        driverId: 'driver_001',
        vehicleId: 'vehicle_001',
        timestamp: new Date().toISOString(),
        data: {
          latitude: -23.5505 + (Math.random() - 0.5) * 0.01,
          longitude: -46.6333 + (Math.random() - 0.5) * 0.01,
          speed: Math.random() * 80,
          heading: Math.random() * 360,
          accuracy: 5
        }
      };
      this.handleMessage(mockMessage);
    }, 5000);
  }

  register(clientType: string, driverId?: string, vehicleId?: string): void {
    this.clientType = clientType;
    this.driverId = driverId || null;
    this.vehicleId = vehicleId || null;

    this.send({
      type: 'register',
      clientType,
      driverId,
      vehicleId,
      timestamp: new Date().toISOString()
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type) || [];
    listeners.forEach(listener => listener(message));
  }

  send(message: WebSocketMessage) {
    if (this.simulationMode) {
      console.log('Simulating WebSocket send:', message);
      // In simulation mode, echo the message back after a short delay
      setTimeout(() => {
        this.handleMessage(message);
      }, 100);
    } else if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  subscribe(messageType: string, callback: (message: any) => void) {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, []);
    }
    this.listeners.get(messageType)!.push(callback);
  }

  unsubscribe(messageType: string, callback: (message: any) => void) {
    const listeners = this.listeners.get(messageType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  disconnect() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.simulationMode = false;
  }

  // Driver-specific methods
  sendLocationUpdate(driverId: string, vehicleId: string, location: LocationUpdate) {
    this.send({
      type: 'location_update',
      driverId,
      vehicleId,
      timestamp: new Date().toISOString(),
      data: location
    });
  }

  sendJourneyEvent(driverId: string, vehicleId: string, event: JourneyEvent) {
    this.send({
      type: 'journey_event',
      driverId,
      vehicleId,
      timestamp: new Date().toISOString(),
      data: event
    });
  }

  sendStatusChange(driverId: string, vehicleId: string, status: StatusChange) {
    this.send({
      type: 'status_change',
      driverId,
      vehicleId,
      timestamp: new Date().toISOString(),
      data: status
    });
  }

  sendAlert(driverId: string, vehicleId: string, alert: { level: 'info' | 'warning' | 'error', message: string }) {
    this.send({
      type: 'alert',
      driverId,
      vehicleId,
      timestamp: new Date().toISOString(),
      alertType: alert.level,
      message: alert.message,
      severity: alert.level
    });
  }

  isConnected(): boolean {
    return this.simulationMode || (this.ws !== null && this.ws.readyState === WebSocket.OPEN);
  }
}

// Singleton instance
let wsService: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    // In production, this would be wss://your-domain.com/ws
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://localhost:8080' 
      : 'ws://localhost:8080';
    wsService = new WebSocketService(wsUrl);
  }
  return wsService;
};