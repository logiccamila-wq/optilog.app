import { NextRequest, NextResponse } from 'next/server';

// Dados simulados de veículos e rotas
const MOCK_VEHICLES = [
  {
    id: 'VEH001',
    driver: 'João Silva',
    plate: 'ABC-1234',
    position: {
      lat: -23.5505,
      lng: -46.6333,
      timestamp: new Date().toISOString()
    },
    status: 'em_transito',
    route: {
      origin: 'São Paulo, SP',
      destination: 'Campinas, SP',
      progress: 65
    },
    cargo: 'Produtos Químicos - MOPP',
    speed: 85,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'VEH002',
    driver: 'Maria Santos',
    plate: 'DEF-5678',
    position: {
      lat: -22.9068,
      lng: -43.1729,
      timestamp: new Date().toISOString()
    },
    status: 'carregando',
    route: {
      origin: 'Rio de Janeiro, RJ',
      destination: 'Belo Horizonte, MG',
      progress: 15
    },
    cargo: 'Materiais Perigosos',
    speed: 0,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'VEH003',
    driver: 'Carlos Oliveira',
    plate: 'GHI-9012',
    position: {
      lat: -19.9167,
      lng: -43.9345,
      timestamp: new Date().toISOString()
    },
    status: 'entregue',
    route: {
      origin: 'Belo Horizonte, MG',
      destination: 'Brasília, DF',
      progress: 100
    },
    cargo: 'Combustíveis',
    speed: 0,
    lastUpdate: new Date().toISOString()
  }
];

const MOCK_ROUTES = [
  {
    id: 'ROUTE001',
    vehicleId: 'VEH001',
    waypoints: [
      { lat: -23.5505, lng: -46.6333, name: 'São Paulo - Origem' },
      { lat: -23.0965, lng: -46.5475, name: 'Jundiaí - Parada' },
      { lat: -22.9056, lng: -47.0608, name: 'Campinas - Destino' }
    ],
    distance: '95 km',
    estimatedTime: '1h 30min',
    alerts: [
      { type: 'traffic', message: 'Trânsito intenso na Marginal Tietê', severity: 'medium' },
      { type: 'weather', message: 'Chuva prevista para 16h', severity: 'low' }
    ]
  },
  {
    id: 'ROUTE002',
    vehicleId: 'VEH002',
    waypoints: [
      { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro - Origem' },
      { lat: -22.4089, lng: -42.9663, name: 'Petrópolis - Parada' },
      { lat: -19.9167, lng: -43.9345, name: 'Belo Horizonte - Destino' }
    ],
    distance: '434 km',
    estimatedTime: '5h 45min',
    alerts: [
      { type: 'road', message: 'Obras na BR-040 km 120', severity: 'high' }
    ]
  }
];

const MOCK_GEOFENCES = [
  {
    id: 'GEO001',
    name: 'Terminal São Paulo',
    type: 'terminal',
    coordinates: [
      { lat: -23.5505, lng: -46.6333 },
      { lat: -23.5515, lng: -46.6343 },
      { lat: -23.5525, lng: -46.6323 },
      { lat: -23.5515, lng: -46.6313 }
    ],
    active: true
  },
  {
    id: 'GEO002',
    name: 'Área Restrita Centro',
    type: 'restricted',
    coordinates: [
      { lat: -23.5475, lng: -46.6361 },
      { lat: -23.5485, lng: -46.6371 },
      { lat: -23.5495, lng: -46.6351 },
      { lat: -23.5485, lng: -46.6341 }
    ],
    active: true
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const vehicleId = searchParams.get('vehicleId');

  try {
    switch (type) {
      case 'vehicles':
        // Retorna lista de veículos com posições atuais
        return NextResponse.json({
          success: true,
          data: MOCK_VEHICLES,
          timestamp: new Date().toISOString()
        });

      case 'vehicle':
        // Retorna dados específicos de um veículo
        if (!vehicleId) {
          return NextResponse.json({ error: 'Vehicle ID required' }, { status: 400 });
        }
        const vehicle = MOCK_VEHICLES.find(v => v.id === vehicleId);
        if (!vehicle) {
          return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }
        return NextResponse.json({
          success: true,
          data: vehicle,
          timestamp: new Date().toISOString()
        });

      case 'routes':
        // Retorna todas as rotas ativas
        return NextResponse.json({
          success: true,
          data: MOCK_ROUTES,
          timestamp: new Date().toISOString()
        });

      case 'route':
        // Retorna rota específica de um veículo
        if (!vehicleId) {
          return NextResponse.json({ error: 'Vehicle ID required' }, { status: 400 });
        }
        const route = MOCK_ROUTES.find(r => r.vehicleId === vehicleId);
        if (!route) {
          return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        }
        return NextResponse.json({
          success: true,
          data: route,
          timestamp: new Date().toISOString()
        });

      case 'geofences':
        // Retorna cercas geográficas ativas
        return NextResponse.json({
          success: true,
          data: MOCK_GEOFENCES,
          timestamp: new Date().toISOString()
        });

      case 'dashboard':
        // Retorna dados consolidados para dashboard
        const dashboardData = {
          summary: {
            totalVehicles: MOCK_VEHICLES.length,
            activeRoutes: MOCK_ROUTES.length,
            vehiclesInTransit: MOCK_VEHICLES.filter(v => v.status === 'em_transito').length,
            vehiclesLoading: MOCK_VEHICLES.filter(v => v.status === 'carregando').length,
            vehiclesDelivered: MOCK_VEHICLES.filter(v => v.status === 'entregue').length,
            totalAlerts: MOCK_ROUTES.reduce((acc, route) => acc + route.alerts.length, 0)
          },
          vehicles: MOCK_VEHICLES,
          routes: MOCK_ROUTES,
          geofences: MOCK_GEOFENCES,
          alerts: MOCK_ROUTES.flatMap(route => 
            route.alerts.map(alert => ({
              ...alert,
              vehicleId: route.vehicleId,
              routeId: route.id
            }))
          )
        };
        
        return NextResponse.json({
          success: true,
          data: dashboardData,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid type parameter. Use: vehicles, vehicle, routes, route, geofences, or dashboard' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Map API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'update_position':
        // Simula atualização de posição de veículo
        const { vehicleId, position } = data;
        const vehicleIndex = MOCK_VEHICLES.findIndex(v => v.id === vehicleId);
        
        if (vehicleIndex === -1) {
          return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        MOCK_VEHICLES[vehicleIndex].position = {
          ...position,
          timestamp: new Date().toISOString()
        };
        MOCK_VEHICLES[vehicleIndex].lastUpdate = new Date().toISOString();

        return NextResponse.json({
          success: true,
          message: 'Position updated successfully',
          data: MOCK_VEHICLES[vehicleIndex]
        });

      case 'create_alert':
        // Simula criação de alerta
        const { routeId, alert } = data;
        const routeIndex = MOCK_ROUTES.findIndex(r => r.id === routeId);
        
        if (routeIndex === -1) {
          return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        }

        MOCK_ROUTES[routeIndex].alerts.push({
          ...alert,
          id: `ALERT_${Date.now()}`,
          timestamp: new Date().toISOString()
        });

        return NextResponse.json({
          success: true,
          message: 'Alert created successfully',
          data: MOCK_ROUTES[routeIndex]
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid type parameter' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Map API POST Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}