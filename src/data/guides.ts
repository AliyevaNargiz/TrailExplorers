export type Guide = {
  id: string;
  name: string;
  title: string;
  agency: string;
  region: string;
  bio: string;
  languages: string[];
  specialties: string[];
  yearsExperience: number;
  rating: number;
  hikesLed: number;
  imageUrl?: string;
};

export const guides: Guide[] = [
  {
    id: "guide-1",
    name: "Guide 1",
    title: "Mountain Trek Guide",
    agency: "Caspian Trail Collective",
    region: "Shamakhi",
    bio: "Guide 1 leads scenic ridge and forest routes with a strong focus on safety, pacing, and first-time hiker confidence.",
    languages: ["English", "Azerbaijani"],
    specialties: ["Day hikes", "Beginner groups", "Scenic photography stops"],
    yearsExperience: 6,
    rating: 4.9,
    hikesLed: 148,
  },
  {
    id: "guide-2",
    name: "Guide 2",
    title: "Adventure Expedition Guide",
    agency: "Peak Nomads",
    region: "Gusar",
    bio: "Guide 2 specializes in high-energy alpine routes and multi-stop trekking plans for travelers who want a more challenging day outdoors.",
    languages: ["English", "Azerbaijani", "Russian"],
    specialties: ["Summit routes", "Advanced hikers", "Custom itineraries"],
    yearsExperience: 9,
    rating: 4.8,
    hikesLed: 212,
  },
  {
    id: "guide-3",
    name: "Guide 3",
    title: "Eco & Culture Trail Guide",
    agency: "Green Path Tours",
    region: "Lahij",
    bio: "Guide 3 blends nature walks with local history and village storytelling, making each trip feel grounded in place and culture.",
    languages: ["English", "Azerbaijani", "Turkish"],
    specialties: ["Cultural trails", "Eco tours", "Small groups"],
    yearsExperience: 5,
    rating: 4.7,
    hikesLed: 96,
  },
  {
    id: "guide-4",
    name: "Guide 4",
    title: "Family Hiking Guide",
    agency: "Wild Weekend Co.",
    region: "Gabala",
    bio: "Guide 4 designs relaxed, family-friendly routes with clear rest stops, flexible pacing, and a warm group-leading style.",
    languages: ["English", "Azerbaijani"],
    specialties: ["Family hikes", "Weekend escapes", "Comfort-focused routes"],
    yearsExperience: 7,
    rating: 4.8,
    hikesLed: 131,
  },
];

export function getGuideById(guideId: string) {
  return guides.find((guide) => guide.id === guideId) ?? null;
}
