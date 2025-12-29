import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics is optional

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
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);