const CACHE_NAME = "lotto-app-v1"; // palitan ang version number kapag may major changes
const urlsToCache = [
  "/3D-STL-Results/",         // 🔹 Root (palitan depende sa repo name mo)
  "/3D-STL-Results/index.html",
  "/3D-STL-Results/manifest.json",
  "/3D-STL-Results/icon.png",
  "/3D-STL-Results/pcsologo.png"
];

// Install event - cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // agad activate kahit may luma
});

// Activate event - delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // agad gamitin yung bagong SW
});

// Fetch event - online first strategy
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // kung online, i-update ang cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // kung offline, serve from cache
  );
});
