const CACHE_NAME = 'carbonout-cache-v5';

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

// 🛠️ Forzar limpieza completa
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// ✅ Network-first para HTML, cache-first para todo lo demás
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const req = event.request;
  const isHTML = req.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached ||
        fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
      )
    );
  }
});

// Notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const client = clients.find((c) => 'focus' in c);
        if (client) return client.focus();
        return self.clients.openWindow('./index.html');
      })
  );
});