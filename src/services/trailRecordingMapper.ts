import type { RecordedTrail } from "../app/navigationTypes";

export function mapRecordedTrailToMediaDraft(recordedTrail: RecordedTrail) {
  const route =
    recordedTrail.coordinates?.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    })) ?? [];

  return {
    route,
    distanceKm: Number(((recordedTrail.distanceMeters ?? 0) / 1000).toFixed(1)),
    durationHours: Number(
      ((recordedTrail.durationSeconds ?? 0) / 3600).toFixed(1)
    ),
    elevationGain: 0,
    sourceRecordedTrailId: recordedTrail.id,
  };
}