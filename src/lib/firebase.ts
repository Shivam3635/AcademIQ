import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAPjYwvE-vgybG1Mg59dCwwUB2QuwJjbfQ',
  authDomain: 'academiq-5b76c.firebaseapp.com',
  projectId: 'academiq-5b76c',
  storageBucket: 'academiq-5b76c.firebasestorage.app',
  messagingSenderId: '939402459495',
  appId: '1:939402459495:web:8004c835dfccadd218d7c2',
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your-api-key-here' &&
  firebaseConfig.apiKey !== 'demo-api-key'
);

// Initialize Firebase safely
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'admin';
  department?: string;
  semester?: string;
  createdAt?: string;
}

/**
 * Checks if a user has the 'admin' role in Firestore.
 */
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user || !isFirebaseConfigured) {
    return false;
  }
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data()?.role === 'admin') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Fetch a user's profile document from Firestore.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!isFirebaseConfigured) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Save or update a user's profile document in Firestore.
 */
export const setUserProfile = async (profile: UserProfile): Promise<void> => {
  if (!isFirebaseConfigured) return;
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    await setDoc(userDocRef, profile, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

export { app, auth, db };
