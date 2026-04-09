export type TrailStatus =
  | "draft"
  | "pending_ai"
  | "pending_review"
  | "approved"
  | "rejected";

export type AIVerificationDecision = "approve" | "review" | "reject" | null;

export type TrailCoordinate = {
  latitude: number;
  longitude: number;
};

export type TrailSubmission = {
  id?: string;
  name: string;
  description: string;
  region: string;
  village: string;
  difficulty: "Easy" | "Medium" | "Hard";
  features: string[];
  mediaUrls: string[];
  waypointNotes: string;
  route: TrailCoordinate[];
  routeStats: {
    distanceKm: number;
    durationHours: number;
    elevationGain: number;
  };
  submittedBy: string;
  createdAt: number | null;
  status: TrailStatus;
  aiVerification: {
    decision: AIVerificationDecision;
    score: number | null;
    suggestedDifficulty: string | null;
    reasons: string[];
    flags: string[];
    verifiedAt: number | null;
  };
};