
import * as admin from 'firebase-admin';
import { getApplicationDefault } from 'firebase-admin/app';
import 'dotenv/config';

let firestore: admin.firestore.Firestore | null = null;

if (!admin.apps.length) {
  try {
    // When deployed to App Hosting, GOOGLE_APPLICATION_CREDENTIALS is automatically set.
    // For local development, you must set this environment variable to point to your service account key file.
    admin.initializeApp({
      credential: getApplicationDefault(),
    });
    firestore = admin.firestore();
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
    // Set firestore to null if initialization fails
    firestore = null;
  }
} else {
  // If the app is already initialized, just get the firestore instance.
  firestore = admin.firestore();
}

export { firestore };
