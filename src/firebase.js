import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAswNjMP1eop_I04wlM0O4nvfsjtloiPtE",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gamebadulk.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gamebadulk",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gamebadulk.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "108004089226",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:108004089226:web:af5e41e6ea24cbb339fc73",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KG87TLJR6X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
