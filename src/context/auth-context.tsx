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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
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
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/jobs');
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const signup = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: name });

    const newUser: User = {
      id: firebaseUser.uid,
      name: name,
      email: email,
      isAdmin: email === ADMIN_EMAIL,
    };
    
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
