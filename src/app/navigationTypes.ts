import type { Trail } from "../data/trails";

export type NewTrailDraft = {
  name: string;
  description: string;
  region: string;
  village: string;
  difficulty: "Easy" | "Medium" | "Hard";
  features: string[];
};

export type LocationPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  altitude?: number | null;
  speed?: number | null;
};

export type RecordedTrail = {
  id: string;
  status: "recording" | "paused" | "finished";
  startedAt: number;
  finishedAt?: number;
  durationSeconds: number;
  distanceMeters: number;
  coordinates: LocationPoint[];
};

export type PendingTrailSubmission = {
  id: string;
  createdAt: number;
  name: string;
  description: string;
  region: string;
  village: string;
  difficulty: "Easy" | "Medium" | "Hard";
  features: string[];
  route: RecordedTrail | null;
};


export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Main: undefined;
  Settings: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  About: undefined;
  ManageAccount: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  TrailDetail: { id: string };
  AllTrails: undefined;
  OfflineMaps: undefined;

  OfflineMap: {
    trail: Trail;
    navigationMode?: boolean;
  };

  AddNewTrailBasic: undefined;
  AddNewTrailMedia: {
    draft: NewTrailDraft;
  };

  RecordTrail: undefined;

  TrailSubmission: {
    submissionId?: string;
    recordedTrail?: RecordedTrail;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Eco: undefined;
  Friends: undefined;
  Maps: undefined;
};