export type Trail = {
  id: string;
  name: string;
  region: string;
  distanceKm: number;
  durationHours: number;
  difficulty: "Easy" | "Moderate" | "Hard";
  elevationM: number;
  description: string;
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
  },
];
