import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../infra/firebase/config";
import { Plan } from "../types";

export async function listPlansFS(): Promise<Plan[]> {
  const ref = collection(db, "plans");
  const snaps = await getDocs(query(ref));
  return snaps.docs.map((d) => d.data() as Plan);
}

export async function getPlanByIdFS(planId: string): Promise<Plan | undefined> {
  const ref = doc(db, "plans", planId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Plan) : undefined;
}

export async function seedPlansIfEmpty(plans: Plan[]): Promise<void> {
  const existing = await listPlansFS();
  if (existing.length > 0) return;
  // seed
  for (const plan of plans) {
    await setDoc(doc(db, "plans", plan.id), plan);
  }
}
