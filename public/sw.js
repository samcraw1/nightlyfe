/* Minimal offline-fallback service worker.
 * Navigations go network-first; when offline, the cached /offline page is
 * served. Icons and the manifest are pre-cached. Deliberately simple — no
 * runtime caching of app pages to avoid stale-content bugs during demos.
 */
const CACHE = "onyx-v1";
const PRECACHE = [
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/offline").then((res) => res || Response.error())
      )
    );
    return;
  }
  if (PRECACHE.includes(new URL(request.url).pathname)) {
    event.respondWith(
      caches.match(request).then((res) => res || fetch(request))
    );
  }
});
