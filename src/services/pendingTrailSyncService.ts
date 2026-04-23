// import type { RecordedTrail } from "../app/navigationTypes";
// import { auth } from "./firebase";
// import {
//   getPendingSubmissions,
//   removePendingSubmission,
// } from "./trailRecordingStorage";
// import { saveRecordedTrailToFirestore } from "./recordTrailService";

// export async function syncPendingRecordedTrails(): Promise<void> {
//   const pending = await getPendingSubmissions();

//   for (const trail of pending) {
//     try {
//       await saveRecordedTrailToFirestore(trail as RecordedTrail);
//       await removePendingSubmission(trail.id);
//       console.log("Synced pending trail:", trail.id);
//     } catch (error) {
//       console.log("Failed to sync pending trail:", trail.id, error);
//     }
//   }
// }

// export async function syncPendingRecordedTrails(): Promise<void> {
//   const user = auth.currentUser;

//   if (!user) {
//     console.log("Skip pending trail sync: user not authenticated");
//     return;
//   }

//   const pending = await getPendingSubmissions();

//   for (const trail of pending) {
//     try {
//       await saveRecordedTrailToFirestore(trail as RecordedTrail);
//       await removePendingSubmission(trail.id);
//       console.log("Synced pending trail:", trail.id);
//     } catch (error: any) {
//       if (error?.message === "User not authenticated") {
//         console.log("Pending trail kept locally until login:", trail.id);
//         return;
//       }

//       console.log("Failed to sync pending trail:", trail.id, error);
//     }
//   }
// }


import type { RecordedTrail } from "../app/navigationTypes";
import { auth } from "./firebase";
import {
  getPendingSubmissions,
  removePendingSubmission,
} from "./trailRecordingStorage";
import { saveRecordedTrailToFirestore } from "./recordTrailService";

export async function syncPendingRecordedTrails(): Promise<void> {
  const user = auth.currentUser;

  if (!user) {
    console.log("Skip pending trail sync: user not authenticated");
    return;
  }

  const pending = await getPendingSubmissions();

  for (const trail of pending) {
    try {
      await saveRecordedTrailToFirestore(trail as RecordedTrail);
      await removePendingSubmission(trail.id);
      console.log("Synced pending trail:", trail.id);
    } catch (error: any) {
      if (error?.message === "User not authenticated") {
        console.log("Pending trail kept locally until login:", trail.id);
        return;
      }

      console.log("Failed to sync pending trail:", trail.id, error);
    }
  }
}