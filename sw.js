// ==========================================

// Newspaper Dashboard PWA

// Service Worker Ver.2.0

// ==========================================

const CACHE_NAME = "nikkei-news-pwa-v1";

const urlsToCache = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./manifest.json"

];

// インストール

self.addEventListener("install", event => {

    console.log("Service Worker Installed");

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(urlsToCache);

        })

    );

});

// 通信

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response || fetch(event.request);

        })

    );

});

// 更新

self.addEventListener("activate", event => {

    console.log("Service Worker Activated");

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

});