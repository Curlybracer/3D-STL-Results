const CACHE_NAME = "lotto-app-v3"; 
const ASSETS_TO_CACHE = [
  "/", 
  "/index.html",
  "/manifest.json",
  "/Appicon.png",
  "/pcsologo.png",
  "/loading-bg.jpg",
  "/results.json" // ✅ para sa offline results
];

// Install event - cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event - clear old cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch event - serve cached files if available
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Gamitin yung cached JSON kung offline
      return cachedResponse || fetch(event.request).then((response) => {
        // Optional: i-update yung cache ng results.json kapag online
        if (event.request.url.includes("results.json")) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
