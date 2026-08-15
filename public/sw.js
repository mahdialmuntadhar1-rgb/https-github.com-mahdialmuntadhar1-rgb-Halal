// HALAL / ZAWAJ PWA service worker.
// Cache only same-origin static shell assets. Never cache API or auth data.
const CACHE_NAME = 'halal-zawaj-v2-static';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/pwa-icon-512.jpg',
  '/privacy-policy.html',
  '/terms-of-service.html',
];

function isStaticAssetUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== self.location.origin) return false;
    const path = parsed.pathname;
    if (path === '/' || STATIC_ASSETS.includes(path)) return true;
    if (path.startsWith('/pwa-icon') || path.startsWith('/icons/')) return true;
    return false;
  } catch {
    return false;
  }
}

function shouldBypassCache(request) {
  if (request.method !== 'GET') return true;
  if (request.headers.has('Authorization')) return true;
  try {
    const parsed = new URL(request.url);
    if (parsed.origin !== self.location.origin) return true;
    if (parsed.pathname.startsWith('/api')) return true;
    if (parsed.pathname.includes('/auth/')) return true;
    return false;
  } catch {
    return true;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => undefined);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (shouldBypassCache(event.request)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && isStaticAssetUrl(event.request.url)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html').then((page) => page || caches.match('/'));
          }
          return undefined;
        });
      })
  );
});
