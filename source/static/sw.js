'use strict';

const version = 'daylight-1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== version).map(key => caches.delete(key))))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.host === 'nominatim.openstreetmap.org') { return; }
  
  event.respondWith(
    caches.match(event.request).then(cache => {
      if (!cache) {
        return fetch(event.request).then(response => {
          return caches.open(version).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      } else {
        return cache;
      }
    })
  )

});