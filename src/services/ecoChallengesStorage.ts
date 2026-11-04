// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

// import { auth, db } from "./firebase";

// export type ChallengeProof = {
//   challengeId: string;
//   imageUrl: string;
//   completedAt: number;
// };

// export type EcoChallengesProgress = {
//   completedIds: string[];
//   claimedRewardIds: string[];
//   proofs: ChallengeProof[];
// };
// const STORAGE_KEY = "trail-explorers-eco-progress";

// const defaultProgress: EcoChallengesProgress = {
//   completedIds: [],
//   claimedRewardIds: [],
//   proofs: [],
// };

// function unique(values: string[]) {
//   return Array.from(new Set(values));
// }

// function uniqueProofs(values: ChallengeProof[]) {
//   const map = new Map<string, ChallengeProof>();

//   values.forEach((proof) => {
//     map.set(proof.challengeId, proof);
//   });

//   return Array.from(map.values());
// }

// export function mergeEcoChallengesProgress(
//   ...progressItems: Array<Partial<EcoChallengesProgress> | null | undefined>
// ) {
//   return progressItems.reduce<EcoChallengesProgress>(
//     (merged, item) => ({
//       proofs: uniqueProofs([
//   ...merged.proofs,
//   ...(Array.isArray(item?.proofs) ? item!.proofs : []),
// ]),
//       completedIds: unique([
//         ...merged.completedIds,
//         ...(Array.isArray(item?.completedIds) ? item!.completedIds : []),
//       ]),
//       claimedRewardIds: unique([
//         ...merged.claimedRewardIds,
//         ...(Array.isArray(item?.claimedRewardIds) ? item!.claimedRewardIds : []),
//       ]),
//     }),
//     defaultProgress
//   );
// }

// function getEcoChallengesDocRef(uid: string) {
//   return doc(db, "users", uid, "progress", "ecoChallenges");
// }

// export async function loadEcoChallengesProgress() {
//   try {
//     const raw = await AsyncStorage.getItem(STORAGE_KEY);

//     if (!raw) {
//       return defaultProgress;
//     }

//     const parsed = JSON.parse(raw) as Partial<EcoChallengesProgress>;

//     return {
//       completedIds: Array.isArray(parsed.completedIds)
//         ? parsed.completedIds
//         : defaultProgress.completedIds,
//       claimedRewardIds: Array.isArray(parsed.claimedRewardIds)
//         ? parsed.claimedRewardIds
//         : defaultProgress.claimedRewardIds,

//          proofs: Array.isArray(parsed.proofs)
//     ? parsed.proofs
//     : defaultProgress.proofs,
//     };
//   } catch (error) {
//     console.log("Failed to load eco challenges progress", error);
//     return defaultProgress;
//   }
// }

// export async function saveEcoChallengesProgress(
//   progress: EcoChallengesProgress
// ) {
//   try {
//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
//   } catch (error) {
//     console.log("Failed to save eco challenges progress", error);
//   }
// }

// export async function loadEcoChallengesProgressFromFirebase() {
//   try {
//     const user = auth.currentUser;

//     if (!user) {
//       return null;
//     }

//     const snap = await getDoc(getEcoChallengesDocRef(user.uid));

//     if (!snap.exists()) {
//       return null;
//     }

//     const data = snap.data() as Partial<EcoChallengesProgress>;
//     return mergeEcoChallengesProgress(data);
//   } catch (error) {
//     console.log("Failed to load eco challenges progress from Firebase", error);
//     return null;
//   }
// }

// export async function saveEcoChallengesProgressToFirebase(
//   progress: EcoChallengesProgress
// ) {
//   try {
//     const user = auth.currentUser;

//     if (!user) {
//       return;
//     }

//     await setDoc(
//       getEcoChallengesDocRef(user.uid),
//       {
//         ...progress,
//         updatedAt: serverTimestamp(),
//       },
//       { merge: true }
//     );
//   } catch (error) {
//     console.log("Failed to save eco challenges progress to Firebase", error);
//   }
// }

