const CACHE_NAME = 'sortedsupported-v1';

const APP_SHELL_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
];

const ESSENTIAL_REMOTE_RESOURCES = [
  'https://www.sortedsupported.org.uk/',
  'https://www.sortedsupported.org.uk/im-a-professional/',
  'https://www.sortedsupported.org.uk/home-page/need-urgent-help/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all([
        cache.addAll(APP_SHELL_ASSETS).catch(() => null),
        Promise.all(
          ESSENTIAL_REMOTE_RESOURCES.map((url) =>
            fetch(url, { mode: 'no-cors' })
              .then((response) => cache.put(url, response))
              .catch(() => null)
          )
        ),
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request)
          .then((networkResponse) => {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            return networkResponse;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  if (ESSENTIAL_REMOTE_RESOURCES.some((resource) => request.url.startsWith(resource))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
  }
});
