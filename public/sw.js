// Service Worker for Denger.in (PWA - SCRUM-204)
// Privacy & Caching Rules from 03-frontend.md §5

const CACHE_NAME_STATIC = "dengerin-static-v1";
const CACHE_NAME_PAGES = "dengerin-pages-v1";

const PRECACHE_ASSETS = [
  "/offline",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico",
];

// 1. Install & precache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate & cleanup obsolete caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME_STATIC && key !== CACHE_NAME_PAGES) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Privacy & Network routing rules
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // CRITICAL PRIVACY RULE (§5):
  // All API requests, socket.io, and authenticated mental health routes MUST BE NETWORK-ONLY
  const isSensitiveOrDynamic =
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/socket.io/") ||
    url.pathname.startsWith("/konseling") ||
    url.pathname.startsWith("/curhat") ||
    url.pathname.startsWith("/circle") ||
    url.pathname.startsWith("/cek-mandiri") ||
    url.pathname.startsWith("/genta") ||
    url.pathname.startsWith("/akun") ||
    url.pathname.startsWith("/psikolog") ||
    url.pathname.startsWith("/admin");

  if (isSensitiveOrDynamic) {
    // Network-only, strictly do NOT cache
    return;
  }

  // A. Static Assets: Cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME_STATIC).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // B. Public Pages (/masuk, /offline): Stale-while-revalidate
  if (url.pathname === "/masuk" || url.pathname === "/offline") {
    event.respondWith(
      caches.open(CACHE_NAME_PAGES).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cached || caches.match("/offline"));

          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // C. HTML Navigation: Network with offline fallback to /offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/offline");
      })
    );
  }
});

// 4. Message listener (e.g. for clearing cache on logout)
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "CACHE_CLEAR") {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
});
