// Workbox + fallback SW para ambientes sem Workbox
// eslint-disable-next-line no-restricted-globals
try { importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'); } catch (e) {}

const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/globals.css',
  '/favicon.svg',
  '/logo-xyz.svg',
  '/icons/ejg-app-icon.png',
  '/icons/ejg-avatar.png',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  '/posts',
  '/dashboard',
  '/status',
  '/ai',
  '/chat'
];

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

if (self.workbox) {
  workbox.core.setCacheNameDetails({ prefix: 'ejg-optilog', suffix: 'v3' });
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Precaching declarativo
  workbox.precaching.precacheAndRoute(
    PRECACHE_ASSETS.map((url) => ({ url, revision: null })),
    { ignoreURLParametersMatching: [/.*/] }
  );

  // Navegação: NetworkFirst com fallback
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      networkTimeoutSeconds: 4
    })
  );

  // JS/CSS/Workers: SWR
  workbox.routing.registerRoute(
    ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'assets' })
  );

  // Imagens: CacheFirst com expiração
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })]
    })
  );

  // Fallback offline para documentos
  const FALLBACK_URL = '/offline.html';
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match(FALLBACK_URL);
    }
    return Response.error();
  });
} else {
  // Fallback manual quando Workbox não estiver disponível
  const CACHE_NAME = 'ejg-optilog-v3';
  const ASSETS_TO_CACHE = PRECACHE_ASSETS;

  self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)));
    self.skipWaiting();
  });

  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    const req = event.request;

    if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
      event.respondWith(
        fetch(req)
          .then(res => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy).catch(() => {}));
            return res;
          })
          .catch(async () => (await caches.match(req)) || (await caches.match('/offline.html')))
      );
      return;
    }

    event.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req)
          .then(res => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy).catch(() => {}));
            return res;
          })
          .catch(() => cached || caches.match('/offline.html'));
        return cached || fetchPromise;
      })
    );
  });
}