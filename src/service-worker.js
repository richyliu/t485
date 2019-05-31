self.importScripts("./js/cache-polyfill.js");


let cacheFiles = [
    "/",
    "/index.html",
    "/css/bootstrap.min.css",
    "/css/t485.css",
    "/css/theme.css",
    "/css/bootstrap-select.min.css",
    "/js/jquery.min.js",
    "/js/popper.min.js",
    "/js/bootstrap.min.js",
    "/js/bootstrap-select.min.js",
    "/js/utils.js",
    "/js/logger.js",
    "/js/t485.js",
    "/img/header.png",
    "/img/index/index_1.png",
    "/favicons/favicon-16x16.png",
    "/fonts/typeface-lora/index.css",
    "/fonts/typeface-raleway/index.css"
];

for (let i = 100; i < 900; i += 100) {
    cacheFiles.push([
        `/fonts/typeface-raleway/files/raleway-latin-${i}.woff`,
        `/fonts/typeface-raleway/files/raleway-latin-${i}.woff2`,
        `/fonts/typeface-raleway/files/raleway-latin-${i}italic.woff`,
        `/fonts/typeface-raleway/files/raleway-latin-${i}italic.woff2`
    ]);
    if (i === 400 || i === 700) {
        cacheFiles.push([
            `/fonts/typeface-lora/files/lora-latin-${i}.woff`,
            `/fonts/typeface-lora/files/lora-latin-${i}.woff2`,
            `/fonts/typeface-lora/files/lora-latin-${i}italic.woff`,
            `/fonts/typeface-lora/files/lora-latin-${i}italic.woff2`
        ]);
    }
}
console.log(cacheFiles);
self.addEventListener("install", function(e) {
    e.waitUntil(
            caches.open("t485").then(function(cache) {
                return cache.addAll(cacheFiles)
                        .catch(err => console.log("Service Worker: Error while fetching assets", err));

            }),
    );
});
self.addEventListener("fetch", function(event) {

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }),
    );
});