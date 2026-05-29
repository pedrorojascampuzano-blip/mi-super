const CACHE = 'mi-super-v21';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './config.js',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// Install: precache and skipWaiting immediately.
// Trade-off: user may get reloaded mid-edit, but the previous behavior
// (waiting for explicit tap on the update banner) trapped users on
// stale builds when the banner was visually clipped by the notch.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never cache live API calls
  if (url.hostname === 'generativelanguage.googleapis.com') return;
  if (url.hostname === 'api.deepseek.com') return;
  if (url.hostname === 'api.anthropic.com') return;
  if (url.hostname === 'api.openai.com') return;
  if (url.hostname.endsWith('.supabase.co')) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
            const clone = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
