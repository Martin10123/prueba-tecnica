import {
  User as FBUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../infra/firebase/config";
import { User } from "../types";

export function listenAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (fb) => {
    if (!fb) return callback(null);
    const mapped = await mapUser(fb);
    callback(mapped);
  });
}

export async function signUpEmail(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await ensureUserDoc(cred.user);
  return mapUser(cred.user);
}

export async function signInEmail(
  email: string,
  password: string
): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred.user);
  return mapUser(cred.user);
}

export async function signOutAll(): Promise<void> {
  await signOut(auth);
}

async function ensureUserDoc(user: FBUser) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName ?? "",
      email: user.email ?? "",
      createdAt: serverTimestamp(),
      subscriptions: [],
    });
  }
}

async function mapUser(fb: FBUser): Promise<User> {
  const ref = doc(db, "users", fb.uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? (snap.data() as any) : {};
  return {
    id: fb.uid,
    name: data.name || fb.displayName || "Usuario",
    email: data.email || fb.email || undefined,
    isActive:
      Array.isArray(data.subscriptions) && data.subscriptions.length > 0,
    subscriptionPlanId: null,
    subscriptions: data.subscriptions || [],
  };
}
