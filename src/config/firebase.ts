// Firebase Configuration for TOMO Academy Platform
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDRKzkXTtv4Gpleej264l_Fv_U7j4nU2xE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tomo-3c4bc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tomo-3c4bc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tomo-3c4bc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "314585475223",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:314585475223:web:38f9f825d0558d3207e1d2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JT4K0CC8RY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;