
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
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
      if (firebaseUser && firebaseUser.emailVerified) {
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth); // Sign out the user immediately
        toast({
            title: "Verification Required",
            description: "Please check your inbox and verify your email address before logging in.",
            variant: 'destructive',
            duration: 5000,
        });
        return;
      }
      
      router.push('/');
      toast({ title: "Login Successful", description: "Welcome back!"});
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        toast({ title: "Login Failed", description: "Invalid email or password.", variant: 'destructive' });
      } else {
        toast({ title: "Login Failed", description: error.message, variant: 'destructive' });
      }
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
      
      // Sign the user out so they have to verify their email before logging in
      await signOut(auth);

      router.push('/login');
      toast({ 
          title: "Sign Up Successful!", 
          description: "Please check your inbox to verify your email address before logging in.",
          duration: 10000 
      });

    } catch (error: any) {
      console.error("Signup error:", error);
       if (error.code === 'auth/email-already-in-use') {
         toast({ title: "Sign Up Failed", description: "An account with this email already exists.", variant: 'destructive' });
      } else {
        toast({ title: "Sign Up Failed", description: "An unexpected error occurred. Please try again.", variant: 'destructive' });
      }
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

  const value = { user, loading, login, signup, logout, updateUserResume };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
