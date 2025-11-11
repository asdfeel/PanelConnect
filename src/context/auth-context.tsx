'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'asdfeelmax@naver.com';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (name: string, password?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) return; // guard: do nothing until auth is initialized

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        if (!db) {
          console.error('Firestore not initialized - skipping user document fetch.');
          setIsLoading(false); // Ensure loading state is reset
          return;
        }
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        const createUserObject = (docData: any): User => ({
          id: firebaseUser.uid,
          name: docData.name || firebaseUser.displayName || 'New User',
          email: docData.email || firebaseUser.email || '',
          isAdmin: firebaseUser.email === ADMIN_EMAIL,
        });

        if (userDoc.exists()) {
          setUser(createUserObject(userDoc.data()));
        } else {
          // This case can happen if the user was created in auth but not in firestore.
           const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            isAdmin: firebaseUser.email === ADMIN_EMAIL,
          };
          if (!db) {
            console.error('Firestore not initialized - skipping user document creation.');
            setIsLoading(false);
            return;
          }
          await setDoc(userDocRef, { ...newUser, appliedJobs: [] });
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
      console.error('Firebase Auth not initialized.');
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Could not connect to authentication service.',
      });
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/jobs');
  };

  const logout = async () => {
    if (!auth) {
      console.error('Firebase Auth not initialized.');
      // Even if auth is not available, we should try to clear the local state and redirect.
      setUser(null);
      router.push('/login');
      return;
    }
    await signOut(auth);
    router.push('/login');
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!auth) {
      console.error('Firebase Auth not initialized.');
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Could not connect to authentication service.',
      });
      return;
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: name });

    const newUser: User = {
      id: firebaseUser.uid,
      name: name,
      email: email,
      isAdmin: email === ADMIN_EMAIL,
    };
    
    if (!db) {
      console.error('Firestore not initialized - skipping user document creation during signup.');
      throw new Error('Firestore not initialized'); // Or handle more gracefully
    }
    await setDoc(doc(db, "users", firebaseUser.uid), {
      ...newUser,
      appliedJobs: [],
    });

    setUser(newUser);
    router.push('/jobs');
  };
  
  const updateUser = async (name: string, password?: string) => {
    if (auth.currentUser) {
      if (name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
        if (!db) {
          console.error('Firestore not initialized - skipping user document update.');
          return;
        }
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, { name }, { merge: true });
        setUser(prev => prev ? { ...prev, name } : null);
      }
      if (password) {
        await updatePassword(auth.currentUser, password);
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
