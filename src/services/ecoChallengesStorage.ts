import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

export type EcoChallengesProgress = {
  completedIds: string[];
  claimedRewardIds: string[];
};

const STORAGE_KEY = "trail-explorers-eco-progress";

const defaultProgress: EcoChallengesProgress = {
  completedIds: [],
  claimedRewardIds: [],
};

function unique(values: string[]) {
  return Array.from(new Set(values));
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
  const mergedProgress = mergeEcoChallengesProgress(localProgress, remoteProgress);

  await saveEcoChallengesProgress(mergedProgress);
  await saveEcoChallengesProgressToFirebase(mergedProgress);

  return mergedProgress;
}
