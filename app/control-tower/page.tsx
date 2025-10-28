'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useControlTowerWebSocket } from '@/hooks/useWebSocket';

// Importação dinâmica do mapa para evitar problemas de SSR
const MapContainer: any = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer: any = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker: any = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup: any = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const Polyline: any = dynamic(() => import('react-leaflet').then((mod) => mod.Polyline), { ssr: false });

interface Vehicle {
  id: string;
  driver: string;
  plate: string;
  position: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  status: string;
  route: {
    origin: string;
    destination: string;
    progress: number;
  };
  cargo: string;
  speed: number;
  lastUpdate: string;
}

interface Route {
  id: string;
  vehicleId: string;
  waypoints: Array<{
    lat: number;
    lng: number;
    name: string;
  }>;
  distance: string;
  estimatedTime: string;
  alerts: Array<{
    type: string;
    message: string;
    severity: string;
  }>;
}

interface DashboardData {
  summary: {
    totalVehicles: number;
    activeRoutes: number;
    vehiclesInTransit: number;
    vehiclesLoading: number;
    vehiclesDelivered: number;
    totalAlerts: number;
  };
  vehicles: Vehicle[];
  routes: Route[];
  alerts: Array<{
    type: string;
    message: string;
    severity: string;
    vehicleId: string;
    routeId: string;
  }>;
}

// Dados simulados das rotas
const MOCK_ROUTES = [
  {
    id: 'MLG1023',
    driver: 'João Silva',
    vehicle: 'Scania R450 - ABC-1234',
    client: 'Mineração Vale do Rio',
    cargo: 'Minério de Ferro - 35t',
    origin: 'Belo Horizonte, MG',
    destination: 'Vitória, ES',
    distance: '524 km',
    estimatedArrival: '14:30',
    currentLocation: 'Governador Valadares, MG',
    status: 'em_transito',
    progress: 65,
    stages: {
      checklist: 'completed',
      departure: 'completed',
      transit: 'in_progress',
      arrival: 'pending',
      delivery: 'pending',
    },
    workTime: '6h 15min',
    lastUpdate: '13:45',
  },
  {
    id: 'OTE1758',
    driver: 'Maria Santos',
    vehicle: 'Volvo FH16 - DEF-5678',
    client: 'Petrobras Distribuidora',
    cargo: 'Combustível - 40t',
    origin: 'São Paulo, SP',
    destination: 'Rio de Janeiro, RJ',
    distance: '429 km',
    estimatedArrival: '16:00',
    currentLocation: 'Resende, RJ',
    status: 'atrasado',
    progress: 80,
    stages: {
      checklist: 'completed',
      departure: 'completed',
      transit: 'in_progress',
      arrival: 'pending',
      delivery: 'pending',
    },
    workTime: '7h 30min',
    lastUpdate: '13:42',
  },
  {
    id: 'JBX2021',
    driver: 'Carlos Oliveira',
    vehicle: 'Mercedes Actros - GHI-9012',
    client: 'Siderúrgica Nacional',
    cargo: 'Aço Laminado - 28t',
    origin: 'Volta Redonda, RJ',
    destination: 'Campinas, SP',
    distance: '312 km',
    estimatedArrival: '15:45',
    currentLocation: 'Chegando ao destino',
    status: 'chegando',
    progress: 95,
    stages: {
      checklist: 'completed',
      departure: 'completed',
      transit: 'completed',
      arrival: 'in_progress',
      delivery: 'pending',
    },
    workTime: '5h 45min',
    lastUpdate: '13:47',
  },
  {
    id: 'ABC4567',
    driver: 'Ana Costa',
    vehicle: 'Iveco Stralis - JKL-3456',
    client: 'Construtora Horizonte',
    cargo: 'Cimento - 32t',
    origin: 'Contagem, MG',
    destination: 'Uberlândia, MG',
    distance: '287 km',
    estimatedArrival: '17:20',
    currentLocation: 'Preparando saída',
    status: 'preparacao',
    progress: 15,
    stages: {
      checklist: 'completed',
      departure: 'in_progress',
      transit: 'pending',
      arrival: 'pending',
      delivery: 'pending',
    },
    workTime: '1h 20min',
    lastUpdate: '13:50',
  },
];

