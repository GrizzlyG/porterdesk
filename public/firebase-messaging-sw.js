// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBqwef0Pip-BI6lu578u9MgZ232Y3PlLXs",
  authDomain: "porterdesk-f514f.firebaseapp.com",
  projectId: "porterdesk-f514f",
  storageBucket: "porterdesk-f514f.firebasestorage.app",
  messagingSenderId: "207286962257",
  appId: "1:207286962257:web:d9b68d1371dfb901591070"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png' // Optional: add your own icon
  });
});
