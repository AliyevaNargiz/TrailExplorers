import type { RecordedTrail } from "../app/navigationTypes";

export function formatRecordedTrailTitle(trail: RecordedTrail) {
  return `Trail ${new Date(trail.startedAt).toLocaleString()}`;
}

export function formatRecordedTrailDistance(trail: RecordedTrail) {
  return `${((trail.distanceMeters ?? 0) / 1000).toFixed(1)} km`;
}

export function formatRecordedTrailDuration(trail: RecordedTrail) {
  const totalSeconds = trail.durationSeconds ?? 0;
  const hours = totalSeconds / 3600;

  if (hours >= 1) {
    return `${hours.toFixed(1)} hr`;
  }

  const minutes = Math.round(totalSeconds / 60);
  return `${minutes} min`;
}