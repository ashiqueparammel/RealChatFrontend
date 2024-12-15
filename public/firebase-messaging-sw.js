importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBDXEsSf8Cs0P1_qU-uwjBeH90PxcJbqN8",
  authDomain: "livichat-f2654.firebaseapp.com",
  projectId: "livichat-f2654",
  storageBucket: "livichat-f2654.firebasestorage.app",
  messagingSenderId: "203874040682",
  appId: "1:203874040682:web:92fefa679d8eb586ea0313",
  measurementId: "G-04X1X3R6NG"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title || "Default Title";
  const notificationOptions = {
    body: payload.notification.body || "Default Body",
    icon: payload.notification.icon || "/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
