import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import type { LocationPoint, RecordedTrail } from "../app/navigationTypes";
import {
  getActiveRecording,
  saveActiveRecording,
} from "./trailRecordingStorage";
import { calculateTotalDistance } from "./trailRecordingUtils";

export const BACKGROUND_LOCATION_TASK = "background-trail-task";

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.log("Background location task error:", error);
    return;
  }

  try {
    const recording = await getActiveRecording();

    if (!recording || recording.status !== "recording") {
      return;
    }

    const { locations } = data as { locations: Location.LocationObject[] };
    if (!locations?.length) return;

    // const newPoints: LocationPoint[] = locations.map((location) => ({
    //   latitude: location.coords.latitude,
    //   longitude: location.coords.longitude,
    //   timestamp: location.timestamp ?? Date.now(),
    //   accuracy: location.coords.accuracy ?? undefined,
    //   altitude: location.coords.altitude ?? null,
    //   speed: location.coords.speed ?? null,
    // }));

    // const nextCoordinates = [...recording.coordinates, ...newPoints];

    const newPoints: LocationPoint[] = locations.map((location) => ({
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
  timestamp: location.timestamp ?? Date.now(),
  accuracy: location.coords.accuracy ?? undefined,
  altitude: location.coords.altitude ?? null,
  speed: location.coords.speed ?? null,
}));

let nextCoordinates = [...recording.coordinates];

for (const point of newPoints) {
  console.log("NEW GPS POINT:", {
    lat: point.latitude,
    lng: point.longitude,
  });

  const last = nextCoordinates[nextCoordinates.length - 1];

  // ✅ Skip if no previous point
  if (!last) {
    nextCoordinates.push(point);
    continue;
  }

  // 🔥 Ignore identical coordinates
  const sameLocation =
    Math.abs(point.latitude - last.latitude) < 0.00001 &&
    Math.abs(point.longitude - last.longitude) < 0.00001;

  // 🔥 Ignore very small movement (< ~2 meters)
  const tooClose =
    Math.abs(point.latitude - last.latitude) < 0.00002 &&
    Math.abs(point.longitude - last.longitude) < 0.00002;

  if (sameLocation || tooClose) {
    continue;
  }

  nextCoordinates.push(point);
}

    const updated: RecordedTrail = {
      ...recording,
      coordinates: nextCoordinates,
      distanceMeters: calculateTotalDistance(nextCoordinates),
      durationSeconds: Math.floor((Date.now() - recording.startedAt) / 1000),
    };

    await saveActiveRecording(updated);
  } catch (taskError) {
    console.log("Failed to save background trail point:", taskError);
  }
});