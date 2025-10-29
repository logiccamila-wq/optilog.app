import { useEffect, useRef, useState } from 'react';
import {
  getWebSocketService,
  WebSocketMessage,
  LocationUpdate,
  JourneyEvent,
  StatusChange,
} from '@/lib/websocket';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsService = useRef(getWebSocketService());

  useEffect(() => {
    // Capture the current value in a variable that won't change
    const currentWsService = wsService.current;
    
    const connect = async () => {
      try {
        await currentWsService.connect();
        setIsConnected(currentWsService.isConnected());
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setIsConnected(false);
      }
    };

    connect();

    // Optimized: Reduced polling frequency from 1s to 5s to reduce CPU usage
    // WebSocket connection state changes are rare and don't need frequent checking
    const statusInterval = setInterval(() => {
      setIsConnected(currentWsService.isConnected());
    }, 5000); // Changed from 1000ms to 5000ms

    // Subscribe to all message types
    const handleMessage = (message: WebSocketMessage) => {
      setLastMessage(message);
    };

    currentWsService.subscribe('location_update', handleMessage);
    currentWsService.subscribe('status_change', handleMessage);
    currentWsService.subscribe('journey_event', handleMessage);
    currentWsService.subscribe('alert', handleMessage);
    currentWsService.subscribe('notification', handleMessage);

    return () => {
      clearInterval(statusInterval);
      currentWsService.disconnect();
      setIsConnected(false);
    };
  }, []);

  const sendLocationUpdate = (driverId: string, vehicleId: string, location: LocationUpdate) => {
    wsService.current.sendLocationUpdate(driverId, vehicleId, location);
  };

  const sendJourneyEvent = (driverId: string, vehicleId: string, event: JourneyEvent) => {
    wsService.current.sendJourneyEvent(driverId, vehicleId, event);
  };

  const sendStatusChange = (driverId: string, vehicleId: string, status: StatusChange) => {
    wsService.current.sendStatusChange(driverId, vehicleId, status);
  };

  const sendAlert = (
    driverId: string,
    vehicleId: string,
    alert: { level: 'info' | 'warning' | 'error'; message: string }
  ) => {
    wsService.current.sendAlert(driverId, vehicleId, alert);
  };

  return {
    isConnected,
    lastMessage,
    sendLocationUpdate,
    sendJourneyEvent,
    sendStatusChange,
    sendAlert,
  };
};

