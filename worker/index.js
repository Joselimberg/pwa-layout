importScripts();
self.skipWaiting();
workbox.clientsClaim();

workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
  plugins: []
}), 'GET');
