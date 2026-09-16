'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  auth,
  isFirebaseConfigured,
  getUserProfile,
  setUserProfile,
  type UserProfile,
} from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    role: 'student' | 'admin',
    department?: string,
    semester?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  demoSignIn: (role: 'student' | 'admin', email?: string, name?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'academiq_demo_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setUserProfileState(profile);
          } else {
            // Fallback profile if Firestore doc doesn't exist yet
            setUserProfileState({
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              role: 'student',
              department: 'Computer Science',
              semester: '3rd Semester',
            });
          }
        } else {
          setUserProfileState(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Offline/Demo fallback mode when Firebase credentials are not yet configured
      try {
        const storedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
        if (storedDemo) {
          const parsed = JSON.parse(storedDemo) as UserProfile;
          setUserProfileState(parsed);
        }
      } catch (err) {
        console.error('Failed to parse demo auth data:', err);
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isFirebaseConfigured) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(credential.user.uid);
      if (profile) {
        setUserProfileState(profile);
      } else {
        setUserProfileState({
          uid: credential.user.uid,
          email: credential.user.email || email,
          displayName: credential.user.displayName || email.split('@')[0],
          role: 'student',
        });
      }
    } else {
      // Simulated sign-in for demo mode
      const role = email.includes('admin') ? 'admin' : 'student';
      demoSignIn(role, email);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: 'student' | 'admin',
    department: string = 'BCA CSE',
    semester: string = '3rd Semester'
  ) => {
    if (isFirebaseConfigured) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });

      const newProfile: UserProfile = {
        uid: credential.user.uid,
        email,
        displayName,
        role,
        department,
        semester,
        createdAt: new Date().toISOString(),
      };

      await setUserProfile(newProfile);
      setUserProfileState(newProfile);
    } else {
      demoSignIn(role, email, displayName);
    }
  };

  const signOut = async () => {
    if (isFirebaseConfigured) {
      await firebaseSignOut(auth);
    } else {
      try {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear demo auth storage:', err);
      }
    }
    setUser(null);
    setUserProfileState(null);
  };

  const demoSignIn = (
    role: 'student' | 'admin',
    email: string = role === 'admin' ? 'admin@university.edu' : 'student@university.edu',
    name: string = role === 'admin' ? 'Campus Administrator' : 'Shivam Singh'
  ) => {
    const profile: UserProfile = {
      uid: `demo-${role}-${Date.now()}`,
      email,
      displayName: name,
      role,
      department: role === 'student' ? 'BCA CSE' : 'Administration',
      semester: role === 'student' ? '3rd Semester' : 'Faculty Staff',
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to store demo user:', err);
    }
    setUserProfileState(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isFirebaseConfigured,
        signIn,
        signUp,
        signOut,
        demoSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
