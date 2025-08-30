
import * as admin from 'firebase-admin';
import 'dotenv/config';

let firestore: admin.firestore.Firestore | null = null;

if (!admin.apps.length) {
  try {
    // When deployed to App Hosting, service account credentials will be
    // automatically available. For local development, you must set up your
    // own service account credentials.
    admin.initializeApp();
    firestore = admin.firestore();
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
    firestore = null;
  }
} else {
  // If the app is already initialized, just get the firestore instance.
  if (!firestore) {
    firestore = admin.firestore();
  }
}

export { firestore };
