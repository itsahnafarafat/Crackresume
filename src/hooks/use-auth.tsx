
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { LoginFormData, SignUpFormData, UserData } from '@/lib/types';
import { useToast } from './use-toast';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignUpFormData) => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(firestore, `users/${firebaseUser.uid}`);
        
        const unsubFromDoc = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
                const userData = userDoc.data() as UserData;
                setUser({
                    ...firebaseUser,
                    ...userData,
                });
            } else {
                 setUser(firebaseUser as UserData);
            }
            setLoading(false);
        });

        return () => unsubFromDoc();

      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
       toast({ title: "Login Successful", description: "Welcome back!"});
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ title: "Login Failed", description: error.message, variant: 'destructive' });
    }
  };

  const signup = async ({ email, password, name }: SignUpFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      await sendEmailVerification(newUser);

      await setDoc(doc(firestore, `users/${newUser.uid}`), {
          uid: newUser.uid,
          email: newUser.email,
          displayName: name,
          createdAt: new Date().toISOString(),
          isAdmin: false,
          resumeContent: '',
      });
      router.push('/');
      toast({ title: "Sign Up Successful", description: "Welcome to Crackresume! Please check your email to verify your account."});
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({ title: "Sign Up Failed", description: error.message, variant: 'destructive' });
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const userCredential = await signInWithPopup(auth, provider);
        const googleUser = userCredential.user;

        const userDocRef = doc(firestore, `users/${googleUser.uid}`);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: googleUser.uid,
                email: googleUser.email,
                displayName: googleUser.displayName,
                photoURL: googleUser.photoURL,
                createdAt: new Date().toISOString(),
                isAdmin: false,
                resumeContent: '',
            });
        }
        
        router.push('/');
        toast({ title: "Sign In Successful", description: "Welcome to Crackresume!"});

    } catch (error: any) {
        console.error("Google sign-in error:", error);
        toast({ title: "Google Sign-In Failed", description: error.message, variant: 'destructive' });
    }
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
        toast({ title: "Success", description: "Your resume has been saved." });
    } catch (error) {
        console.error("Error updating resume:", error);
        toast({ title: "Error", description: "Could not save your resume.", variant: "destructive"});
    }
  };

  const value = { user, loading, login, signup, logout, updateUserResume, signInWithGoogle };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
