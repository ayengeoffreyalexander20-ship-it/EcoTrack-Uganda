
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA9AyN-joEQNWLYzGD_gT7muMlmBijDv_o",
  authDomain: "ecotrack-uganda.firebaseapp.com",
  projectId: "ecotrack-uganda",
  storageBucket: "ecotrack-uganda.firebasestorage.app",
  messagingSenderId: "164929139089",
  appId: "1:164929139089:web:f2910fccbaef10847c6a30",
  measurementId: "G-EENF5BN7T6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
