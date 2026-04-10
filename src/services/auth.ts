import { Platform } from "react-native";

export function useGoogleSignIn() {
  if (Platform.OS === "ios") {
    return require("./auth.ios").useGoogleSignIn();
  }

  return require("./auth.android").useGoogleSignIn();
}