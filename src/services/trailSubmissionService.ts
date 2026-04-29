import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
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

export type PublicTrailSubmissionItem = {
  id: string;
  name: string;
  description: string;
  region: string;
  village: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: string;
  distanceKm: number;
  durationHours: number;
  elevationGain: number;
  features: string[];
  mediaUrls: string[];
  createdAt: any;
  averageRating: number;
  reviewCount: number;
};

export type PublicTrailReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: any;
  reviewer: {
    uid: string;
    name: string;
    photoURL: string;
  };
};

export type PublicUserProfile = {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  homeRegion: string;
  bio: string;
  submissionsCount: number;
  approvedSubmissionsCount: number;
  latestSubmissionAt: any;
};

const FALLBACK_AVATAR = "";

function getTimestampMillis(value: any) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }
  if (typeof value === "number") return value;

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mapSubmissionDoc(
  id: string,
  data: Record<string, any>
): PublicTrailSubmissionItem {
  return {
    id,
    name: data.name ?? "Untitled Trail",
    description: data.description ?? "",
    region: data.region ?? "",
    village: data.village ?? "",
    difficulty: data.difficulty ?? "Easy",
    status: data.status ?? "pending_ai",
    distanceKm: data.routeStats?.distanceKm ?? 0,
    durationHours: data.routeStats?.durationHours ?? 0,
    elevationGain: data.routeStats?.elevationGain ?? 0,
    features: Array.isArray(data.features) ? data.features : [],
    mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
    createdAt: data.createdAt ?? null,
    averageRating: 0,
    reviewCount: 0,
  };
}

function mapReviewDoc(id: string, data: Record<string, any>): PublicTrailReview {
  return {
    id,
    rating:
      typeof data.rating === "number" && data.rating >= 1 && data.rating <= 5
        ? data.rating
        : 0,
    comment: data.comment ?? "",
    createdAt: data.createdAt ?? null,
    reviewer: {
      uid: data.reviewer?.uid ?? "",
      name: data.reviewer?.name ?? "Trail Explorer",
      photoURL: data.reviewer?.photoURL ?? "",
    },
  };
}

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
    return mapSubmissionDoc(doc.id, doc.data());
  });
}

export async function deleteTrailSubmission(submissionId: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  await deleteDoc(doc(db, "trail_submissions", submissionId));
}

export async function fetchTrailSubmissionsByUserId(userId: string) {
  const q = query(
    collection(db, "trail_submissions"),
    where("submittedBy.uid", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs
    .map((snapshot) => mapSubmissionDoc(snapshot.id, snapshot.data()))
    .sort(
      (a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt)
    );
}

export async function fetchTrailReviews(submissionId: string) {
  const snap = await getDocs(
    collection(db, "trail_submissions", submissionId, "reviews")
  );

  return snap.docs
    .map((snapshot) => mapReviewDoc(snapshot.id, snapshot.data()))
    .sort(
      (a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt)
    );
}

export async function fetchTrailReviewSummaries(submissionIds: string[]) {
  const summaries = await Promise.all(
    submissionIds.map(async (submissionId) => {
      const reviews = await fetchTrailReviews(submissionId);
      const ratingTotal = reviews.reduce(
        (sum, review) => sum + (Number.isFinite(review.rating) ? review.rating : 0),
        0
      );
      const reviewCount = reviews.length;

      return {
        submissionId,
        reviewCount,
        averageRating:
          reviewCount > 0
            ? Number((ratingTotal / reviewCount).toFixed(1))
            : 0,
      };
    })
  );

  return new Map(
    summaries.map((summary) => [
      summary.submissionId,
      {
        averageRating: summary.averageRating,
        reviewCount: summary.reviewCount,
      },
    ])
  );
}

export async function submitTrailReview(input: {
  submissionId: string;
  rating: number;
  comment: string;
}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const normalizedRating = Math.max(1, Math.min(5, Math.round(input.rating)));
  const normalizedComment = input.comment.trim();

  if (!normalizedComment) {
    throw new Error("Comment is required");
  }

  await setDoc(
    doc(db, "trail_submissions", input.submissionId, "reviews", user.uid),
    {
      rating: normalizedRating,
      comment: normalizedComment,
      reviewer: {
        uid: user.uid,
        name: user.displayName || "Trail Explorer",
        photoURL: user.photoURL || "",
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function fetchPublicUserProfile(userId: string) {
  const [userSnap, submissions] = await Promise.all([
    getDoc(doc(db, "users", userId)),
    fetchTrailSubmissionsByUserId(userId),
  ]);

  const userData = userSnap.exists() ? userSnap.data() : null;
  const latestSubmissionAt = submissions[0]?.createdAt ?? null;

  return {
    uid: userId,
    name: userData?.name ?? "",
    email: userData?.email ?? "",
    photoURL: userData?.photoURL ?? FALLBACK_AVATAR,
    homeRegion: userData?.homeRegion ?? "",
    bio: userData?.bio ?? "",
    submissionsCount: submissions.length,
    approvedSubmissionsCount: submissions.filter(
      (submission) => submission.status === "approved"
    ).length,
    latestSubmissionAt,
  } satisfies PublicUserProfile;
}

export async function fetchCommunityProfiles() {
  const [usersSnap, submissionsSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "trail_submissions")),
  ]);

  const currentUserId = auth.currentUser?.uid;

  const profileMap = new Map<string, PublicUserProfile>();

  usersSnap.docs.forEach((snapshot) => {
    const data = snapshot.data();

    if (snapshot.id === currentUserId) return;

    profileMap.set(snapshot.id, {
      uid: snapshot.id,
      name: data.name ?? "",
      email: data.email ?? "",
      photoURL: data.photoURL ?? FALLBACK_AVATAR,
      homeRegion: data.homeRegion ?? "",
      bio: data.bio ?? "",
      submissionsCount: 0,
      approvedSubmissionsCount: 0,
      latestSubmissionAt: null,
    });
  });

  submissionsSnap.docs.forEach((snapshot) => {
    const data = snapshot.data();
    const submitter = data.submittedBy ?? {};
    const uid = submitter.uid;

    if (!uid || uid === currentUserId) return;

    const existing = profileMap.get(uid);
    const createdAt = data.createdAt ?? null;
    const createdAtMillis = getTimestampMillis(createdAt);
    const latestSubmissionMillis = getTimestampMillis(existing?.latestSubmissionAt);

    profileMap.set(uid, {
      uid,
      name: existing?.name || submitter.name || "Trail Explorer",
      email: existing?.email || submitter.email || "",
      photoURL: existing?.photoURL || submitter.photoURL || FALLBACK_AVATAR,
      homeRegion: existing?.homeRegion || data.region || "",
      bio: existing?.bio || "",
      submissionsCount: (existing?.submissionsCount ?? 0) + 1,
      approvedSubmissionsCount:
        (existing?.approvedSubmissionsCount ?? 0) +
        (data.status === "approved" ? 1 : 0),
      latestSubmissionAt:
        createdAtMillis > latestSubmissionMillis
          ? createdAt
          : existing?.latestSubmissionAt ?? createdAt,
    });
  });

  return Array.from(profileMap.values()).sort((a, b) => {
    const submissionsDelta = b.submissionsCount - a.submissionsCount;
    if (submissionsDelta !== 0) return submissionsDelta;

    return (
      getTimestampMillis(b.latestSubmissionAt) -
      getTimestampMillis(a.latestSubmissionAt)
    );
  });
}
