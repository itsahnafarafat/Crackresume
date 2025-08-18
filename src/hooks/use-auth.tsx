'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { LoginFormData, SignUpFormData, UserData } from '@/lib/types';
import { useToast } from './use-toast';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignUpFormData) => Promise<void>;
  logout: () => Promise<void>;
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
                 setUser(firebaseUser);
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
      await setDoc(doc(firestore, `users/${newUser.uid}`), {
          uid: newUser.uid,
          email: newUser.email,
          displayName: name,
          createdAt: new Date().toISOString(),
          subscriptionStatus: 'free',
          generationsToday: 0,
          lastGenerationDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      });
      router.push('/');
      toast({ title: "Sign Up Successful", description: "Welcome to SkillSync!"});
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({ title: "Sign Up Failed", description: error.message, variant: 'destructive' });
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

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
