const CACHE_NAME = "lotto-app-v5"; // 🔄 increment version para mag-refresh cache
const urlsToCache = [
  "/",
  "/index.html",
  "/loading-bg.jpg",   // ✅ Loading screen background
  "/Appicon.png",
  "/pcsologo.png",
  "/manifest.json",
  "/results.json"
];

// ✅ Install event → cache lahat ng files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ✅ Activate event → tanggalin luma na cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      );
    })
  );
});

// ✅ Fetch event → serve cached files kapag offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
