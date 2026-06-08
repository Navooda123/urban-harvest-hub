self.addEventListener('push', event => {
  let data = { title: 'Urban Harvest Hub', body: 'New green initiative/event available!' };
  try {
    data = event.data.json();
  } catch (err) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/pwa-192x192.svg',
    badge: '/favicon.svg',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If a window is already open, focus it
      const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
      for (const client of clientList) {
        const urlObj = new URL(client.url);
        const relativeUrl = urlObj.pathname + urlObj.search + urlObj.hash;
        if (relativeUrl === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
