self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// Quand l'utilisateur clique sur la notification → ouvre l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      for (const c of cs) {
        if ('focus' in c) return c.focus();
      }
      return clients.openWindow('./');
    })
  );
});

// Reçoit l'ordre de programmer une notification
self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE') {
    const { delay, title, body } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        tag: 'leitner-rappel',
        renotify: true,
      });
    }, delay);
  }
});
