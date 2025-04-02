// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  API_KEY: "AIzaSyC0ehbjsDYCJBD1FLk9F80x50F7_BZTmrg",
  authDomain: "comichunt-35517.firebaseapp.com",
  projectId: "comichunt-35517",
  storageBucket: "comichunt-35517.firebasestorage.app",
  messagingSenderId: "470194385243",
  appId: "1:470194385243:web:7e9d5bafabf4a9810f2a7e",
  measurementId: "G-YBJQ2M910Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);