import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Obtener variables de entorno desde expo-constants
const getEnvVar = (key: string, fallback: string): string => {
  const value = Constants.expoConfig?.extra?.env?.[key] || process.env[key];
  return value || fallback;
};

const firebaseConfig = {
  apiKey: getEnvVar(
    "FIREBASE_API_KEY",
    "AIzaSyCp0bZN5mJdJ-JXbPVyjxtczY29LW67aHQ"
  ),
  authDomain: getEnvVar(
    "FIREBASE_AUTH_DOMAIN",
    "membership-system-d5b07.firebaseapp.com"
  ),
  projectId: getEnvVar("FIREBASE_PROJECT_ID", "membership-system-d5b07"),
  storageBucket: getEnvVar(
    "FIREBASE_STORAGE_BUCKET",
    "membership-system-d5b07.firebasestorage.app"
  ),
  messagingSenderId: getEnvVar("FIREBASE_MESSAGING_SENDER_ID", "688662961003"),
  appId: getEnvVar(
    "FIREBASE_APP_ID",
    "1:688662961003:web:d84d9ea3a121b9a2874a2e"
  ),
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configurar persistencia para mantener la sesión al recargar la página
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Ignorar errores si ya está configurado
  });
}

export const db = getFirestore(app);
