const CACHE_NAME = "villas-v3";

self.addEventListener('install', e => {
  console.log('Service Worker instalado');

  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/login.html',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png',
        '/icon-maskable.png'
      ]);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
