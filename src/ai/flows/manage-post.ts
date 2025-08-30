
'use server';

/**
 * @fileOverview A secure Genkit flow to manage blog posts.
 * This flow verifies user admin permissions before performing any database operations.
 *
 * - managePost - Handles creating, updating, and deleting blog posts.
 * - ManagePostInput - The input type for the managePost function.
 * - ManagePostOutput - The return type for the managePost function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { BlogPostSchema, ManagePostInputSchema, ManagePostOutputSchema } from '@/lib/types';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

function initializeFirebase() {
    if (!admin.apps.length) {
        try {
            // This will use Application Default Credentials on App Hosting.
            // For local development, ensure you have the correct GOOGLE_APPLICATION_CREDENTIALS environment variable set.
            admin.initializeApp();
        } catch (error) {
            console.error('Firebase admin initialization error:', error);
            // We'll let getFirestore() throw the more specific error if initialization fails
        }
    }
    return getFirestore();
}


export async function managePost(input: z.infer<typeof ManagePostInputSchema>): Promise<z.infer<typeof ManagePostOutputSchema>> {
    return managePostFlow(input);
}

const managePostFlow = ai.defineFlow(
    {
        name: 'managePostFlow',
        inputSchema: ManagePostInputSchema,
        outputSchema: ManagePostOutputSchema,
    },
    async (input) => {
        const firestore = initializeFirebase();

        try {
            // 1. Verify user is an admin
            const userDoc = await firestore.collection('users').doc(input.userId).get();
            if (!userDoc.exists || !userDoc.data()?.isAdmin) {
                return { success: false, error: 'Permission denied. User is not an admin.' };
            }

            // 2. Perform the requested action
            const postsCollection = firestore.collection('posts');

            switch (input.action) {
                case 'create':
                    if (!input.postData) {
                         return { success: false, error: 'Post data is required for creation.' };
                    }
                    await postsCollection.add({
                        ...input.postData,
                        date: admin.firestore.FieldValue.serverTimestamp(),
                    });
                    break;

                case 'update':
                    if (!input.postId || !input.postData) {
                        return { success: false, error: 'Post ID and data are required for update.' };
                    }
                    await postsCollection.doc(input.postId).update({
                        ...input.postData,
                        date: admin.firestore.FieldValue.serverTimestamp(),
                    });
                    break;

                case 'delete':
                    if (!input.postId) {
                        return { success: false, error: 'Post ID is required for deletion.' };
                    }
                    await postsCollection.doc(input.postId).delete();
                    break;

                default:
                    return { success: false, error: 'Invalid action specified.' };
            }

            return { success: true };

        } catch (error: any) {
            console.error(`Error in managePostFlow (action: ${input.action}):`, error);
            return { success: false, error: error.message || 'An unexpected server error occurred.' };
        }
    }
);
