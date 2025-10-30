import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../infra/firebase/config";
import { PlanCategory, Subscription } from "../types";

export async function addSubscription(
  uid: string,
  data: {
    planId: string;
    planName: string;
    category: PlanCategory;
    billing: "monthly" | "yearly";
  }
): Promise<void> {
  const ref = collection(db, "users", uid, "subscriptions");
  await addDoc(ref, {
    planId: data.planId,
    planName: data.planName,
    category: data.category,
    billing: data.billing,
    active: true,
    startedAt: serverTimestamp(),
  });
}

export async function listSubscriptions(
  uid: string,
  onlyActive = true
): Promise<Subscription[]> {
  const ref = collection(db, "users", uid, "subscriptions");
  const q = onlyActive ? query(ref, where("active", "==", true)) : query(ref);
  const snaps = await getDocs(q);
  const items = snaps.docs.map((d) => {
    const v = d.data() as any;
    return {
      planId: v.planId,
      planName: v.planName,
      category: v.category,
      startedAt: (v.startedAt?.toMillis?.() ?? Date.now()) as number,
    } as Subscription;
  });
  // Sort in-memory to avoid requiring a composite index
  items.sort((a, b) => b.startedAt - a.startedAt);
  return items;
}

export async function deactivateAllSubscriptions(uid: string): Promise<void> {
  const ref = collection(db, "users", uid, "subscriptions");
  const snaps = await getDocs(query(ref, where("active", "==", true)));
  const ops = snaps.docs.map((d) =>
    updateDoc(doc(db, "users", uid, "subscriptions", d.id), { active: false })
  );
  await Promise.all(ops);
}

export async function deactivateByPlanId(
  uid: string,
  planId: string
): Promise<void> {
  const ref = collection(db, "users", uid, "subscriptions");
  const snaps = await getDocs(
    query(ref, where("planId", "==", planId), where("active", "==", true))
  );
  const ops = snaps.docs.map((d) =>
    updateDoc(doc(db, "users", uid, "subscriptions", d.id), { active: false })
  );
  await Promise.all(ops);
}

export function listenSubscriptions(
  uid: string,
  callback: (subs: Subscription[]) => void
) {
  const ref = collection(db, "users", uid, "subscriptions");
  const q = query(ref, where("active", "==", true));
  return onSnapshot(q, (snap) => {
    const subs: Subscription[] = snap.docs
      .map((d) => {
        const v = d.data() as any;
        return {
          planId: v.planId,
          planName: v.planName,
          category: v.category,
          startedAt: (v.startedAt?.toMillis?.() ?? Date.now()) as number,
        } as Subscription;
      })
      .sort((a, b) => b.startedAt - a.startedAt);
    callback(subs);
  });
}
