var CACHE = 'study-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(clients.claim()); });
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate' || e.request.destination === 'document'){
    e.respondWith(
      fetch(e.request).then(function(r){
        var c = r.clone();
        caches.open(CACHE).then(function(x){ x.put(e.request, c); });
        return r;
      }).catch(function(){ return caches.match(e.request); })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(m){
        return m || fetch(e.request).then(function(r){
          var c = r.clone();
          caches.open(CACHE).then(function(x){ x.put(e.request, c); });
          return r;
        });
      })
    );
  }
});
