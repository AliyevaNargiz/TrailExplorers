import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { Trail } from "../data/trails";

export async function fetchTrails(): Promise<Trail[]> {
  const snap = await getDocs(collection(db, "trails"));
  return snap.docs.map((d) => {
    const data = d.data() as Omit<Trail, "id">;
    return { id: d.id, ...data };
  });
}

export async function fetchTrailById(id: string) {
  const ref = doc(db, "trails", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as Omit<Trail, "id">;
  return { id: snap.id, ...data };
}