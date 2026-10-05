// Sin Riendas · permite abrir la app aunque la puerta se quede sin señal
const CACHE = 'sr-boletaje-v2';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const red = fetch(e.request).then(r => {
    const copia = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copia));
    return r;
  });
  const limite = new Promise((_, no) => setTimeout(() => no(new Error('lento')), 4000));
  e.respondWith(Promise.race([red, limite]).catch(() =>
    caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
