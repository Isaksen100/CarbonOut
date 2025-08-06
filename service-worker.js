const CACHE_NAME = 'carbonout-cache-v2';

const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './icons/logo-192.png',
  './icons/logo-512.png',
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

// Instalación: cachea archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting())
  );
});

// Activación: limpia cachés viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// Interceptar solicitudes: cache-first
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).then((response) => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, resClone);
        });
        return response;
      }).catch(() => {
        // Opcional: fallback si quieres
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Manejo de clics en notificaciones
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