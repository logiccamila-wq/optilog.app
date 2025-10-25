// Ambient types for google.maps (placed under lib/ so it's included by tsconfig)
// Simplified ambient for google.maps: treat the maps namespace as any so
// consumer files can use runtime symbols without full upstream typings.
declare namespace google {
  // Provide a minimal namespace for type-level usage (map types, constructors)
  namespace maps {
    const Map: any;
    type Map = any;
    const Marker: any;
    type Marker = any;
    const TrafficLayer: any;
    type TrafficLayer = any;
    const DirectionsService: any;
    type DirectionsService = any;
    const DirectionsRenderer: any;
    type DirectionsRenderer = any;
    const Geocoder: any;
    type Geocoder = any;
    const DistanceMatrixService: any;
    type DistanceMatrixService = any;
    const InfoWindow: any;
    type InfoWindow = any;
    const LatLngBounds: any;
    type LatLngBounds = any;
    const Size: any;
    type Size = any;
    const Point: any;
    type Point = any;

    type MapOptions = any;
    type MapMouseEvent = any;
    type DirectionsStep = any;
    type DistanceMatrixResponse = any;
    type DirectionsResult = any;
    type LatLngLiteral = { lat: number; lng: number };

    type MapTypeId = any;
    type DirectionsStatus = any;
    type GeocoderStatus = any;
    type UnitSystem = any;
    type DistanceMatrixStatus = any;
    type TravelMode = any;
    const MapTypeId: any;
    const DirectionsStatus: any;
    const GeocoderStatus: any;
    const UnitSystem: any;
    const DistanceMatrixStatus: any;
    const TravelMode: any;
  }
}

declare global {
  interface Window {
    google: any;
  }
}
