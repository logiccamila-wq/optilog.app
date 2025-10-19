# LiveMap (Mapbox) Kit

Componente de mapa para rastrear remessas em tempo real.

## Uso
1. Copie `LiveMap.template.tsx` para `components/LiveMap.tsx`.
2. Garanta `NEXT_PUBLIC_MAPBOX_TOKEN` no `.env.local`.
3. Renderize:
```tsx
<LiveMap shipments={[{ id: '1', lat: -23.55, lng: -46.63 }]}
         showRoute
         showStops />
```

## Integração
- Combine com backend `/shipments` e proxy `/route` (ORS).
- Opcional: stream via Socket.IO usando `shipments:changed`.