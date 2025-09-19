
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { UserData } from '@/lib/types';
import { useToast } from './use-toast';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserResume: (resumeContent: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleRedirect = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result) {
                setLoading(true); // Start loading while we process the redirect
                const googleUser = result.user;
                const userDocRef = doc(firestore, 'users', googleUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    await setDoc(userDocRef, {
                        uid: googleUser.uid,
                        email: googleUser.email,
                        displayName: googleUser.displayName,
                        photoURL: googleUser.photoURL,
                        createdAt: serverTimestamp(),
                        resumeContent: '',
                        isAdmin: false,
                    });
                }
                router.push('/dashboard');
                toast({ title: "Login Successful", description: "Welcome!"});
            }
        } catch (error: any) {
            console.error("Google Sign-In redirect error:", error);
            if (error.code !== 'auth/web-storage-unsupported') {
               toast({ title: "Sign-In Failed", description: "Could not complete sign in with Google. Please try again.", variant: 'destructive' });
            }
        } finally {
            // This is important to stop loading even if redirect result is null or fails
            setLoading(false);
        }
    }
    
    handleRedirect();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(firestore, `users/${firebaseUser.uid}`);
        const userDoc = await getDoc(userDocRef);
        
        const userData = userDoc.exists() ? userDoc.data() as UserData : {};
        setUser({ ...firebaseUser, ...userData });

      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, toast]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // No need for a try-catch here for signInWithRedirect, as errors are handled by getRedirectResult
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error: any)
{
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: error.message, variant: 'destructive' });
    }
  };
  
  const updateUserResume = async (resumeContent: string) => {
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in to update your resume.", variant: "destructive" });
        return;
    }
    const userDocRef = doc(firestore, 'users', user.uid);
    try {
        await updateDoc(userDocRef, { resumeContent });
        setUser(prevUser => prevUser ? { ...prevUser, resumeContent } : null);
        toast({ title: "Success", description: "Your resume has been saved." });
    } catch (error) {
        console.error("Error updating resume:", error);
        toast({ title: "Error", description: "Could not save your resume.", variant: "destructive"});
    }
  };

  const value = { user, loading, signInWithGoogle, logout, updateUserResume };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
