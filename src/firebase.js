import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAswNjMP1eop_I04wlM0O4nvfsjtloiPtE",
    authDomain: "gamebadulk.firebaseapp.com",
    projectId: "gamebadulk",
    storageBucket: "gamebadulk.firebasestorage.app",
    messagingSenderId: "108004089226",
    appId: "1:108004089226:web:af5e41e6ea24cbb339fc73",
    measurementId: "G-KG87TLJR6X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
