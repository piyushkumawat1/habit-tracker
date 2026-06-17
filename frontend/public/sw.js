// public/sw.js
self.addEventListener('push', function (event) {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Time to complete your habit!',
    icon: '/logo.png', // Path to your habit app logo
    badge: '/logo.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Habit Reminder', options)
  );
});

// Open the app when the user clicks the notification
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
