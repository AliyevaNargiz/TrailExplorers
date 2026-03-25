import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

// No configure needed for Expo Go auth-session.
// We’ll do everything in auth.ts
export function configureGoogleSignIn() {}