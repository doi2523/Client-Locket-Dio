// self.addEventListener('push', function(event) {
//   const options = {
//     body: event.data.text(),
//     icon: '/icon.png',
//     badge: '/badge.png',
//   };
//   event.waitUntil(
//     self.registration.showNotification('Thông báo mới', options)
//   );
// });

// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow('https://www.example.com')
//   );
// });
// Tên cache
// const CACHE_NAME = 'my-cache-v1';
// const ASSETS_TO_CACHE = [
//   '/icons8-heart-100.png',
//   '/badge.png',
//   '/IMG_7016.PNG',
//   '/src/assets/fonts/YourFont.otf'
// ];

// // Cache các file khi service worker được cài đặt
// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => {
//       return cache.addAll(ASSETS_TO_CACHE);
//     })
//   );
// });

// Cache API request
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(cachedResponse => {
//       if (cachedResponse) return cachedResponse;
      
//       // Fetch và lưu vào cache
//       return fetch(event.request).then(response => {
//         return caches.open(CACHE_NAME).then(cache => {
//           cache.put(event.request, response.clone());
//           return response;
//         });
//       });
//     })
//   );
// });