'use client';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

type Shipment = {
  id: string;
  lat?: number;
  lng?: number;
  location?: { lat?: number; lng?: number };
  geo?: { lat?: number; lng?: number };
  status?: string;
};

export default function LiveMap({
  shipments,
  showStops,
  showRoutes,
  showAlerts,
}: {
  shipments: Shipment[];
  showStops?: boolean;
  showRoutes?: boolean;
  showAlerts?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [liveShipments, setLiveShipments] = useState<Shipment[]>(shipments || []);

  // Atualiza shipments locais quando prop muda
  useEffect(() => {
    setLiveShipments(shipments || []);
  }, [shipments]);

  // Conexão com WS (Socket.IO) para atualizações em tempo real
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_IOT_WS_URL || 'ws://localhost:4010';
    let socket: ReturnType<typeof io> | null = null;
    try {
      socket = io(wsUrl, { transports: ['websocket'] });
      socket.on('shipments:init', (data: Shipment[]) => setLiveShipments(data || []));
      socket.on('shipments:changed', (data: Shipment[]) => setLiveShipments(data || []));
    } catch {}
    return () => {
      try {
        socket?.disconnect();
      } catch {}
    };
  }, []);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!ref.current || !token) return;

    const cssHref = 'https://api.mapbox.com/mapbox-gl-js/v2.16.1/mapbox-gl.css';
    const jsSrc = 'https://api.mapbox.com/mapbox-gl-js/v2.16.1/mapbox-gl.js';

    function ensureCss() {
      if (document.querySelector(`link[href="${cssHref}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      document.head.appendChild(link);
    }

    function ensureJs(): Promise<void> {
      if ((window as any).mapboxgl) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = jsSrc;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Falha ao carregar Mapbox GL JS'));
        document.body.appendChild(s);
      });
    }

    let map: any;
    (async () => {
      try {
        ensureCss();
        await ensureJs();
        const mapboxgl = (window as any).mapboxgl;
        mapboxgl.accessToken = token;
        map = new mapboxgl.Map({
          container: ref.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [-46.62529, -23.533773], // São Paulo
          zoom: 9,
        });
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        const coords = liveShipments
          .map((s) => ({
            id: s.id,
            lat: s.lat ?? s.location?.lat ?? s.geo?.lat,
            lng: s.lng ?? s.location?.lng ?? s.geo?.lng,
            status: s.status,
          }))
          .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number');

        // Fit bounds to markers
        if (coords.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          coords.forEach((c) => bounds.extend([c.lng!, c.lat!]));
          map.fitBounds(bounds, { padding: 40, maxZoom: 13 });
        }

        coords.forEach((c) => {
          const el = document.createElement('div');
          el.style.width = '10px';
          el.style.height = '10px';
          el.style.borderRadius = '50%';
          el.style.background =
            c.status === 'delayed' ? '#e53935' : c.status === 'in_transit' ? '#43a047' : '#1976d2';
          new mapboxgl.Marker(el).setLngLat([c.lng!, c.lat!]).addTo(map);
        });

        // Rotas via ORS (proxy) se habilitado
        if (showRoutes) {
          const base = coords.slice(0, 10).map((c) => [c.lng!, c.lat!]);
          let route = base;
          try {
            const url = process.env.NEXT_PUBLIC_ORS_PROXY_URL || 'http://localhost:4001/route';
            if (base.length >= 2) {
              const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coordinates: base }),
              });
              const json = await resp.json();
              if (resp.ok) {
                const r = (json?.features?.[0]?.geometry?.coordinates || []) as Array<any>;
                route = r.map((p) => [p[0], p[1]]);
              }
            }
          } catch {}

          if (route.length >= 2) {
            map.on('load', () => {
              map.addSource('route-line', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  geometry: { type: 'LineString', coordinates: route },
                },
              });
              map.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route-line',
                paint: { 'line-color': '#ffb300', 'line-width': 3 },
              });
            });
          }
        }
      } catch (e) {
        // noop: fallback visual já é tratado na página
      }
    })();

    return () => {
      try {
        (map as any)?.remove?.();
      } catch {}
    };
  }, [liveShipments, showStops, showRoutes, showAlerts]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
