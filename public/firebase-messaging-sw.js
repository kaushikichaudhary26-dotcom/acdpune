/* eslint-disable no-restricted-globals */

/**
 * Firebase Cloud Messaging Service Worker
 *
 * Handles background push notifications when the app is not in the foreground.
 * This file MUST live in public/ so the browser can register it at the root scope.
 */

importScripts('https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAHeOzkOQ3Xgv-mjFuVfMsK27LLRSOQEAY',
  authDomain: 'awsugpune-in-01.firebaseapp.com',
  projectId: 'awsugpune-in-01',
  storageBucket: 'awsugpune-in-01.firebasestorage.app',
  messagingSenderId: '249219297721',
  appId: '1:249219297721:web:74f89523d606e51481c668',
});

const messaging = firebase.messaging();

// Handle background messages (when the app tab is not focused)
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] Background message received:', payload);

  const notification = payload.notification || {};
  const title = notification.title || 'AWS Community Day Pune';
  const options = {
    body: notification.body || '',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    tag: payload.collapseKey || 'acd-notification',
    data: {
      url: payload.data?.url || '/',
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  self.registration.showNotification(title, options);
});

// Handle notification click — open the app or focus existing tab
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Otherwise, open a new tab
      return clients.openWindow(url);
    }),
  );
});
