// import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import { db } from "./firebase";
// import type { Trail } from "../data/trails";

// export async function fetchTrails(): Promise<Trail[]> {
//   const snap = await getDocs(collection(db, "trails"));
//   return snap.docs.map((d) => {
//     const data = d.data() as Omit<Trail, "id">;
//     return { id: d.id, ...data };
//   });
// }

// export async function fetchTrailById(id: string) {
//   const ref = doc(db, "trails", id);
//   const snap = await getDoc(ref);
//   if (!snap.exists()) return null;

//   const data = snap.data() as Omit<Trail, "id">;
//   return { id: snap.id, ...data };
// }

// import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import type { Trail } from "../data/trails";
import type { RecordedTrail } from "../app/navigationTypes";

const DEFAULT_COORDINATE = { latitude: 40.4093, longitude: 49.8671 };

export async function fetchTrails(): Promise<Trail[]> {
  const snap = await getDocs(collection(db, "trails"));

  return snap.docs.map((d) => {
    const data = d.data();

    const route =
      Array.isArray(data.points) && data.points.length > 0
        ? data.points.map((point: any) => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }))
        : Array.isArray(data.route) && data.route.length > 0
        ? data.route.map((point: any) => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }))
        : [];

    const startLocation = route[0] ?? DEFAULT_COORDINATE;
    const endLocation = route.length ? route[route.length - 1] : undefined;
    const center = startLocation;

    return {
      id: d.id,
      name: data.name ?? data.title ?? "Untitled Trail",
      region: data.region ?? "Unknown Region",
      distanceKm:
        typeof data.distanceKm === "number"
          ? data.distanceKm
          : typeof data.distanceMeters === "number"
          ? data.distanceMeters / 1000
          : 0,
      durationHours:
        typeof data.durationHours === "number"
          ? data.durationHours
          : typeof data.durationSeconds === "number"
          ? data.durationSeconds / 3600
          : 0,
      difficulty:
        data.difficulty === "Easy" ||
        data.difficulty === "Moderate" ||
        data.difficulty === "Hard"
          ? data.difficulty
          : "Moderate",
      elevationM:
        typeof data.elevationM === "number"
          ? data.elevationM
          : typeof data.elevationGain === "number"
          ? data.elevationGain
          : 0,
      description: data.description ?? "Recorded trail",
      startLocation,
      endLocation,
      center,
      route,
      minZoom: data.minZoom,
      maxZoom: data.maxZoom,
    };
  });
}

export async function fetchTrailById(id: string): Promise<Trail | null> {
  const ref = doc(db, "trails", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  const route =
    Array.isArray(data.points) && data.points.length > 0
      ? data.points.map((point: any) => ({
          latitude: point.latitude,
          longitude: point.longitude,
        }))
      : Array.isArray(data.route) && data.route.length > 0
      ? data.route.map((point: any) => ({
          latitude: point.latitude,
          longitude: point.longitude,
        }))
      : [];

  const startLocation = route[0] ?? DEFAULT_COORDINATE;
  const endLocation = route.length ? route[route.length - 1] : undefined;
  const center = startLocation;

  return {
    id: snap.id,
    name: data.name ?? data.title ?? "Untitled Trail",
    region: data.region ?? "Unknown Region",
    distanceKm:
      typeof data.distanceKm === "number"
        ? data.distanceKm
        : typeof data.distanceMeters === "number"
        ? data.distanceMeters / 1000
        : 0,
    durationHours:
      typeof data.durationHours === "number"
        ? data.durationHours
        : typeof data.durationSeconds === "number"
        ? data.durationSeconds / 3600
        : 0,
    difficulty:
      data.difficulty === "Easy" ||
      data.difficulty === "Moderate" ||
      data.difficulty === "Hard"
        ? data.difficulty
        : "Moderate",
    elevationM:
      typeof data.elevationM === "number"
        ? data.elevationM
        : typeof data.elevationGain === "number"
        ? data.elevationGain
        : 0,
    description: data.description ?? "Recorded trail",
    startLocation,
    endLocation,
    center,
    route,
    minZoom: data.minZoom,
    maxZoom: data.maxZoom,
  };
}

export async function publishRecordedTrailToTrails(
  recordedTrail: RecordedTrail
): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const route =
    recordedTrail.coordinates?.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    })) ?? [];

  const docRef = await addDoc(collection(db, "trails"), {
    name:
      recordedTrail.title?.trim() ||
      `Trail ${new Date(recordedTrail.startedAt).toLocaleString()}`,
    title:
      recordedTrail.title?.trim() ||
      `Trail ${new Date(recordedTrail.startedAt).toLocaleString()}`,
    description: "Recorded trail",
    region: "Unknown Region",
    village: "",
    difficulty: "Easy",
    features: [],
    waypointNotes: "",
    mediaUrls: [],
    route,
    points: route,
    distanceKm: Number(((recordedTrail.distanceMeters ?? 0) / 1000).toFixed(2)),
    durationHours: Number(
      ((recordedTrail.durationSeconds ?? 0) / 3600).toFixed(2)
    ),
    elevationGain: 0,
    sourceRecordedTrailId: recordedTrail.id,
    createdBy: {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}