// Hook específico para motoristas
export const useDriverWebSocket = (driverId: string, vehicleId: string) => {
  const {
    isConnected,
    lastMessage,
    sendLocationUpdate,
    sendJourneyEvent,
    sendStatusChange,
    sendAlert,
  } = useWebSocket();
  const [currentLocation, setCurrentLocation] = useState<LocationUpdate | null>(null);
  const wsService = useRef(getWebSocketService());

  // Register as driver and setup geolocation tracking
  useEffect(() => {
    if (!isConnected || !navigator.geolocation) return;

    // Register as driver
    wsService.current.register('driver', driverId, vehicleId);

    // Listen for registration confirmation
    wsService.current.subscribe('registered', () => {
      console.log('Driver registered successfully');
    });

    // Optimized: Throttle location updates to avoid excessive network traffic
    let lastUpdateTime = 0;
    const UPDATE_THROTTLE_MS = 5000; // Send updates max every 5 seconds

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationUpdate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(location);

        // Throttle updates: Only send if enough time has passed since last update
        const now = Date.now();
        if (now - lastUpdateTime >= UPDATE_THROTTLE_MS) {
          sendLocationUpdate(driverId, vehicleId, location);
          lastUpdateTime = now;
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        sendAlert(driverId, vehicleId, {
          level: 'error',
          message: 'Erro ao obter localização GPS',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isConnected, driverId, vehicleId, sendLocationUpdate, sendAlert]);

  const startJourney = (notes?: string) => {
    sendJourneyEvent(driverId, vehicleId, {
      event: 'journey_start',
      location: currentLocation || undefined,
      notes,
    });
    sendStatusChange(driverId, vehicleId, {
      status: 'in_transit',
      location: currentLocation || undefined,
    });
  };

  const endJourney = (notes?: string) => {
    sendJourneyEvent(driverId, vehicleId, {
      event: 'journey_end',
      location: currentLocation || undefined,
      notes,
    });
    sendStatusChange(driverId, vehicleId, {
      status: 'available',
      location: currentLocation || undefined,
    });
  };

  const startBreak = (notes?: string) => {
    sendJourneyEvent(driverId, vehicleId, {
      event: 'break_start',
      location: currentLocation || undefined,
      notes,
    });
    sendStatusChange(driverId, vehicleId, {
      status: 'on_break',
      location: currentLocation || undefined,
    });
  };

  const endBreak = (notes?: string) => {
    sendJourneyEvent(driverId, vehicleId, {
      event: 'break_end',
      location: currentLocation || undefined,
      notes,
    });
    sendStatusChange(driverId, vehicleId, {
      status: 'in_transit',
      location: currentLocation || undefined,
    });
  };

  const startDelivery = (notes?: string) => {
    sendJourneyEvent(driverId, vehicleId, {
      event: 'delivery_start',
      location: currentLocation || undefined,
      notes,
    });
    sendStatusChange(driverId, vehicleId, {
      status: 'delivering',
      location: currentLocation || undefined,
    });
  };

  const completeDelivery = (notes?: string) => {
    sendJourneyEvent(driverId, vehicleId, {
      event: 'delivery_complete',
      location: currentLocation || undefined,
      notes,
    });
    sendStatusChange(driverId, vehicleId, {
      status: 'in_transit',
      location: currentLocation || undefined,
    });
  };

  return {
    isConnected,
    lastMessage,
    currentLocation,
    startJourney,
    endJourney,
    startBreak,
    endBreak,
    startDelivery,
    completeDelivery,
    sendAlert,
  };
};

// Hook específico para torre de controle
export const useControlTowerWebSocket = () => {
  const { isConnected, lastMessage } = useWebSocket();
  const [vehicles, setVehicles] = useState<Map<string, any>>(new Map());
  const [alerts, setAlerts] = useState<WebSocketMessage[]>([]);
  const wsService = useRef(getWebSocketService());

  // Register as control tower
  useEffect(() => {
    if (!isConnected) return;

    wsService.current.register('control_tower', 'control-tower-1');

    wsService.current.subscribe('registered', () => {
      console.log('Control tower registered successfully');
    });
  }, [isConnected]);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'location_update':
        setVehicles((prev) => {
          const updated = new Map(prev);
          const vehicleData = updated.get(lastMessage.vehicleId) || {};
          updated.set(lastMessage.vehicleId, {
            ...vehicleData,
            location: lastMessage.data,
            lastUpdate: lastMessage.timestamp,
            driverId: lastMessage.driverId,
          });
          return updated;
        });
        break;

      case 'status_change':
        setVehicles((prev) => {
          const updated = new Map(prev);
          const vehicleData = updated.get(lastMessage.vehicleId) || {};
          updated.set(lastMessage.vehicleId, {
            ...vehicleData,
            status: lastMessage.data.status,
            location: lastMessage.data.location,
            lastUpdate: lastMessage.timestamp,
            driverId: lastMessage.driverId,
          });
          return updated;
        });
        break;

      case 'journey_event':
        setVehicles((prev) => {
          const updated = new Map(prev);
          const vehicleData = updated.get(lastMessage.vehicleId) || {};
          updated.set(lastMessage.vehicleId, {
            ...vehicleData,
            lastEvent: lastMessage.data.event,
            location: lastMessage.data.location,
            lastUpdate: lastMessage.timestamp,
            driverId: lastMessage.driverId,
          });
          return updated;
        });
        break;

      case 'alert':
        setAlerts((prev) => [...prev.slice(-49), lastMessage]); // Keep last 50 alerts
        break;
    }
  }, [lastMessage]);

  return {
    isConnected,
    vehicles: Array.from(vehicles.values()),
    alerts,
    lastMessage,
  };
};
