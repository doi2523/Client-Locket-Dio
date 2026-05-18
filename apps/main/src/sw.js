const SW_VERSION = import.meta.env.VITE_APP_VERSION;

console.log(`[SW] Locket Dio SW ${SW_VERSION} - loaded`);

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { createHandlerBoundToURL } from "workbox-precaching";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// ======================
// FORCE SKIP WAITING
// ======================
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ======================
// PRECACHE
// ======================
precacheAndRoute(self.__WB_MANIFEST || []);
console.log("[SW] started precache");

cleanupOutdatedCaches();

// ======================
// SPA NAVIGATION ROUTE
// ======================
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), {
    denylist: [/^\/assets\//, /\/[^/?]+\.[^/]+$/],
  }),
);

// ======================
// IMAGE CACHE
// ======================
registerRoute(
  ({ url, request }) =>
    url.origin === "https://cdn.locket-dio.com" &&
    request.destination === "image" &&
    url.pathname.startsWith("/v1/images/"),
  new CacheFirst({
    cacheName: "dio-images-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
);

// ======================
// PUSH NOTIFICATION
// ======================
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  const title = data.title || "🔔 Thông báo";
  const urlToOpen = data?.url || self.location.origin;

  const options = {
    body: data.body || "Bạn có thông báo mới!",
    data: { url: urlToOpen },
    icon: "/android-chrome-192x192.png",
    badge: "/maskable-icon-512x512.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ======================
// NOTIFICATION CLICK
// ======================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || self.location.origin;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
