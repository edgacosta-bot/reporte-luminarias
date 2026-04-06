const CACHE_NAME = "v1.0.0"; // 🔥 cambia esto cada vez que hagas cambios

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/login.html",
  "/manifest.json",
  "/icono-192.png",
  "/icono-512.png"
];

// INSTALACIÓN
self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 fuerza actualización inmediata

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ACTIVACIÓN (borra versiones viejas)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim(); // 🔥 toma control inmediato
});

// FETCH (estrategia inteligente)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
