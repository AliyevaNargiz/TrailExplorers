import type { Trail } from "../data/trails";

export type NewTrailDraft = {
  name: string;
  description: string;
  region: string;
  village: string;
  difficulty: "Easy" | "Medium" | "Hard";
  features: string[];
};

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Main: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  About: undefined;
  ManageAccount: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  TrailDetail: { id: string };
  AllTrails: undefined;

  OfflineMap: {
    trail: Trail;
    navigationMode?: boolean;
  };

  AddNewTrailBasic: undefined;
  AddNewTrailMedia: {
    draft: NewTrailDraft;
  };
  TrailSubmission: {
    submissionId: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Eco: undefined;
  Friends: undefined;
  Maps: undefined;
};
