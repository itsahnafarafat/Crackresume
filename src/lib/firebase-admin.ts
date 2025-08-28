
import * as admin from 'firebase-admin';

// Check if the service account key is available
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Initialize the app only if it hasn't been initialized and a service account key is provided
if (!admin.apps.length && serviceAccountKey) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.stack);
  }
} else if (!serviceAccountKey) {
    // This warning will be logged on the server if the key is missing.
    console.warn("Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT_KEY is not set. Server-side Firebase services will not be available.");
}

// Export a firestore instance. It will only be functional if initializeApp was successful.
export const firestore = admin.apps.length > 0 ? admin.firestore() : null as unknown as admin.firestore.Firestore;
