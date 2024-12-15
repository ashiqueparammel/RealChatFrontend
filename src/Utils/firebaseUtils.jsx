import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBDXEsSf8Cs0P1_qU-uwjBeH90PxcJbqN8",
    authDomain: "livichat-f2654.firebaseapp.com",
    projectId: "livichat-f2654",
    storageBucket: "livichat-f2654.firebasestorage.app",
    messagingSenderId: "203874040682",
    appId: "1:203874040682:web:92fefa679d8eb586ea0313",
    measurementId: "G-04X1X3R6NG"
};

const vapidKey = "BLziSfZC-33wFRBu5YeVVo4r7pwN6TM3v6X5juzNngXeqbhvZ9uQksb51r7-vK7iyIm7NGEV8KPBMAEwuglmEmE"
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app)


export const requestFCMToken = async () => {
    return Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            return getToken(messaging, { vapidKey })
        } else {
            throw new Error("Notification not granted!")
        }
    }).catch((err) => {
        console.error('Error getting FCM token:', err);
        throw err;
    })
}
