import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAgp-13SplasVTjnZejrNi6gh6wP4s7uwk",
    authDomain: "aus-nurse.firebaseapp.com",
    projectId: "aus-nurse",
    storageBucket: "aus-nurse.firebasestorage.app",
    messagingSenderId: "271758825112",
    appId: "1:271758825112:web:1104ad34f8d467ade262ed",
    measurementId: "G-21154RL8K6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Firestore with explicit settings to avoid internal assertion errors
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});