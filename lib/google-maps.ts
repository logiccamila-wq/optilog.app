// Serviço de integração com Google Maps Platform
// Inclui Maps API, Directions API, Geolocation API, Distance Matrix API e Geocoding API

export interface Location {
  lat: number;
  lng: number;
}

export interface RoutePoint {
  location: Location;
  address: string;
  type: 'origin' | 'destination' | 'waypoint';
  estimatedTime?: string;
  actualTime?: string;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  steps: google.maps.DirectionsStep[];
  polyline: string;
}

export interface VehicleMarker {
  id: string;
  position: Location;
  title: string;
  status: 'active' | 'idle' | 'offline';
  speed?: number;
  heading?: number;
}

export class GoogleMapsService {
  private map: google.maps.Map | null = null;
  private directionsService: google.maps.DirectionsService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  private distanceMatrixService: google.maps.DistanceMatrixService | null = null;
  private markers: Map<string, google.maps.Marker> = new Map();
  private isLoaded = false;

  constructor(private apiKey: string) {}

  // Inicializar Google Maps
  async initialize(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Carregar Google Maps API
      await this.loadGoogleMapsAPI();
      
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#2563eb',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      });
      this.geocoder = new google.maps.Geocoder();
      this.distanceMatrixService = new google.maps.DistanceMatrixService();
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Erro ao inicializar Google Maps:', error);
      throw error;
    }
  }

  // Carregar Google Maps API dinamicamente
  private loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar Google Maps API'));
      
      document.head.appendChild(script);
    });
  }

  // Criar mapa
  createMap(container: HTMLElement, options?: google.maps.MapOptions): google.maps.Map {
    if (!this.isLoaded) {
      throw new Error('Google Maps não foi inicializado');
    }

    const defaultOptions: google.maps.MapOptions = {
      zoom: 12,
      center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      ...options
    };

    this.map = new google.maps.Map(container, defaultOptions);
    
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(this.map);
    }

    return this.map;
  }

  // Obter localização atual
  getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Erro de geolocalização: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Calcular rota entre pontos
  async calculateRoute(
    origin: Location | string,
    destination: Location | string,
    waypoints?: Location[] | string[]
  ): Promise<RouteInfo> {
    if (!this.directionsService) {
      throw new Error('Directions Service não inicializado');
    }

    const waypointsFormatted = waypoints?.map(wp => ({
      location: wp,
      stopover: true
    }));

    return new Promise((resolve, reject) => {
      this.directionsService!.route(
        {
          origin,
          destination,
          waypoints: waypointsFormatted,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
          avoidHighways: false,
          avoidTolls: false
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0];
            const leg = route.legs[0];
            
            resolve({
              distance: leg.distance?.text || '',
              duration: leg.duration?.text || '',
              steps: leg.steps,
              polyline: route.overview_polyline
            });
          } else {
            reject(new Error(`Erro ao calcular rota: ${status}`));
          }
        }
      );
    });
  }

  // Exibir rota no mapa
  displayRoute(
    origin: Location | string,
    destination: Location | string,
    waypoints?: Location[] | string[]
  ): Promise<void> {
    if (!this.directionsService || !this.directionsRenderer) {
      throw new Error('Directions Service não inicializado');
    }

    const waypointsFormatted = waypoints?.map(wp => ({
      location: wp,
      stopover: true
    }));

    return new Promise((resolve, reject) => {
      this.directionsService!.route(
        {
          origin,
          destination,
          waypoints: waypointsFormatted,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            this.directionsRenderer!.setDirections(result);
            resolve();
          } else {
            reject(new Error(`Erro ao exibir rota: ${status}`));
          }
        }
      );
    });
  }

  // Geocodificação: converter endereço em coordenadas
  async geocodeAddress(address: string): Promise<Location> {
    if (!this.geocoder) {
      throw new Error('Geocoder não inicializado');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          reject(new Error(`Erro na geocodificação: ${status}`));
        }
      });
    });
  }

  // Geocodificação reversa: converter coordenadas em endereço
  async reverseGeocode(location: Location): Promise<string> {
    if (!this.geocoder) {
      throw new Error('Geocoder não inicializado');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error(`Erro na geocodificação reversa: ${status}`));
        }
      });
    });
  }

  // Calcular matriz de distâncias
  async calculateDistanceMatrix(
    origins: (Location | string)[],
    destinations: (Location | string)[]
  ): Promise<google.maps.DistanceMatrixResponse> {
    if (!this.distanceMatrixService) {
      throw new Error('Distance Matrix Service não inicializado');
    }

    return new Promise((resolve, reject) => {
      this.distanceMatrixService!.getDistanceMatrix(
        {
          origins,
          destinations,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        },
        (response, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response) {
            resolve(response);
          } else {
            reject(new Error(`Erro na matriz de distâncias: ${status}`));
          }
        }
      );
    });
  }

  // Adicionar marcador de veículo
  addVehicleMarker(vehicle: VehicleMarker): google.maps.Marker | null {
    if (!this.map) return null;

    const marker = new google.maps.Marker({
      position: vehicle.position,
      map: this.map,
      title: vehicle.title,
      icon: {
        url: this.getVehicleIcon(vehicle.status),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      }
    });

    // Info window com detalhes do veículo
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0;">${vehicle.title}</h3>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${this.getStatusLabel(vehicle.status)}</p>
          ${vehicle.speed ? `<p style="margin: 4px 0;"><strong>Velocidade:</strong> ${vehicle.speed} km/h</p>` : ''}
          <p style="margin: 4px 0;"><strong>Posição:</strong> ${vehicle.position.lat.toFixed(6)}, ${vehicle.position.lng.toFixed(6)}</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    this.markers.set(vehicle.id, marker);
    return marker;
  }

  // Atualizar posição do veículo
  updateVehiclePosition(vehicleId: string, position: Location): void {
    const marker = this.markers.get(vehicleId);
    if (marker) {
      marker.setPosition(position);
    }
  }

  // Remover marcador de veículo
  removeVehicleMarker(vehicleId: string): void {
    const marker = this.markers.get(vehicleId);
    if (marker) {
      marker.setMap(null);
      this.markers.delete(vehicleId);
    }
  }

  // Centralizar mapa em uma localização
  centerMap(location: Location, zoom?: number): void {
    if (this.map) {
      this.map.setCenter(location);
      if (zoom) {
        this.map.setZoom(zoom);
      }
    }
  }

  // Ajustar mapa para mostrar todos os marcadores
  fitBounds(locations: Location[]): void {
    if (!this.map || locations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend(location);
    });

    this.map.fitBounds(bounds);
  }

  // Obter ícone do veículo baseado no status
  private getVehicleIcon(status: string): string {
    const icons = {
      active: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981">
          <path d="M8.5 12.5L11 15l5-5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      `),
      idle: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
      `),
      offline: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444">
          <path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      `)
    };

    return icons[status as keyof typeof icons] || icons.offline;
  }

  // Obter label do status
  private getStatusLabel(status: string): string {
    const labels = {
      active: 'Ativo',
      idle: 'Parado',
      offline: 'Offline'
    };

    return labels[status as keyof typeof labels] || 'Desconhecido';
  }

  // Limpar mapa
  clearMap(): void {
    // Limpar marcadores
    this.markers.forEach(marker => marker.setMap(null));
    this.markers.clear();

    // Limpar direções
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any);
    }
  }

  // Destruir instância
  destroy(): void {
    this.clearMap();
    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;
    this.geocoder = null;
    this.distanceMatrixService = null;
  }
}

