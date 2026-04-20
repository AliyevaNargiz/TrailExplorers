import type { RecordedTrail } from "../app/navigationTypes";
import {
  getPendingSubmissions,
  removePendingSubmission,
} from "./trailRecordingStorage";
import { saveRecordedTrailToFirestore } from "./recordTrailService";

export async function syncPendingRecordedTrails(): Promise<void> {
  const pending = await getPendingSubmissions();

  for (const trail of pending) {
    try {
      await saveRecordedTrailToFirestore(trail as RecordedTrail);
      await removePendingSubmission(trail.id);
      console.log("Synced pending trail:", trail.id);
    } catch (error) {
      console.log("Failed to sync pending trail:", trail.id, error);
    }
  }
}