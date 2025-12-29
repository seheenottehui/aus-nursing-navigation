import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";

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

// Use memory-only cache to avoid persistent cache issues
export const db = initializeFirestore(app, {
    localCache: memoryLocalCache()
});