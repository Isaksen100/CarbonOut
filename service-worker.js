const CACHE_NAME = 'carbonout-cache-v3'; // ⬅️ IMPORTANTE: actualiza el nombre cada vez que subas nueva versión

const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './icons/logo-192.png',
  './icons/logo-512.png',
  './images/bg-nature.jpg',
  './images/transporte.jpg',
  './images/energia.jpg',
  './images/alimentacion.jpg',
  './images/consumo.jpg',
  './acciones.html',
  './acciones.js',
  './perfil.html',
  './perfil-script.js',
  './ranking.html',
  './ranking-script.js',
  './signup.html',
  './login.html',
  './script.js',
  './lang.js',
  './notifications.js'
];

// Instalación: cachea los archivos clave
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting())
  );
});

// Activación: elimina versiones antiguas de caché
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// Interceptar fetch: estrategia cache-first + actualiza en background
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback si estás navegando sin conexión
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    let client = allClients.find(c => 'focus' in c);
    if (client) {
      client.focus();
    } else if (self.clients.openWindow) {
      await self.clients.openWindow('./index.html');
    }
  })());
});