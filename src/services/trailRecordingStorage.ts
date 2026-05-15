import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RecordedTrail } from "../app/navigationTypes";

const ACTIVE_RECORDING_KEY = "activeTrailRecording";
const PENDING_SUBMISSIONS_KEY = "pendingTrailSubmissions";

export async function saveActiveRecording(recording: RecordedTrail): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_RECORDING_KEY, JSON.stringify(recording));
}

export async function getActiveRecording(): Promise<RecordedTrail | null> {
  const raw = await AsyncStorage.getItem(ACTIVE_RECORDING_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RecordedTrail;
  } catch {
    return null;
  }
}

export async function clearActiveRecording(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_RECORDING_KEY);
}

export async function savePendingSubmission(recording: RecordedTrail): Promise<void> {
  const raw = await AsyncStorage.getItem(PENDING_SUBMISSIONS_KEY);
  const current: RecordedTrail[] = raw ? JSON.parse(raw) : [];
  // current.push(recording);
  // await AsyncStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(current));
    const exists = current.some((item) => item.id === recording.id);
  const next = exists
    ? current.map((item) => (item.id === recording.id ? recording : item))
    : [...current, recording];

  await AsyncStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(next));
}

export async function getPendingSubmissions(): Promise<RecordedTrail[]> {
  const raw = await AsyncStorage.getItem(PENDING_SUBMISSIONS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as RecordedTrail[];
  } catch {
    return [];
  }
}

export async function removePendingSubmission(recordingId: string): Promise<void> {
  const raw = await AsyncStorage.getItem(PENDING_SUBMISSIONS_KEY);
  const current: RecordedTrail[] = raw ? JSON.parse(raw) : [];
  const next = current.filter((item) => item.id !== recordingId);
  await AsyncStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(next));
}