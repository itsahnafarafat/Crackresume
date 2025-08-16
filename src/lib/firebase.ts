// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "resuai-qodve",
  appId: "1:258754616939:web:387aa3472eadd3c3d05b2e",
  storageBucket: "resuai-qodve.firebasestorage.app",
  apiKey: "AIzaSyB6PgSGzpxbWEhNs9eFHP1iIX9n6ZvuVgE",
  authDomain: "resuai-qodve.firebaseapp.com",
  messagingSenderId: "258754616939",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
