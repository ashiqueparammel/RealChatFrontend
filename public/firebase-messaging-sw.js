importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
    authDomain: "livichat-1ad9c.firebaseapp.com",
    projectId: "livichat-1ad9c",
    storageBucket: "livichat-1ad9c.appspot.com",
    messagingSenderId: "1014004830031",
    appId: "1:1014004830031:web:fe2431f59a114ff400bf3a",
    measurementId: "G-1TY8BJV4RG",
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
