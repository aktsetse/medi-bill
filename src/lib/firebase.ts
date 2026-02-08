// Firebase configuration
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB9Kb5j_qh5G2Kkrp7lkjZ5cR81WwKaJjg",
    authDomain: "medibill-23b37.firebaseapp.com",
    projectId: "medibill-23b37",
    storageBucket: "medibill-23b37.firebasestorage.app",
    messagingSenderId: "970242913697",
    appId: "1:970242913697:web:8023b292e56053bdce47e0",
    measurementId: "G-5N3PXYCHRJ"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
