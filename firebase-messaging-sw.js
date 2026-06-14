// Firebase Cloud Messaging Service Worker for What Now?
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCS-pacDnn-wPq1K9iG8n0z1bB93UlTjPY",
  authDomain: "whatnow-b6162.firebaseapp.com",
  projectId: "whatnow-b6162",
  storageBucket: "whatnow-b6162.firebasestorage.app",
  messagingSenderId: "880600854409",
  appId: "1:880600854409:web:ea91cd985007e64e363b58"
});

const messaging = firebase.messaging();

// Handle background push messages
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'what now?';
  const body = (payload.notification && payload.notification.body) || '';
  const data = payload.data || {};

  self.registration.showNotification(title, {
    body: body,
    icon: 'icon.png',
    badge: 'icon.png',
    tag: data.type || 'whatnow-push',
    renotify: true,
    data: data,
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
