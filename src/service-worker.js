self.importScripts("./js/cache-polyfill.js");

self.addEventListener("install", function(e) {
    e.waitUntil(
            caches.open("t485").then(function(cache) {
                return cache.addAll([
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
                    "/js/offline.js",
                    "/img/header.png",
                    "/img/index/index_1.png",
                    "/favicons/favicon-16x16.png",
                    "/fonts/typeface-raleway/index.css",
                    "/fonts/typeface-lora/index.css",

                ]).catch(err => console.log("Service Worker: Error while fetching assets", err));
                ;
            }),
    );
});
self.addEventListener("fetch", function(event) {
    console.log("==========================");
    console.log(event.request.url, event);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            console.log(response);
            return response || fetch(event.request);
        }),
    );
});