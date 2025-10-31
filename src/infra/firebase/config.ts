import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Auth para Web vs Nativo (React Native)
let authInstance;
if (Platform.OS !== "web") {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  authInstance = getAuth(app);
  setPersistence(authInstance, browserLocalPersistence).catch(() => {});
}

export const auth = authInstance;
export const db = getFirestore(app);
