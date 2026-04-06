const CACHE_NAME = "v1.0.1"; // 🔥 cambia versión para forzar actualización

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/login.html",
  "/manifest.json",
  "/icono-192.png",
  "/icono-512.png"
];

// 🔹 INSTALACIÓN
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 🔹 ACTIVACIÓN (limpia versiones viejas)
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

  self.clients.claim();
});

// 🔹 FETCH (AJUSTE CLAVE AQUÍ)
self.addEventListener("fetch", event => {

  const url = new URL(event.request.url);

  // 🚫 NO CACHEAR PÁGINAS DINÁMICAS (CRÍTICO)
  if (
    url.pathname.includes("mostrar_qr.html") ||
    url.pathname.includes("validar.html") ||
    url.pathname.includes("credencial_trabajador.html") ||
    url.pathname.includes("acceso_trabajador.html")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 🔥 comportamiento actual (network-first con fallback)
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(() => caches.match(event.request))
  );
});
