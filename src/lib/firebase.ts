import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFnp16aYvjWE4We6LSben1Z5bSG46gaxY",
  authDomain: "healtho-94062.firebaseapp.com",
  projectId: "healtho-94062",
  storageBucket: "healtho-94062.firebasestorage.app",
  messagingSenderId: "481546853927",
  appId: "1:481546853927:web:b998d5ffcc4d3d9d293802",
  measurementId: "G-K809PLDX54"
};

// Initialize Firebase only if it hasn't been initialized yet (avoids Next.js HMR issues)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
