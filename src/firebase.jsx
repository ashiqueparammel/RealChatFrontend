import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "livichat-1ad9c.firebaseapp.com",
  projectId: "livichat-1ad9c",
  storageBucket: "livichat-1ad9c.appspot.com",
  messagingSenderId: "1014004830031",
  appId: "1:1014004830031:web:fe2431f59a114ff400bf3a",
  measurementId: "G-1TY8BJV4RG",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getFCMToken = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    const token = await getToken(messaging, {
      vapidKey: "your-vapid-key",
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
    } else {
      console.error("No registration token available.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

export const sendTokenToBackend = async (fcmToken) => {
  try {
    const response = await UserAxiosInstant.post(baseURL + saveToken, {
      fcmToken: fcmToken, // Send the token in the request body
    });

    if (response.status === 200) {
      console.log("FCM Token saved successfully");
    } else {
      console.error("Failed to save FCM Token:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving FCM token to backend:", error);
  }
};

export const onMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    // Handle the notification display
  });
};
