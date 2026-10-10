// Keeps the slideshow working with no internet after the first visit.
var CACHE = 'nie-slideshow-v1';
var ASSETS = [
 "slideshow.html",
 "manifest.webmanifest",
 "apple-touch-icon.png",
 "favicon.svg",
 "images/full/2362.jpg",
 "images/full/2331.jpg",
 "images/full/2338.jpg",
 "images/full/2330.jpg",
 "images/full/2342.jpg",
 "images/full/2349.jpg",
 "images/full/2335.jpg",
 "images/full/2333.jpg",
 "images/full/2360.jpg",
 "images/full/2354.jpg",
 "images/full/2341.jpg",
 "images/full/2347.jpg",
 "images/full/2358.jpg",
 "images/full/2361.jpg",
 "images/full/2339.jpg",
 "images/full/2344.jpg",
 "images/full/2332.jpg",
 "images/full/2366.jpg",
 "images/full/2352.jpg",
 "images/full/2348.jpg",
 "images/full/2340.jpg",
 "images/full/2355.jpg",
 "images/full/2363.jpg",
 "images/full/2336.jpg",
 "images/full/2345.jpg",
 "images/full/2350.jpg",
 "images/full/2351.jpg",
 "images/full/2343.jpg",
 "images/full/2346.jpg",
 "images/full/2353.jpg",
 "images/full/2334.jpg",
 "images/full/2337.jpg",
 "images/full/2367.jpg"
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