// Instância singleton do serviço
let googleMapsService: GoogleMapsService | null = null;

export const getGoogleMapsService = (apiKey?: string): GoogleMapsService => {
  if (!googleMapsService) {
    const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo-key';
    googleMapsService = new GoogleMapsService(key);
  }
  return googleMapsService;
};

// Hook para usar Google Maps no React
export const useGoogleMaps = (apiKey?: string) => {
  const service = getGoogleMapsService(apiKey);
  
  return {
    service,
    initialize: () => service.initialize(),
    createMap: (container: HTMLElement, options?: google.maps.MapOptions) => 
      service.createMap(container, options),
    getCurrentLocation: () => service.getCurrentLocation(),
    calculateRoute: (origin: Location | string, destination: Location | string, waypoints?: Location[] | string[]) =>
      service.calculateRoute(origin, destination, waypoints),
    displayRoute: (origin: Location | string, destination: Location | string, waypoints?: Location[] | string[]) =>
      service.displayRoute(origin, destination, waypoints),
    geocodeAddress: (address: string) => service.geocodeAddress(address),
    reverseGeocode: (location: Location) => service.reverseGeocode(location),
    addVehicleMarker: (vehicle: VehicleMarker) => service.addVehicleMarker(vehicle),
    updateVehiclePosition: (vehicleId: string, position: Location) => 
      service.updateVehiclePosition(vehicleId, position),
    removeVehicleMarker: (vehicleId: string) => service.removeVehicleMarker(vehicleId),
    centerMap: (location: Location, zoom?: number) => service.centerMap(location, zoom),
    fitBounds: (locations: Location[]) => service.fitBounds(locations),
    clearMap: () => service.clearMap()
  };
};