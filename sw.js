const CACHE = 'iron-protocol-v2';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // Bypass the SW entirely for:
  //  - non-GET requests (API POSTs to Sjinn / Anthropic / Firebase)
  //  - cross-origin requests (audio CDN, API hosts, Firebase)
  //  - range requests / media (iOS needs raw 206 responses to seek + play in background)
  if (req.method !== 'GET' ||
      url.origin !== self.location.origin ||
      req.headers.has('range') ||
      req.destination === 'audio' || req.destination === 'video') {
    return; // let the browser handle it natively
  }

  e.respondWith(
    caches.match(req).then(r => r || fetch(req))
  );
});
