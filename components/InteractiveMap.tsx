'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps, Location, VehicleMarker } from '@/lib/google-maps';

interface InteractiveMapProps {
  vehicles?: VehicleMarker[];
  routes?: {
    origin: Location | string;
    destination: Location | string;
    waypoints?: Location[] | string[];
  }[];
  center?: Location;
  zoom?: number;
  height?: string;
  onVehicleClick?: (vehicleId: string) => void;
  onMapClick?: (location: Location) => void;
  showTraffic?: boolean;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  vehicles = [],
  routes = [],
  center = { lat: -23.5505, lng: -46.6333 }, // São Paulo
  zoom = 12,
  height = '400px',
  onVehicleClick,
  onMapClick,
  showTraffic = false,
  mapType = 'roadmap'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    service,
    initialize,
    createMap,
    displayRoute,
    addVehicleMarker,
    updateVehiclePosition,
    removeVehicleMarker,
    centerMap,
    fitBounds,
    clearMap
  } = useGoogleMaps();

  // Inicializar mapa
  useEffect(() => {
    const initMap = async () => {
      try {
        if (!mapRef.current) return;

        await initialize();
        
        const mapOptions: google.maps.MapOptions = {
          zoom,
          center,
          mapTypeId: mapType as google.maps.MapTypeId,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
          scaleControl: true
        };

        const map = createMap(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // Adicionar listener de clique no mapa
        if (onMapClick) {
          map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              onMapClick({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              });
            }
          });
        }

        // Inicializar camada de trânsito
        trafficLayerRef.current = new google.maps.TrafficLayer();
        
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Erro ao inicializar mapa:', err);
        setError('Erro ao carregar o mapa. Verifique sua conexão com a internet.');
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        clearMap();
      }
    };
  }, []);

  // Atualizar tipo de mapa
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setMapTypeId(mapType as google.maps.MapTypeId);
    }
  }, [mapType, isLoaded]);

  // Controlar camada de trânsito
  useEffect(() => {
    if (trafficLayerRef.current && mapInstanceRef.current && isLoaded) {
      if (showTraffic) {
        trafficLayerRef.current.setMap(mapInstanceRef.current);
      } else {
        trafficLayerRef.current.setMap(null);
      }
    }
  }, [showTraffic, isLoaded]);

  // Atualizar centro do mapa
  useEffect(() => {
    if (isLoaded) {
      centerMap(center, zoom);
    }
  }, [center, zoom, isLoaded]);

  // Gerenciar veículos no mapa
  useEffect(() => {
    if (!isLoaded) return;

    // Limpar marcadores existentes
    clearMap();

    // Adicionar novos marcadores
    vehicles.forEach(vehicle => {
      const marker = addVehicleMarker(vehicle);
      
      if (marker && onVehicleClick) {
        marker.addListener('click', () => {
          onVehicleClick(vehicle.id);
        });
      }
    });

    // Ajustar visualização para mostrar todos os veículos
    if (vehicles.length > 0) {
      const locations = vehicles.map(v => v.position);
      fitBounds(locations);
    }
  }, [vehicles, isLoaded, onVehicleClick]);

  // Exibir rotas
  useEffect(() => {
    if (!isLoaded) return;

    routes.forEach(async (route) => {
      try {
        await displayRoute(route.origin, route.destination, route.waypoints);
      } catch (err) {
        console.error('Erro ao exibir rota:', err);
      }
    });
  }, [routes, isLoaded]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg"
        style={{ height }}
      >
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full rounded-lg overflow-hidden border border-gray-200"
        style={{ height }}
      />
      
      {/* Controles do mapa */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
        <div className="text-xs text-gray-600 font-medium">Controles</div>
        
        {/* Indicador de veículos */}
        {vehicles.length > 0 && (
          <div className="text-xs text-gray-500">
            {vehicles.length} veículo{vehicles.length !== 1 ? 's' : ''} ativo{vehicles.length !== 1 ? 's' : ''}
          </div>
        )}
        
        {/* Indicador de rotas */}
        {routes.length > 0 && (
          <div className="text-xs text-gray-500">
            {routes.length} rota{routes.length !== 1 ? 's' : ''} exibida{routes.length !== 1 ? 's' : ''}
          </div>
        )}
        
        {/* Status de trânsito */}
        {showTraffic && (
          <div className="flex items-center text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Trânsito ativo
          </div>
        )}
      </div>
      
      {/* Legenda de status dos veículos */}
      {vehicles.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="text-xs text-gray-600 font-medium mb-2">Status dos Veículos</div>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Ativo</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Parado</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Offline</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;