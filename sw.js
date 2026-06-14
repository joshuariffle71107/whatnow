// What Now? — Service Worker for local notifications
const SW_VERSION = '1.0.0';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Listen for messages from the app telling us to show a notification
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'SHOW_NOTIFICATION') return;

  const { title, body, tag, icon } = data.payload;

  self.registration.showNotification(title, {
    body: body,
    icon: icon || 'icon.png',
    badge: 'icon.png',
    tag: tag || 'whatnow-notification',
    renotify: true,
    silent: false,
  });
});

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
