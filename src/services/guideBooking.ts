import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type GuideBookingInput = {
  guideId: string;
  guideName: string;
  userId: string;
  userEmail?: string | null;
  date: string;
  timeSlot: string;
  guidePhone?: string;
  guideEmail?: string;
};

export async function bookGuide(data: GuideBookingInput) {
  return addDoc(collection(db, "guideBookings"), {
    ...data,
    userEmail: data.userEmail ?? "",
    guidePhone: data.guidePhone ?? "",
    guideEmail: data.guideEmail ?? "",
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getBookedTimeSlots(guideId: string, date: string) {
  const q = query(
    collection(db, "guideBookings"),
    where("guideId", "==", guideId),
    where("date", "==", date),
    where("status", "in", ["pending", "approved"])
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data().timeSlot as string);
}