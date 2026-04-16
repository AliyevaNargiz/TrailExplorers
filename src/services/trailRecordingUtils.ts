import type { LocationPoint } from "../app/navigationTypes";

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function distanceBetweenPoints(a: LocationPoint, b: LocationPoint): number {
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const hav =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
  return R * c;
}

export function calculateTotalDistance(points: LocationPoint[]): number {
  if (points.length < 2) return 0;

  let total = 0;

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const next = points[i];

    const accuracy = next.accuracy ?? 999;
    if (accuracy > 50) continue;

    const segment = distanceBetweenPoints(prev, next);

    if (segment < 2) continue;
    if (segment > 300) continue;

    total += segment;
  }

  return Math.round(total);
}
