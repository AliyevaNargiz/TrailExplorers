import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

type SubmissionPayload = {
  name: string;
  description: string;
  region: string;
  village: string;
  difficulty: "Easy" | "Medium" | "Hard";
  features: string[];
  waypointNotes: string;
  mediaUrls: string[];
  route: { latitude: number; longitude: number }[];
  routeStats: {
    distanceKm: number;
    durationHours: number;
    elevationGain: number;
  };
};

export async function submitTrailSubmission(payload: SubmissionPayload) {
  const docRef = await addDoc(collection(db, "trail_submissions"), {
    ...payload,
    status: "pending_ai",
    createdAt: serverTimestamp(),
    aiVerification: {
      decision: null,
      score: null,
      suggestedDifficulty: null,
      reasons: [],
      flags: [],
      verifiedAt: null,
    },
  });

  return { submissionId: docRef.id };
}