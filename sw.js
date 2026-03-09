const CACHE_NAME = 'hxf0223-v2';

const PRECACHE_URLS = [
  '/',
  '/assets/css/main.css',
  '/assets/img/pwa-icon-192.png',
  '/assets/img/pwa-icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn('Precache failed (non-fatal):', err);
        })
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // Stale-While-Revalidate: 先返回缓存（快速），同时后台更新缓存，下次访问即为最新内容
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            cache.put(event.request, response.clone()).catch(() => {});
          }
          return response;
        });
        return cached || fetchPromise;
      });
    })
  );
});
