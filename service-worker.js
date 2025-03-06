const CACHE_NAME = "camera-app-cache-v1";
const CACHE_FILES = [
    "/",
    "/index.html",
    "/script.js",
    "/manifest.json",
    "/icon.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
