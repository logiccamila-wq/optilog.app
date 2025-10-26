// Workbox template for CI injectManifest. This file will be transformed into public/sw.js in CI.
// It mirrors the runtime caching setup used locally, but relies on self.__WB_MANIFEST for precache.

// eslint-disable-next-line no-restricted-globals
try { importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'); } catch (e) {}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

if (self.workbox) {
  workbox.core.setCacheNameDetails({ prefix: 'ejg-optilog', suffix: 'v3' });
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // The manifest is injected by Workbox CLI during CI
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST, { ignoreURLParametersMatching: [/.*/] });

  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({ cacheName: 'pages', networkTimeoutSeconds: 4 })
  );

  workbox.routing.registerRoute(
    ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'assets' })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })]
    })
  );

  const FALLBACK_URL = '/offline.html';
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') return caches.match(FALLBACK_URL);
    return Response.error();
  });
}