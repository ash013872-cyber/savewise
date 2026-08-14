const VERSION = "v3";
const CACHE_NAME = `savewise-${VERSION}`;

const APP_FILES = [
  "./",
  "./index.html",
  "./icon.svg",
  "./manifest.webmanifest"
];

// Install the new version
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  // Activate the new worker immediately
  self.skipWaiting();
});

// Remove old SaveWise caches and take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith("savewise-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Always try the network first for HTML pages.
  // This prevents an old index.html from being stuck in cache.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });

          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match("./index.html");
          });
        })
    );

    return;
  }

  // For other files:
  // use cache first, then network.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const copy = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, copy);
        });

        return response;
      });
    })
  );
});
