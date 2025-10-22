'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useControlTowerWebSocket } from '@/hooks/useWebSocket';
import InteractiveMap from '@/components/InteractiveMap';
import { VehicleMarker, Location } from '@/lib/google-maps';

// Dados simulados de veículos
const mockVehicles = [
  {
    id: 'VEH001',
    driver: 'João Silva',
    plate: 'ABC-1234',
    status: 'active' as const,
    speed: 45,
    location: { lat: -23.5505, lng: -46.6333 },
    route: 'MLG1023',
    lastUpdate: new Date().toLocaleTimeString()
  },
  {
    id: 'VEH002', 
    driver: 'Maria Santos',
    plate: 'DEF-5678',
    status: 'idle' as const,
    speed: 0,
    location: { lat: -23.5615, lng: -46.6565 },
    route: 'OTE1758',
    lastUpdate: new Date().toLocaleTimeString()
  },
  {
    id: 'VEH003',
    driver: 'Carlos Oliveira',
    plate: 'GHI-9012',
    status: 'active' as const,
    speed: 38,
    location: { lat: -23.5329, lng: -46.6395 },
    route: 'JBX2021',
    lastUpdate: new Date().toLocaleTimeString()
  }
];

export default function ControlTowerMap() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState(mockVehicles[0]);
  const [mapView, setMapView] = useState<'roadmap' | 'satellite'>('roadmap');
  const [showRoutes, setShowRoutes] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: -23.5505, lng: -46.6333 });
  
  const { isConnected, vehicles: wsVehicles } = useControlTowerWebSocket();

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        speed: vehicle.status === 'active' ? Math.floor(Math.random() * 60) + 20 : 0,
        location: {
          lat: vehicle.location.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.location.lng + (Math.random() - 0.5) * 0.001
        },
        lastUpdate: new Date().toLocaleTimeString()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'idle': return 'Parado';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  // Converter veículos para formato do mapa
  const vehicleMarkers: VehicleMarker[] = vehicles.map(vehicle => ({
    id: vehicle.id,
    position: vehicle.location,
    title: `${vehicle.plate} - ${vehicle.driver}`,
    status: vehicle.status,
    speed: vehicle.speed,
    heading: 0 // Pode ser calculado baseado no movimento
  }));

  // Rotas simuladas
  const routes = showRoutes ? [
    {
      origin: vehicles[0].location,
      destination: { lat: -23.5329, lng: -46.6395 },
      waypoints: [{ lat: -23.5615, lng: -46.6565 }]
    }
  ] : [];

  const handleVehicleClick = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setMapCenter(vehicle.location);
    }
  };

  const handleMapClick = (location: Location) => {
    console.log('Clique no mapa:', location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/control-tower"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Mapa de Monitoramento</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </div>
              
              <div className="text-sm text-gray-600">
                Última atualização: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Painel lateral - Lista de veículos */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Veículos Ativos</h2>
            <p className="text-sm text-gray-600">{vehicles.length} veículos monitorados</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedVehicle.id === vehicle.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => handleVehicleClick(vehicle.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(vehicle.status)}`}></div>
                    <span className="font-medium text-gray-900">{vehicle.plate}</span>
                  </div>
                  <span className="text-xs text-gray-500">{vehicle.lastUpdate}</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Motorista:</strong> {vehicle.driver}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Rota:</strong> {vehicle.route}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Status:</strong> {getStatusLabel(vehicle.status)}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Velocidade:</strong> {vehicle.speed} km/h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área principal - Mapa */}
        <div className="flex-1 relative">
          {/* Controles do mapa */}
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setMapView('roadmap')}
                className={`px-3 py-1 text-sm rounded ${
                  mapView === 'roadmap' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mapa
              </button>
              <button
                onClick={() => setMapView('satellite')}
                className={`px-3 py-1 text-sm rounded ${
                  mapView === 'satellite' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Satélite
              </button>
            </div>
            
            <div className="space-y-1">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showRoutes}
                  onChange={(e) => setShowRoutes(e.target.checked)}
                  className="mr-2"
                />
                Mostrar Rotas
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showTraffic}
                  onChange={(e) => setShowTraffic(e.target.checked)}
                  className="mr-2"
                />
                Mostrar Trânsito
              </label>
            </div>
          </div>

          {/* Mapa Interativo */}
          <InteractiveMap
            vehicles={vehicleMarkers}
            routes={routes}
            center={mapCenter}
            zoom={13}
            height="100%"
            onVehicleClick={handleVehicleClick}
            onMapClick={handleMapClick}
            showTraffic={showTraffic}
            mapType={mapView}
          />

          {/* Painel de informações do veículo selecionado */}
          <div className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Veículo Selecionado
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Placa:</span>
                <span className="text-sm font-medium">{selectedVehicle.plate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Motorista:</span>
                <span className="text-sm font-medium">{selectedVehicle.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rota:</span>
                <span className="text-sm font-medium">{selectedVehicle.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(selectedVehicle.status)}`}></div>
                  <span className="text-sm font-medium">{getStatusLabel(selectedVehicle.status)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Velocidade:</span>
                <span className="text-sm font-medium">{selectedVehicle.speed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Coordenadas:</span>
                <span className="text-sm font-medium">
                  {selectedVehicle.location.lat.toFixed(4)}, {selectedVehicle.location.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Estatísticas em tempo real */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Estatísticas</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-green-800 font-medium">Ativos</div>
                  <div className="text-green-600">{vehicles.filter(v => v.status === 'active').length}</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="text-yellow-800 font-medium">Parados</div>
                  <div className="text-yellow-600">{vehicles.filter(v => v.status === 'idle').length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}