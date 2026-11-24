// Service worker: guarda la app para jugar sin internet (modo solo y modo cantor).
const CACHE = 'loteria-v1';
const ARCHIVOS = [
  './', 'index.html', 'css/styles.css', 'manifest.webmanifest', 'icons/icon.svg',
  'js/app.js', 'js/data/cards.js', 'js/data/art.js',
  'js/engine/figures.js', 'js/engine/rng.js', 'js/engine/tablas.js', 'js/engine/ronda.js',
  'js/services/storage.js', 'js/services/voice.js', 'js/services/ads.js',
];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS))));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
