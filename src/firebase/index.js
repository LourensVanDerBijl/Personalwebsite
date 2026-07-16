// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration (hardcoded for quick paste)
const firebaseConfig = {
  apiKey: "AIzaSyBT9BRB2lw-oGkjMQT59jI6nRoWilyxGB4",
  authDomain: "resume-louisvdbijl.firebaseapp.com",
  projectId: "resume-louisvdbijl",
  storageBucket: "resume-louisvdbijl.appspot.com",
  messagingSenderId: "52155093628",
  appId: "1:52155093628:web:0aea0046971f5876c6aff9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
