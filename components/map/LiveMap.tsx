"use client";
import { useEffect, useRef } from 'react';

type Shipment = { id: string; lat?: number; lng?: number; location?: { lat?: number; lng?: number }; geo?: { lat?: number; lng?: number }; status?: string };

export default function LiveMap({ shipments, showStops, showRoutes, showAlerts }: { shipments: Shipment[]; showStops?: boolean; showRoutes?: boolean; showAlerts?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);

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

        const coords = shipments
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
          el.style.background = c.status === 'delayed' ? '#e53935' : c.status === 'in_transit' ? '#43a047' : '#1976d2';
          new mapboxgl.Marker(el).setLngLat([c.lng!, c.lat!]).addTo(map);
        });

        // Options (stops/routes/alerts) can be layered later; placeholder for visual toggles
        if (showRoutes) {
          // Example placeholder line
          const route = coords.slice(0, 5).map((c) => [c.lng!, c.lat!]);
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
      try { (map as any)?.remove?.(); } catch {}
    };
  }, [shipments, showStops, showRoutes, showAlerts]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}