import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAgDZW0VtMBDDjyYaCcejYdfxPavACk-bg",
  authDomain: "urbanflow-ai-bfefb.firebaseapp.com",
  projectId: "urbanflow-ai-bfefb",
  storageBucket: "urbanflow-ai-bfefb.firebasestorage.app",
  messagingSenderId: "691633355308",
  appId: "1:691633355308:web:962824cef1684585c7ef89",
  measurementId: "G-CY7QMK2JPT",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });

// Analytics solo en browser (no en SSR/tests)
isSupported().then(yes => yes && getAnalytics(app));

export default app;
