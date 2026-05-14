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
  event.waitUntil(
    (async () => {
      // cleanup old caches theo version
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => !key.includes(SW_VERSION))
          .map((key) => caches.delete(key)),
      );

      await clients.claim();
    })(),
  );
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
// FIX: MIME HTML LOADING JS BUG
// ======================
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  const isAsset = url.pathname.endsWith(".js") || url.pathname.endsWith(".css");

  if (!isAsset) return;

  event.respondWith(
    fetch(event.request)
      .then(async (res) => {
        const contentType = res.headers.get("content-type") || "";

        // ❌ server trả HTML thay vì JS/CSS
        if (contentType.includes("text/html")) {
          console.warn("[SW] MIME mismatch detected:", url.pathname);

          // clear cache toàn bộ
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((k) => caches.delete(k)));

          // reload tất cả tab
          const clientsList = await clients.matchAll({
            type: "window",
          });

          clientsList.forEach((client) => {
            client.navigate(client.url);
          });

          throw new Error("MIME mismatch -> forcing reload");
        }

        return res;
      })
      .catch((err) => {
        console.error("[SW] fetch failed:", err);
        throw err;
      }),
  );
});

// ======================
// PUSH NOTIFICATION
// ======================
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  const title = data.title || "🔔 Thông báo";

  const options = {
    body: data.body || "Bạn có thông báo mới!",
    data: { url: data.url || "https://locket-dio.com" },
    icon: "/android-chrome-192x192.png",
    badge: "/maskable_icon.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ======================
// NOTIFICATION CLICK
// ======================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "https://locket-dio.com";

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
