// Service Worker for RMNA Street
// Caches images and assets for faster repeat visits

const CACHE_NAME = 'rmna-street-v1';
const RUNTIME_CACHE = 'rmna-street-runtime';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/logo-white.svg',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API calls (always fetch fresh)
  if (url.pathname.startsWith('/api')) return;

  // Cache strategy for images
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Return cached image if available
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fetch and cache new image
          return fetch(request).then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Network-first strategy for other assets
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request);
      })
  );
});
