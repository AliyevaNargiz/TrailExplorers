import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";

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
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }
  const docRef = await addDoc(collection(db, "trail_submissions"), {
    ...payload,
    submittedBy: {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
    },

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