// export async function loadMergedEcoChallengesProgress() {
//   const localProgress = await loadEcoChallengesProgress();
//   const remoteProgress = await loadEcoChallengesProgressFromFirebase();
//   const mergedProgress = mergeEcoChallengesProgress(localProgress, remoteProgress);

//   await saveEcoChallengesProgress(mergedProgress);
//   await saveEcoChallengesProgressToFirebase(mergedProgress);

//   return mergedProgress;
// }

import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

export type ChallengeProofStatus = "pending" | "approved" | "rejected";

export type ChallengeProof = {
  challengeId: string;
  imageUrl: string;
  submittedAt: number;
  status: ChallengeProofStatus;
  reviewedAt?: number;
  rejectionReason?: string;
};

export type EcoChallengesProgress = {
  completedIds: string[];
  claimedRewardIds: string[];
  proofs: ChallengeProof[];
};

const STORAGE_KEY = "trail-explorers-eco-progress";

const defaultProgress: EcoChallengesProgress = {
  completedIds: [],
  claimedRewardIds: [],
  proofs: [],
};

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function uniqueProofs(values: ChallengeProof[]) {
  const map = new Map<string, ChallengeProof>();

  values.forEach((proof) => {
    map.set(proof.challengeId, proof);
  });

  return Array.from(map.values());
}

export function mergeEcoChallengesProgress(
  ...progressItems: Array<Partial<EcoChallengesProgress> | null | undefined>
) {
  return progressItems.reduce<EcoChallengesProgress>(
    (merged, item) => ({
      completedIds: unique([
        ...merged.completedIds,
        ...(Array.isArray(item?.completedIds) ? item!.completedIds : []),
      ]),
      claimedRewardIds: unique([
        ...merged.claimedRewardIds,
        ...(Array.isArray(item?.claimedRewardIds) ? item!.claimedRewardIds : []),
      ]),
      proofs: uniqueProofs([
        ...merged.proofs,
        ...(Array.isArray(item?.proofs) ? item!.proofs : []),
      ]),
    }),
    defaultProgress
  );
}

function getEcoChallengesDocRef(uid: string) {
  return doc(db, "users", uid, "progress", "ecoChallenges");
}

export async function loadEcoChallengesProgress() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultProgress;
    }

    const parsed = JSON.parse(raw) as Partial<EcoChallengesProgress>;

    return {
      completedIds: Array.isArray(parsed.completedIds)
        ? parsed.completedIds
        : defaultProgress.completedIds,

      claimedRewardIds: Array.isArray(parsed.claimedRewardIds)
        ? parsed.claimedRewardIds
        : defaultProgress.claimedRewardIds,

      proofs: Array.isArray(parsed.proofs)
        ? parsed.proofs
        : defaultProgress.proofs,
    };
  } catch (error) {
    console.log("Failed to load eco challenges progress", error);
    return defaultProgress;
  }
}

export async function saveEcoChallengesProgress(
  progress: EcoChallengesProgress
) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.log("Failed to save eco challenges progress", error);
  }
}

export async function loadEcoChallengesProgressFromFirebase() {
  try {
    const user = auth.currentUser;

    if (!user) {
      return null;
    }

    const snap = await getDoc(getEcoChallengesDocRef(user.uid));

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data() as Partial<EcoChallengesProgress>;
    return mergeEcoChallengesProgress(data);
  } catch (error) {
    console.log("Failed to load eco challenges progress from Firebase", error);
    return null;
  }
}

export async function saveEcoChallengesProgressToFirebase(
  progress: EcoChallengesProgress
) {
  try {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    await setDoc(
      getEcoChallengesDocRef(user.uid),
      {
        ...progress,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.log("Failed to save eco challenges progress to Firebase", error);
  }
}

export async function loadMergedEcoChallengesProgress() {
  const localProgress = await loadEcoChallengesProgress();
  const remoteProgress = await loadEcoChallengesProgressFromFirebase();

  const mergedProgress = mergeEcoChallengesProgress(
    localProgress,
    remoteProgress
  );

  await saveEcoChallengesProgress(mergedProgress);
  await saveEcoChallengesProgressToFirebase(mergedProgress);

  return mergedProgress;
}