
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  browserPopupRedirectResolver
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  "projectId": "resuai-qodve",
  "appId": "1:258754616939:web:387aa3472eadd3c3d05b2e",
  "storageBucket": "resuai-qodve.appspot.com",
  "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  "authDomain": "resuai-qodve.firebaseapp.com",
  "messagingSenderId": "258754616939"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Correctly initialize Auth for environments with popup/redirect restrictions
const auth = typeof window !== 'undefined' 
  ? initializeAuth(app, {
      popupRedirectResolver: browserPopupRedirectResolver,
    }) 
  : getAuth(app);
  
const firestore = getFirestore(app);

// Analytics (only initialize in browser, not on server)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, firestore, analytics };
