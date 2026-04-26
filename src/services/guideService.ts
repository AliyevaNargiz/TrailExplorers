import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type Guide = {
  id: string;
  fullName: string;
  bio: string;
  region: string;
  languages: string[];
  specialties: string[];
  rating: number;
  experienceYears: number;
  agency: string;
  phone?: string;
email?: string;
};

export async function getGuides(): Promise<Guide[]> {
  const snapshot = await getDocs(collection(db, "guides"));

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Guide[];
}

export async function getGuideById(id: string): Promise<Guide | null> {
  const ref = doc(db, "guides", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as Guide;
}