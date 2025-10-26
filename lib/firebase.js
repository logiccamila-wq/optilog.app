import { initializeApp, getApps, getApp } from 'firebase/app';

// As variáveis de ambiente são injetadas aqui pelo Next.js durante o build.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase apenas uma vez para evitar erros.
// Esta é a forma segura de inicializar em um ambiente Next.js (SSR + Client).
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;