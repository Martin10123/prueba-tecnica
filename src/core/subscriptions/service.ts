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
  const items = snaps.docs.map((d: any) => {
    const v = d.data() as any;
    return {
      planId: v.planId,
      planName: v.planName,
      category: v.category,
      startedAt: (v.startedAt?.toMillis?.() ?? Date.now()) as number,
      active: Boolean(v.active !== false),
    } as Subscription;
  });

  return items.sort((a: any, b: any) => b.startedAt - a.startedAt);
}

export async function deactivateAllSubscriptions(uid: string): Promise<void> {
  const ref = collection(db, "users", uid, "subscriptions");
  const snaps = await getDocs(query(ref, where("active", "==", true)));
  const ops = snaps.docs.map((d: any) =>
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
  const ops = snaps.docs.map((d: any) =>
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
  return onSnapshot(q, (snap: any) => {
    const subs: Subscription[] = snap.docs
      .map((d: any) => {
        const v = d.data() as any;
        return {
          planId: v.planId,
          planName: v.planName,
          category: v.category,
          startedAt: (v.startedAt?.toMillis?.() ?? Date.now()) as number,
          active: true,
        } as Subscription;
      })
      .sort((a: any, b: any) => b.startedAt - a.startedAt);
    callback(subs);
  });
}
