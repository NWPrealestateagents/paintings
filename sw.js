// Keeps the slideshow working with no internet after the first visit.
var CACHE = 'nie-slideshow-v1';
var ASSETS = [
 "slideshow.html",
 "manifest.webmanifest",
 "apple-touch-icon.png",
 "favicon.svg",
 "full-2362.jpg",
 "full-2331.jpg",
 "full-2338.jpg",
 "full-2330.jpg",
 "full-2342.jpg",
 "full-2349.jpg",
 "full-2335.jpg",
 "full-2333.jpg",
 "full-2360.jpg",
 "full-2354.jpg",
 "full-2341.jpg",
 "full-2347.jpg",
 "full-2358.jpg",
 "full-2361.jpg",
 "full-2339.jpg",
 "full-2344.jpg",
 "full-2332.jpg",
 "full-2366.jpg",
 "full-2352.jpg",
 "full-2348.jpg",
 "full-2340.jpg",
 "full-2355.jpg",
 "full-2363.jpg",
 "full-2336.jpg",
 "full-2345.jpg",
 "full-2350.jpg",
 "full-2351.jpg",
 "full-2343.jpg",
 "full-2346.jpg",
 "full-2353.jpg",
 "full-2334.jpg",
 "full-2337.jpg",
 "full-2367.jpg"
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.headers.has('range')) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(r).then(function (hit) {
      var net = fetch(r).then(function (res) { if (res && res.ok) c.put(r, res.clone()); return res; }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
