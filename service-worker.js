const CACHE_NAME = 'carbonout-cache-v4';

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

// Instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting())
  );
});

// Activación
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

// Fetch: cache-first
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

// 💡 Forzar actualización inmediata
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});