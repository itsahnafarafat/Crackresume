
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { UserData } from '@/lib/types';
import { useToast } from './use-toast';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserResume: (resumeContent: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchUserData = useCallback(async (firebaseUser: User) => {
    const userDocRef = doc(firestore, `users/${firebaseUser.uid}`);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? (userDoc.data() as UserData) : {};
    setUser({ ...firebaseUser, ...userData });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        setLoading(true);
        await fetchUserData(currentUser);
        setLoading(false);
    }
  }, [fetchUserData]);

  const createUserProfile = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          resumeContent: '',
          isAdmin: false,
          isPro: false,
          onboardingComplete: false,
          usage: {
            resumeGenerations: 0,
            coverLetterGenerations: 0,
            jobMatchAnalyses: 0,
            lastReset: Timestamp.now(),
          }
        }, { merge: true });
    }
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      
      router.push('/dashboard');
      toast({ title: "Login Successful", description: "Welcome!" });

    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast({ title: "Sign-In Failed", description: error.message, variant: 'destructive' });
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string) => {
      try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          await createUserProfile(result.user);

          router.push('/dashboard');
          toast({ title: "Account Created", description: "Welcome to Crackresume!"});
      } catch (error: any) {
          console.error("Email/Password Sign-Up error:", error);
          toast({ title: "Sign-Up Failed", description: error.message, variant: 'destructive' });
      }
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
      try {
          await signInWithEmailAndPassword(auth, email, password);
          router.push('/dashboard');
          toast({ title: "Login Successful", description: "Welcome back!"});
      } catch (error: any) {
          console.error("Email/Password Sign-In error:", error);
          toast({ title: "Sign-In Failed", description: error.message, variant: 'destructive' });
      }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error: any) {
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

  const value = { user, loading, signInWithGoogle, signUpWithEmailPassword, signInWithEmailPassword, logout, updateUserResume, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
