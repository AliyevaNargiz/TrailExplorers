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

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import type { RecordedTrail } from "../app/navigationTypes";

export async function saveRecordedTrailToFirestore(trail: RecordedTrail) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const ref = doc(db, "trails", trail.id);

  await setDoc(
    ref,
    {
      userId: user.uid,
      title: `Trail ${new Date(trail.startedAt).toLocaleString()}`,
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