const STATUS_CONFIG = {
  preparacao: { color: '#6b7280', bg: '#f3f4f6', label: 'Preparação' },
  em_transito: { color: '#059669', bg: '#d1fae5', label: 'Em Trânsito' },
  atrasado: { color: '#dc2626', bg: '#fee2e2', label: 'Atrasado' },
  chegando: { color: '#f59e0b', bg: '#fef3c7', label: 'Chegando' },
  entregue: { color: '#10b981', bg: '#d1fae5', label: 'Entregue' },
};

const STAGE_CONFIG = {
  completed: { color: '#10b981', icon: '✓' },
  in_progress: { color: '#f59e0b', icon: '⏳' },
  pending: { color: '#6b7280', icon: '○' },
};

export default function ControlTower() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [routes] = useState(MOCK_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);

  // WebSocket integration for real-time updates
  const { isConnected, alerts } = useControlTowerWebSocket();

  // Cores para diferentes status
  const statusColors = {
    em_transito: '#10b981', // Verde
    carregando: '#f59e0b', // Amarelo
    entregue: '#6b7280', // Cinza
    alerta: '#ef4444', // Vermelho
  };

  // Carregar dados do dashboard
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Simular dados para demonstração
      const mockData: DashboardData = {
        summary: {
          totalVehicles: routes.length,
          activeRoutes: routes.filter((r) => r.status !== 'entregue').length,
          vehiclesInTransit: routes.filter((r) => r.status === 'em_transito').length,
          vehiclesLoading: routes.filter((r) => r.status === 'preparacao').length,
          vehiclesDelivered: routes.filter((r) => r.status === 'entregue').length,
          totalAlerts: routes.filter((r) => r.status === 'atrasado').length,
        },
        vehicles: routes.map((route) => ({
          id: route.id,
          driver: route.driver,
          plate: route.vehicle.split(' - ')[1] || route.vehicle,
          position: {
            lat: -23.5505 + (Math.random() - 0.5) * 10,
            lng: -46.6333 + (Math.random() - 0.5) * 10,
            timestamp: new Date().toISOString(),
          },
          status: route.status,
          route: {
            origin: route.origin,
            destination: route.destination,
            progress: route.progress,
          },
          cargo: route.cargo,
          speed: Math.floor(Math.random() * 80) + 40,
          lastUpdate: route.lastUpdate,
        })),
        routes: routes.map((route) => ({
          id: route.id,
          vehicleId: route.id,
          waypoints: [
            { lat: -23.5505, lng: -46.6333, name: route.origin },
            { lat: -22.9068, lng: -43.1729, name: route.destination },
          ],
          distance: route.distance,
          estimatedTime: route.estimatedArrival,
          alerts: [],
        })),
        alerts: routes
          .filter((r) => r.status === 'atrasado')
          .map((route) => ({
            type: 'delay',
            message: `Veículo ${route.vehicle} está atrasado`,
            severity: 'high',
            vehicleId: route.id,
            routeId: route.id,
          })),
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [routes, setDashboardData, setLoading]);

  // Atualizar hora atual
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  useEffect(() => {
    // Carregar Leaflet CSS dinamicamente
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      setMapReady(true);
    }
  }, []);

  // Filtrar rotas
  const filteredRoutes = routes.filter((route) => {
    const matchesStatus = statusFilter === 'todos' || route.status === statusFilter;
    const matchesSearch =
      route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedRouteData = routes.find((r) => r.id === selectedRoute);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_transito':
        return '🚛';
      case 'preparacao':
        return '📦';
      case 'entregue':
        return '✅';
      case 'atrasado':
        return '⚠️';
      default:
        return '🚚';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando Torre de Controle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🏗️ Torre de Controle</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Monitoramento em Tempo Real da Frota</p>
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
                <span className="text-xs text-gray-600">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Última atualização</p>
                <p className="font-medium text-gray-900">
                  {currentTime.toLocaleTimeString('pt-BR')}
                </p>
              </div>
              {alerts.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600">{alerts.length} alertas</span>
                </div>
              )}
              <a
                href="/control-tower/map"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                🗺️ Ver Mapa
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* KPIs Dashboard */}
        {dashboardData && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardData.summary.totalVehicles}
              </div>
              <div className="text-sm text-gray-600">Total Veículos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {dashboardData.summary.vehiclesInTransit}
              </div>
              <div className="text-sm text-gray-600">Em Trânsito</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-yellow-600">
                {dashboardData.summary.vehiclesLoading}
              </div>
              <div className="text-sm text-gray-600">Carregando</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-600">
                {dashboardData.summary.vehiclesDelivered}
              </div>
              <div className="text-sm text-gray-600">Entregues</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">
                {dashboardData.summary.activeRoutes}
              </div>
              <div className="text-sm text-gray-600">Rotas Ativas</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-red-600">
                {dashboardData.summary.totalAlerts}
              </div>
              <div className="text-sm text-gray-600">Alertas</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel de Veículos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">🚛 Frota Ativa</h2>

                  <div className="mt-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="todos">Todos os Status</option>
                      <option value="preparacao">Preparação</option>
                      <option value="em_transito">Em Trânsito</option>
                      <option value="atrasado">Atrasado</option>
                      <option value="chegando">Chegando</option>
                      <option value="entregue">Entregue</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredRoutes.map((route) => (
                  <div
                    key={route.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                      selectedRoute === route.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedRoute(route.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getStatusIcon(route.status)}</span>
                        <div>
                          <div className="font-medium text-sm">
                            {route.vehicle.split(' - ')[1] || route.vehicle}
                          </div>
                          <div className="text-xs text-gray-600">{route.driver}</div>
                        </div>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: statusColors[route.status as keyof typeof statusColors],
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <div>
                        {route.origin} → {route.destination}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Progresso: {route.progress}%</span>
                        <span>ETA: {route.estimatedArrival}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas */}
            {dashboardData && dashboardData.alerts.length > 0 && (
              <div className="bg-white rounded-lg shadow mt-4">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">⚠️ Alertas Ativos</h2>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {dashboardData.alerts.map((alert, index) => (
                    <div key={index} className="p-3 border-b">
                      <div className="flex items-start space-x-2">
                        <div
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: getSeverityColor(alert.severity) }}
                        ></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{alert.message}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Veículo: {alert.vehicleId} | Tipo: {alert.type}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mapa */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">🗺️ Mapa em Tempo Real</h2>
                {selectedRouteData && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                    <strong>{selectedRouteData.vehicle}</strong> - {selectedRouteData.driver}
                    <br />
                    Carga: {selectedRouteData.cargo} | Status: {selectedRouteData.status}
                  </div>
                )}
              </div>
              <div className="h-96 relative">
                {mapReady && dashboardData ? (
                  <MapContainer
                    center={[-23.5505, -46.6333]}
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Marcadores dos veículos */}
                    {dashboardData.vehicles
                      .filter(
                        (vehicle) => statusFilter === 'todos' || vehicle.status === statusFilter
                      )
                      .map((vehicle) => (
                        <Marker
                          key={vehicle.id}
                          position={[vehicle.position.lat, vehicle.position.lng]}
                        >
                          <Popup>
                            <div className="text-sm">
                              <strong>{vehicle.plate}</strong>
                              <br />
                              Motorista: {vehicle.driver}
                              <br />
                              Status: {vehicle.status}
                              <br />
                              Velocidade: {vehicle.speed} km/h
                              <br />
                              Carga: {vehicle.cargo}
                              <br />
                              Rota: {vehicle.route.origin} → {vehicle.route.destination}
                              <br />
                              Progresso: {vehicle.route.progress}%
                            </div>
                          </Popup>
                        </Marker>
                      ))}

                    {/* Rotas */}
                    {dashboardData.routes.map((route) => {
                      const vehicle = dashboardData.vehicles.find((v) => v.id === route.vehicleId);
                      if (!vehicle || (statusFilter !== 'todos' && vehicle.status !== statusFilter))
                        return null;

                      return (
                        <Polyline
                          key={route.id}
                          positions={route.waypoints.map((wp) => [wp.lat, wp.lng])}
                          pathOptions={{
                            color: statusColors[vehicle.status as keyof typeof statusColors],
                            weight: 3,
                            opacity: 0.7,
                          }}
                        />
                      );
                    })}
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Carregando mapa...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Painel de Detalhes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">📊 Detalhes da Rota</h2>
              </div>

              {selectedRouteData ? (
                <div className="p-6 space-y-6">
                  {/* Informações Básicas */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Informações Gerais</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>ID:</strong> {selectedRouteData.id}
                      </p>
                      <p>
                        <strong>Motorista:</strong> {selectedRouteData.driver}
                      </p>
                      <p>
                        <strong>Veículo:</strong> {selectedRouteData.vehicle}
                      </p>
                      <p>
                        <strong>Cliente:</strong> {selectedRouteData.client}
                      </p>
                      <p>
                        <strong>Carga:</strong> {selectedRouteData.cargo}
                      </p>
                      <p>
                        <strong>Distância:</strong> {selectedRouteData.distance}
                      </p>
                    </div>
                  </div>

                  {/* Status Atual */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Status Atual</h3>
                    <div
                      className="p-3 rounded-lg text-center font-medium"
                      style={{
                        color:
                          STATUS_CONFIG[selectedRouteData.status as keyof typeof STATUS_CONFIG]
                            .color,
                        backgroundColor:
                          STATUS_CONFIG[selectedRouteData.status as keyof typeof STATUS_CONFIG].bg,
                      }}
                    >
                      {STATUS_CONFIG[selectedRouteData.status as keyof typeof STATUS_CONFIG].label}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Localização:</strong> {selectedRouteData.currentLocation}
                    </p>
                  </div>

                  {/* Progresso das Etapas */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Progresso das Etapas</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedRouteData.stages).map(([stage, status]) => (
                        <div key={stage} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{stage.replace('_', ' ')}</span>
                          <div
                            className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                            style={{
                              backgroundColor:
                                STAGE_CONFIG[status as keyof typeof STAGE_CONFIG].color,
                            }}
                          >
                            {STAGE_CONFIG[status as keyof typeof STAGE_CONFIG].icon}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tempo de Trabalho */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tempo de Trabalho</h3>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Tempo Atual:</strong> {selectedRouteData.workTime}
                      </p>
                      <p className="text-sm">
                        <strong>ETA:</strong> {selectedRouteData.estimatedArrival}
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="space-y-2">
                    <button className="w-full p-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      📞 Contatar Motorista
                    </button>
                    <button className="w-full p-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      📍 Ver no Mapa
                    </button>
                    <button className="w-full p-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                      📋 Relatório Detalhado
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>Selecione uma rota para ver os detalhes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resumo Estatístico */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Rotas</p>
                <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
              </div>
              <div className="text-blue-600 text-2xl">🚛</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Trânsito</p>
                <p className="text-2xl font-bold text-green-600">
                  {routes.filter((r) => r.status === 'em_transito').length}
                </p>
              </div>
              <div className="text-green-600 text-2xl">✅</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">
                  {routes.filter((r) => r.status === 'atrasado').length}
                </p>
              </div>
              <div className="text-red-600 text-2xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chegando</p>
                <p className="text-2xl font-bold text-orange-600">
                  {routes.filter((r) => r.status === 'chegando').length}
                </p>
              </div>
              <div className="text-orange-600 text-2xl">🎯</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
