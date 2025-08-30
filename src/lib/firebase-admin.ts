
import * as admin from 'firebase-admin';
import { getApplicationDefault } from 'firebase-admin/app';
import 'dotenv/config';

// This is the recommended way to initialize the Firebase Admin SDK in Google-managed environments like Firebase App Hosting.
// It uses Application Default Credentials and does not require manual management of service account keys.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: getApplicationDefault(),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.stack);
  }
}

// Export a firestore instance. It will only be functional if initializeApp was successful.
export const firestore = admin.apps.length > 0 ? admin.firestore() : null;
