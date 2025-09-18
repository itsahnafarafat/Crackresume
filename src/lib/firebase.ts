import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  authDomain: "resuai-qodve.firebaseapp.com",
  projectId: "resuai-qodve",
  storageBucket: "resuai-qodve.appspot.com",
  messagingSenderId: "258754616939",
  appId: "1:258754616939:web:387aa3472eadd3c3d05b2e"
};


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const firestore = getFirestore(app);

// ✅ Analytics (only initialize in browser, not on server)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, firestore, analytics };
