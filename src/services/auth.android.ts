import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

type UserProfileDoc = {
  name: string;
  email: string;
  photoURL: string;
  provider: "google";
  role: "user";
  createdAt?: any;
  lastLoginAt?: any;
};

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val || val.trim().length === 0 || val.includes("xxxxx")) {
    throw new Error(`Missing env ${name}`);
  }
  return val;
}

GoogleSignin.configure({
  webClientId: requireEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"),
  offlineAccess: true,
});

export function useGoogleSignIn() {
  const request = true;

  const signIn = async () => {
    await GoogleSignin.hasPlayServices();

    const result = await GoogleSignin.signIn();

    if (!isSuccessResponse(result)) {
      throw new Error("Google sign-in was cancelled");
    }

    const idToken = result.data.idToken;
    if (!idToken) {
      throw new Error("Google sign-in failed: missing idToken");
    }

    const credential = GoogleAuthProvider.credential(idToken);
    const userCred = await signInWithCredential(auth, credential);
    const user = userCred.user;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const docData: UserProfileDoc = {
        name: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
        provider: "google",
        role: "user",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await setDoc(ref, docData);
    } else {
      await updateDoc(ref, {
        name: user.displayName ?? "",
        photoURL: user.photoURL ?? "",
        lastLoginAt: serverTimestamp(),
      });
    }

    return user;
  };

  const logout = async () => {
    await GoogleSignin.signOut();
    await signOut(auth);
  };

  return { request, response: null, signIn, logout };
}