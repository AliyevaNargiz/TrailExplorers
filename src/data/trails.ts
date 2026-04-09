export type LatLng = {
  latitude: number;
  longitude: number;
};

export type Trail = {
  id: string;
  name: string;
  region: string;
  distanceKm: number;
  durationHours: number;
  difficulty: "Easy" | "Moderate" | "Hard";
  elevationM: number;
  description: string;
  
  startLocation: LatLng;
  endLocation?: LatLng;
  center: LatLng;
  route: LatLng[];
  minZoom?: number;
  maxZoom?: number;
};

export const TRAILS: Trail[] = [
  {
    id: "qaranohur",
    name: "Qaranohur Lake Loop",
    region: "Quba Highlands",
    distanceKm: 10.5,
    durationHours: 3.2,
    difficulty: "Moderate",
    elevationM: 540,
    description:
      "Rolling forest ridges and open meadows with a sweeping view of the lake at sunset.",
      center: { latitude: 40.936, longitude: 47.941 },
  startLocation: { latitude: 40.934, longitude: 47.938 },
  endLocation: { latitude: 40.934, longitude: 47.938 },
  route: [
    { latitude: 40.934, longitude: 47.938 },
    { latitude: 40.935, longitude: 47.940 },
    { latitude: 40.936, longitude: 47.943 },
    { latitude: 40.938, longitude: 47.944 },
    { latitude: 40.937, longitude: 47.941 },
    { latitude: 40.934, longitude: 47.938 },
  ],
  },
  {
    id: "goygol",
    name: "Goygol Forest Walk",
    region: "Goygol National Park",
    distanceKm: 6.4,
    durationHours: 1.8,
    difficulty: "Easy",
    elevationM: 220,
    description:
      "Gentle trail under tall pines and alpine air, perfect for a half-day escape.",
    center: { latitude: 40.585, longitude: 46.319 },
  startLocation: { latitude: 40.582, longitude: 46.315 },
  endLocation: { latitude: 40.588, longitude: 46.323 },
  route: [
    { latitude: 40.582, longitude: 46.315 },
    { latitude: 40.584, longitude: 46.317 },
    { latitude: 40.586, longitude: 46.320 },
    { latitude: 40.588, longitude: 46.323 },
  ],
    },
  {
    id: "lahic",
    name: "Lahic Ridge Trail",
    region: "Ismayilli",
    distanceKm: 14.2,
    durationHours: 4.5,
    difficulty: "Hard",
    elevationM: 860,
    description:
      "Steep climbs reward you with stone-village panoramas and a dramatic ridge line.",
     center: { latitude: 40.848, longitude: 48.395 },
  startLocation: { latitude: 40.844, longitude: 48.390 },
  endLocation: { latitude: 40.855, longitude: 48.405 },
  route: [
    { latitude: 40.844, longitude: 48.390 },
    { latitude: 40.847, longitude: 48.395 },
    { latitude: 40.850, longitude: 48.400 },
    { latitude: 40.853, longitude: 48.403 },
    { latitude: 40.855, longitude: 48.405 },
  ],
    },
  {
    id: "tufandag",
    name: "Tufandag Summit Path",
    region: "Qabala",
    distanceKm: 8.8,
    durationHours: 3.7,
    difficulty: "Moderate",
    elevationM: 710,
    description:
      "A crisp ascent through cloud shadows, finishing with a wide-open summit view.",
        center: { latitude: 40.995, longitude: 47.870 },
  startLocation: { latitude: 40.990, longitude: 47.865 },
  endLocation: { latitude: 41.000, longitude: 47.875 },
  route: [
    { latitude: 40.990, longitude: 47.865 },
    { latitude: 40.993, longitude: 47.868 },
    { latitude: 40.996, longitude: 47.872 },
    { latitude: 41.000, longitude: 47.875 },
  ],

  },
  {
  id: "shamakhi",
  name: "Shamakhi",
  region: "Shamakhi, Demirchi village",
  distanceKm: 6.5,
  durationHours: 3.5,
  difficulty: "Moderate",
  elevationM: 400,
  description: "Add your description here",
    center: { latitude: 40.631, longitude: 48.640 },
  startLocation: { latitude: 40.628, longitude: 48.635 },
  endLocation: { latitude: 40.635, longitude: 48.645 },
  route: [
    { latitude: 40.628, longitude: 48.635 },
    { latitude: 40.630, longitude: 48.638 },
    { latitude: 40.632, longitude: 48.642 },
    { latitude: 40.635, longitude: 48.645 },
  ],
},
{
  id: "gurgur",
  name: "Gurgur Waterfall",
  region: "Quba, Griz",
  distanceKm: 3.5,
  durationHours: 2,
  difficulty: "Easy",
  elevationM: 250,
  description: "Add your description here",
    center: { latitude: 41.275, longitude: 48.275 },
  startLocation: { latitude: 41.270, longitude: 48.270 },
  endLocation: { latitude: 41.278, longitude: 48.280 },
  route: [
    { latitude: 41.270, longitude: 48.270 },
    { latitude: 41.273, longitude: 48.273 },
    { latitude: 41.275, longitude: 48.277 },
    { latitude: 41.278, longitude: 48.280 },
  ],
},
];
