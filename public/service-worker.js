importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");

// Workbox が使えるかチェック（任意）
if (workbox) {
  console.log("Workbox loaded");
} else {
  console.log("Workbox failed to load");
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

// HTML → Network First
workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: "html-cache",
  })
);

// CSS / JS / 画像 → Stale While Revalidate
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "asset-cache",
  })
);
