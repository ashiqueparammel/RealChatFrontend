// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDXEsSf8Cs0P1_qU-uwjBeH90PxcJbqN8",
  authDomain: "livichat-f2654.firebaseapp.com",
  projectId: "livichat-f2654",
  storageBucket: "livichat-f2654.firebasestorage.app",
  messagingSenderId: "203874040682",
  appId: "1:203874040682:web:92fefa679d8eb586ea0313",
  measurementId: "G-04X1X3R6NG"
};

// Initialize Firebase
const vapidKey ="BLziSfZC-33wFRBu5YeVVo4r7pwN6TM3v6X5juzNngXeqbhvZ9uQksb51r7-vK7iyIm7NGEV8KPBMAEwuglmEmE"
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);