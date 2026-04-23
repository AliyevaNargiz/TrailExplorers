import { addDoc, collection, serverTimestamp, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage  } from "./firebase";

// type SubmissionPayload = {
//   name: string;
//   description: string;
//   region: string;
//   village: string;
//   difficulty: "Easy" | "Medium" | "Hard";
//   features: string[];
//   waypointNotes: string;
//   mediaUrls: string[];
//   route: { latitude: number; longitude: number }[];
//   routeStats: {
//     distanceKm: number;
//     durationHours: number;
//     elevationGain: number;
//   };
// };

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
  sourceRecordedTrailId?: string | null;
};

export async function uploadTrailImageAsync(uri: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = `trail-submissions/${user.uid}/${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);

  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

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

export async function fetchMyTrailSubmissions() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const q = query(
    collection(db, "trail_submissions"),
    where("submittedBy.uid", "==", user.uid)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name ?? "Untitled Trail",
      description: data.description ?? "",
      region: data.region ?? "",
      village: data.village ?? "",
      difficulty: data.difficulty ?? "Easy",
      status: data.status ?? "pending_ai",
      distanceKm: data.routeStats?.distanceKm ?? 0,
      durationHours: data.routeStats?.durationHours ?? 0,
      elevationGain: data.routeStats?.elevationGain ?? 0,
      createdAt: data.createdAt ?? null,
    };
  });
}