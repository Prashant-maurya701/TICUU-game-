const CACHE_NAME = 'tic-tac-toe-v=0.0.2';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/my.js',
    '/manifest.json',
    '/AUDIO/welcome .mp3',
    '/AUDIO/game-draw-417465.mp3',
    '/AUDIO/start-game388923.mp3',
    '/AUDIO/new -game-270302.mp3',
    '/AUDIO/reset-game.mp3'
];

// Install service worker
self.addEventListener('install', event => {
    self.skipWaiting(); // force immediate activation
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch resources
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Update service worker
self.addEventListener('activate', event => {
    clients.claim(); // take control of all pages
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Notify users about app update
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
