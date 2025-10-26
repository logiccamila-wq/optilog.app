import { initializeApp, getApps, getApp } from "firebase/app";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const hasConfig = Boolean(apiKey && authDomain && projectId && appId);

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

export const app = hasConfig
  ? !getApps().length
    ? initializeApp(firebaseConfig as any)
    : getApp()
  : (null as any);

// Lazy client-only accessors to avoid bundling Node-only variants
export async function getDb() {
  if (!hasConfig || !app || typeof window === 'undefined') return null as any;
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(app);
}

export async function getAuthInstance() {
  if (!hasConfig || !app || typeof window === 'undefined') return null as any;
  const { getAuth } = await import('firebase/auth');
  return getAuth(app);
}