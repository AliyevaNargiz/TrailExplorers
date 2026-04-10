import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

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

export function useGoogleSignIn() {
  // const iosClientId = requireEnv("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID");
  // const androidClientId = requireEnv("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID");
  const webClientId = requireEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");

  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   iosClientId,
  //   androidClientId,
  //   webClientId,
  //   scopes: ["openid", "profile", "email"],
  //   selectAccount: true,
  // });

   const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  } as any);

  console.log("redirectUri:", redirectUri);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
    redirectUri,
    scopes: ["openid", "profile", "email"],
  } as any);

  const signIn = async () => {
    const res = await promptAsync();

    if (res.type !== "success") {
      const details =
        (res as any)?.params?.error_description ||
        (res as any)?.params?.error ||
        (res as any)?.error?.message ||
        `Google sign-in failed: ${res.type}`;

      throw new Error(details);
    }

    const idToken =
      (res as any)?.authentication?.idToken ||
      (res as any)?.params?.id_token;

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
    await signOut(auth);
  };

  return { request, response, signIn, logout };
}