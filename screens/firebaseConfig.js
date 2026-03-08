// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiMtrExkYzlLhHvWOuacO1gJJqruipq-4",
  authDomain: "csci4176-project-3abd5.firebaseapp.com",
  projectId: "csci4176-project-3abd5",
  storageBucket: "csci4176-project-3abd5.firebasestorage.app",
  messagingSenderId: "1076825133512",
  appId: "1:1076825133512:web:954f1902565d07d62930fd",
  measurementId: "G-QHTVLT8CRQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);