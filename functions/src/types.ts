export type TrailDifficulty = "Easy" | "Medium" | "Hard";

export type TrailSubmissionPayload = {
  name: string;
  description: string;
  region: string;
  village: string;
  difficulty: TrailDifficulty;
  features: string[];
  waypointNotes: string;
  mediaUrls: string[];
  route: { latitude: number; longitude: number }[];
  routeStats: {
    distanceKm: number;
    durationHours: number;
    elevationGain: number;
  };
  submittedBy?: {
    uid: string;
    name?: string;
    email?: string;
    photoURL?: string;
  };
};

export type AIVerificationDecision =
  | "approved"
  | "needs_review"
  | "rejected";

export type AIVerificationResult = {
  decision: AIVerificationDecision;
  score: number;
  suggestedDifficulty: TrailDifficulty | null;
  reasons: string[];
  flags: string[];
  summary: string;
};