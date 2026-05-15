// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db, auth } from "./firebase";
// import type { RecordedTrail } from "../app/navigationTypes";

// export async function saveRecordedTrailToFirestore(trail: RecordedTrail) {
//   const user = auth.currentUser;

//   if (!user) {
//     throw new Error("User not authenticated");
//   }

//   const docRef = await addDoc(collection(db, "trails"), {
//     userId: user.uid,
//     title: `Trail ${new Date(trail.startedAt).toLocaleString()}`,
//     startedAt: trail.startedAt,
//     finishedAt: trail.finishedAt ?? Date.now(),
//     durationSeconds: trail.durationSeconds,
//     distanceMeters: trail.distanceMeters,
//     pointCount: trail.coordinates?.length ?? 0,
//     status: "completed",
//     points: (trail.coordinates ?? []).map((point) => ({
//       latitude: point.latitude,
//       longitude: point.longitude,
//       timestamp: point.timestamp ?? Date.now(),
//       accuracy: point.accuracy ?? null,
//       altitude: point.altitude ?? null,
//       speed: point.speed ?? null,
//     })),
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp(),
//   });

//   return docRef.id;
// }

// import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db, auth } from "./firebase";
import type { RecordedTrail } from "../app/navigationTypes";

export async function saveRecordedTrailToFirestore(trail: RecordedTrail) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const ref = doc(db, "recorded_trails", trail.id);

  await setDoc(
    ref,
    {
      userId: user.uid,
      title: trail.title || "Unnamed Trail",
      startedAt: trail.startedAt,
      finishedAt: trail.finishedAt ?? Date.now(),
      durationSeconds: trail.durationSeconds,
      distanceMeters: trail.distanceMeters,
      pointCount: trail.coordinates?.length ?? 0,
      status: "completed",
      points: (trail.coordinates ?? []).map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: point.timestamp ?? Date.now(),
        accuracy: point.accuracy ?? null,
        altitude: point.altitude ?? null,
        speed: point.speed ?? null,
      })),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  return trail.id;
}

export async function fetchRecordedTrailsForCurrentUser(): Promise<RecordedTrail[]> {
  const user = auth.currentUser;

  if (!user) {
    return [];
  }

  const q = query(
    collection(db, "recorded_trails"),
    where("userId", "==", user.uid)
  );

  const snap = await getDocs(q);

  const trails = snap.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      title: data.title ?? "Unnamed Trail", // ✅ ADD THIS
      status:
        data.status === "recording" ||
        data.status === "paused" ||
        data.status === "finished"
          ? data.status
          : "finished",
      startedAt: data.startedAt ?? 0,
      finishedAt: data.finishedAt,
      durationSeconds: data.durationSeconds ?? 0,
      distanceMeters: data.distanceMeters ?? 0,
      coordinates: Array.isArray(data.points)
        ? data.points.map((point: any) => ({
            latitude: point.latitude,
            longitude: point.longitude,
            timestamp: point.timestamp ?? Date.now(),
            accuracy: point.accuracy ?? undefined,
            altitude: point.altitude ?? null,
            speed: point.speed ?? null,
          }))
        : [],
    } as RecordedTrail;
  });

  return trails.sort((a, b) => b.startedAt - a.startedAt);
}