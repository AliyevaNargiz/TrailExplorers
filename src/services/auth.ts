// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
// import { Platform } from "react-native";
// import { auth, db } from "./firebase";

// WebBrowser.maybeCompleteAuthSession();

// /**
//  * IMPORTANT:
//  * This function needs to be used inside a React component/hook context
//  * because expo-auth-session providers expose a hook.
//  *
//  * So we export a hook that your LoginScreen will use.
//  */
// export function useGoogleSignIn() {
//   const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
//   const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
//   const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
//   const activeClientId = Platform.select({
//     ios: iosClientId,
//     android: androidClientId,
//     default: webClientId,
//   });

//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     iosClientId,
//     androidClientId,
//     webClientId,
//     scopes: ["openid", "profile", "email"],
//     selectAccount: true,
//   });

//   const signIn = async () => {
//     if (!activeClientId || activeClientId.includes("xxxxx")) {
//       throw new Error("Google OAuth is not configured. Set real EXPO_PUBLIC_GOOGLE_*_CLIENT_ID values.");
//     }

//     const res = await promptAsync();
//     if (res.type === "error") {
//       throw new Error(res.error?.message ?? "Google sign-in failed");
//     }
//     if (res.type !== "success") {
//       throw new Error(`Google sign-in ${res.type}`);
//     }

//     const idToken = res.authentication?.idToken ?? res.params?.id_token;
//     if (!idToken) {
//       throw new Error("Google sign-in failed: missing idToken");
//     }

//     const credential = GoogleAuthProvider.credential(idToken);
//     const userCred = await signInWithCredential(auth, credential);
//     const user = userCred.user;

//     const ref = doc(db, "users", user.uid);
//     const snap = await getDoc(ref);

//     if (!snap.exists()) {
//       await setDoc(ref, {
//         name: user.displayName ?? "",
//         email: user.email ?? "",
//         photoURL: user.photoURL ?? "",
//         provider: "google",
//         role: "user",
//         createdAt: serverTimestamp(),
//         lastLoginAt: serverTimestamp(),
//       });
//     } else {
//       await updateDoc(ref, {
//         lastLoginAt: serverTimestamp(),
//         name: user.displayName ?? "",
//         photoURL: user.photoURL ?? "",
//       });
//     }

//     return user;
//   };

//   return { request, response, signIn };
// }


// src/services/auth.ts

// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
// import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
// import { Platform } from "react-native";
// import { auth, db } from "./firebase";

// WebBrowser.maybeCompleteAuthSession();

// type UserProfileDoc = {
//   name: string;
//   email: string;
//   photoURL: string;
//   provider: "google";
//   role: "user";
//   createdAt?: any;
//   lastLoginAt?: any;
// };

// function requireEnv(name: string): string {
//   const val = process.env[name];
//   if (!val || val.trim().length === 0 || val.includes("xxxxx")) {
//     throw new Error(
//       `Missing env ${name}. Put your Google OAuth client id in .env as ${name}=xxxxx.apps.googleusercontent.com`
//     );
//   }
//   return val;
// }

// export function useGoogleSignIn() {
//   // These MUST be OAuth client IDs from Google Cloud Console (not Firebase config)
//   const iosClientId = Platform.OS === "ios" ? requireEnv("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID") : undefined;
//   const androidClientId =
//     Platform.OS === "android" ? requireEnv("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID") : undefined;

//   // webClientId is useful for Expo Go / web / some flows
//   // const webClientId = requireEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");

//   const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     iosClientId,
//     androidClientId,
//     webClientId,
//     scopes: ["openid", "profile", "email"],
//     selectAccount: true,
//   });

//   const signIn = async () => {
//     // Expo Go often needs proxy; dev-client/standalone usually doesn't.
//     // To avoid TS type mismatch on some versions, cast promptAsync to any.
//     // const prompt = promptAsync as any;

//     // Try with proxy first (best for Expo Go). If it fails, user will see details.
//     // const res = await prompt({ useProxy: true });

//     const res = await (promptAsync as any)({ useProxy: true });

//     // const res = await (promptAsync as any)({ useProxy: true, showInRecents: true });
//     if (res.type !== "success") {
//       const details =
//         res?.params?.error_description ||
//         res?.params?.error ||
//         res?.error?.message ||
//         `Google sign-in cancelled/failed: ${res?.type}`;
//       throw new Error(details);
//     }

//     // expo-auth-session returns token in res.params.id_token
//     const idToken: string | undefined = res?.params?.id_token;
//     if (!idToken) {
//       throw new Error("Google sign-in failed: missing id_token");
//     }

//     // Firebase credential from Google id_token
//     const credential = GoogleAuthProvider.credential(idToken);
//     const userCred = await signInWithCredential(auth, credential);
//     const user = userCred.user;

//     // Save/update profile in Firestore
//     const ref = doc(db, "users", user.uid);
//     const snap = await getDoc(ref);

//     if (!snap.exists()) {
//       const docData: UserProfileDoc = {
//         name: user.displayName ?? "",
//         email: user.email ?? "",
//         photoURL: user.photoURL ?? "",
//         provider: "google",
//         role: "user",
//         createdAt: serverTimestamp(),
//         lastLoginAt: serverTimestamp(),
//       };
//       await setDoc(ref, docData);
//     } else {
//       await updateDoc(ref, {
//         name: user.displayName ?? "",
//         photoURL: user.photoURL ?? "",
//         lastLoginAt: serverTimestamp(),
//       });
//     }

//     return user;
//   };

//   const logout = async () => {
//     await signOut(auth);
//   };

//   return { request, response, signIn, logout };
// }


// import * as React from "react";
// import * as WebBrowser from "expo-web-browser";
// import * as AuthSession from "expo-auth-session";
// import * as Google from "expo-auth-session/providers/google";

// import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
// import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

// import { auth, db } from "./firebase";

// WebBrowser.maybeCompleteAuthSession();

// type UserProfileDoc = {
//   name: string;
//   email: string;
//   photoURL: string;
//   provider: "google";
//   role: "user";
//   createdAt?: any;
//   lastLoginAt?: any;
// };

// function requireEnv(name: string): string {
//   const val = process.env[name];
//   if (!val || val.trim().length === 0 || val.includes("xxxxx")) {
//     throw new Error(
//       `Missing env ${name}. Put your Google OAuth WEB client id in .env as ${name}=xxxxx.apps.googleusercontent.com`
//     );
//   }
//   return val;
// }

// export function useGoogleSignIn() {
//   /**
//    * ✅ Expo Go requires the WEB OAuth client ID.
//    * (Not iOS client ID. Not Android client ID.)
//    */
//   const webClientId = requireEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");

//   /**
//    * ✅ This MUST become: https://auth.expo.io/@YOUR_EXPO_USERNAME/TrailExplorers
//    * If you see exp://192.168... then proxy is NOT being used correctly.
//    */
//   const proxyRedirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);

//   React.useEffect(() => {
//     console.log("proxyRedirectUri:", proxyRedirectUri);
//   }, [proxyRedirectUri]);

//   /**
//    * ✅ Request an ID token (needed for Firebase signInWithCredential)
//    */
//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     clientId: webClientId,
//     redirectUri: proxyRedirectUri,
//     scopes: ["openid", "profile", "email"],
//   } as any);

//   const signIn = async () => {
//     // ✅ Expo Go must use proxy
//     const res = await (promptAsync as any)({ useProxy: true });

//     console.log("google auth result:", res);

//     if (res.type !== "success") {
//       const details =
//         res?.params?.error_description ||
//         res?.params?.error ||
//         res?.error?.message ||
//         `Google sign-in cancelled/failed: ${res?.type}`;
//       throw new Error(details);
//     }

//     const idToken: string | undefined = res?.params?.id_token;
//     if (!idToken) {
//       throw new Error("Google sign-in failed: missing id_token");
//     }

//     // ✅ Firebase credential from Google ID token
//     const credential = GoogleAuthProvider.credential(idToken);
//     const userCred = await signInWithCredential(auth, credential);
//     const user = userCred.user;

//     // ✅ Create/update user profile in Firestore
//     const ref = doc(db, "users", user.uid);
//     const snap = await getDoc(ref);

//     if (!snap.exists()) {
//       const docData: UserProfileDoc = {
//         name: user.displayName ?? "",
//         email: user.email ?? "",
//         photoURL: user.photoURL ?? "",
//         provider: "google",
//         role: "user",
//         createdAt: serverTimestamp(),
//         lastLoginAt: serverTimestamp(),
//       };
//       await setDoc(ref, docData);
//     } else {
//       await updateDoc(ref, {
//         name: user.displayName ?? "",
//         photoURL: user.photoURL ?? "",
//         lastLoginAt: serverTimestamp(),
//       });
//     }

//     return user;
//   };

//   const logout = async () => {
//     await signOut(auth);
//   };

//   return { request, response, signIn, logout };
// }
//
// import { useEffect } from "react";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
// import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
// import { auth, db } from "./firebase";
// import * as AuthSession from "expo-auth-session";
//
// WebBrowser.maybeCompleteAuthSession();
//
// type UserProfileDoc = {
//   name: string;
//   email: string;
//   photoURL: string;
//   provider: "google";
//   role: "user";
//   createdAt?: any;
//   lastLoginAt?: any;
// };
//
// function requireEnv(name: string): string {
//   const val = process.env[name];
//   if (!val || val.trim().length === 0) throw new Error(`Missing env ${name}`);
//   return val;
// }
//
// export function useGoogleSignIn() {
//   const iosClientId = requireEnv("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID");
//   const webClientId = requireEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");
//   const androidClientId = requireEnv("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID");
//
// const redirectUri = AuthSession.makeRedirectUri({
//   /* Do not put useProxy here */
//   scheme: "trailexplorers",
// });
//
// useEffect(() => {
//     if (__DEV__) {
//       console.log(
//         "[Google OAuth] Add this exact redirect URI under the Web OAuth client → Authorized redirect URIs:",
//         redirectUri
//       );
//     }
//   }, [redirectUri]);
//
//  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//   // IMPORTANT: For Expo Go, Google often prefers the WEB Client ID
//   webClientId,
//   iosClientId,
//   androidClientId,
//   redirectUri,
// });
//
//  const signIn = async () => {
//   // res will now open in a standard system browser
//   const res = await promptAsync();
//
//   if (res.type !== "success") {
//       throw new Error(`Google sign-in failed: ${res.type}`);
//     }
//
//     const idToken = res.params?.id_token;
//     if (!idToken) throw new Error("Missing id_token");
//
//     const credential = GoogleAuthProvider.credential(idToken);
//     const userCred = await signInWithCredential(auth, credential);
//     const user = userCred.user;

// const proxyRedirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);
//
// const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//   clientId: webClientId,
//   redirectUri: proxyRedirectUri,
//   scopes: ["openid", "profile", "email"],
// } as any);
//
// const signIn = async () => {
//   const res = await (promptAsync as any)({ useProxy: true });
//
//   if (res.type !== "success") {
//     throw new Error(`Google sign-in failed: ${res.type}`);
//   }
//
//   const idToken = res.params?.id_token;
//   if (!idToken) throw new Error("Missing id_token");
//
//   const credential = GoogleAuthProvider.credential(idToken);
//   const userCred = await signInWithCredential(auth, credential);
//   return userCred.user;
// };
//
//     const ref = doc(db, "users", user.uid);
//     const snap = await getDoc(ref);
//
//     if (!snap.exists()) {
//       const docData: UserProfileDoc = {
//         name: user.displayName ?? "",
//         email: user.email ?? "",
//         photoURL: user.photoURL ?? "",
//         provider: "google",
//         role: "user",
//         createdAt: serverTimestamp(),
//         lastLoginAt: serverTimestamp(),
//       };
//       await setDoc(ref, docData);
//     } else {
//       await updateDoc(ref, {
//         name: user.displayName ?? "",
//         photoURL: user.photoURL ?? "",
//         lastLoginAt: serverTimestamp(),
//       });
//     }
//
//     return user;
//   };
//
//   const logout = async () => {
//     await signOut(auth);
//   };
//
//   return { request, response, signIn, logout };
// }

// import * as WebBrowser from "expo-web-browser";
// import * as AuthSession from "expo-auth-session";
// import * as Google from "expo-auth-session/providers/google";
// import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
// import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
// import { auth, db } from "./firebase";

// WebBrowser.maybeCompleteAuthSession();

// type UserProfileDoc = {
//   name: string;
//   email: string;
//   photoURL: string;
//   provider: "google";
//   role: "user";
//   createdAt?: any;
//   lastLoginAt?: any;
// };

// function requireEnv(name: string): string {
//   const val = process.env[name];
//   if (!val || val.trim().length === 0 || val.includes("xxxxx")) {
//     throw new Error(
//       `Missing env ${name}. Put your Google OAuth WEB client id in .env as ${name}=xxxxx.apps.googleusercontent.com`
//     );
//   }
//   return val;
// }

// export function useGoogleSignIn() {
//   // Expo Go/browser-proxy flow: use the WEB client ID
//   const webClientId = requireEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");

//   // Use Expo proxy redirect for Expo Go
//   const redirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);

//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     clientId: webClientId,
//     redirectUri,
//     scopes: ["openid", "profile", "email"],
//   } as any);

//   const signIn = async () => {
//     const res = await (promptAsync as any)({ useProxy: true });

//     if (res.type !== "success") {
//       const details =
//         res?.params?.error_description ||
//         res?.params?.error ||
//         res?.error?.message ||
//         `Google sign-in cancelled/failed: ${res?.type}`;
//       throw new Error(details);
//     }

//     const idToken: string | undefined = res?.params?.id_token;
//     if (!idToken) {
//       throw new Error("Google sign-in failed: missing id_token");
//     }

//     const credential = GoogleAuthProvider.credential(idToken);
//     const userCred = await signInWithCredential(auth, credential);
//     const user = userCred.user;

//     const ref = doc(db, "users", user.uid);
//     const snap = await getDoc(ref);

//     if (!snap.exists()) {
//       const docData: UserProfileDoc = {
//         name: user.displayName ?? "",
//         email: user.email ?? "",
//         photoURL: user.photoURL ?? "",
//         provider: "google",
//         role: "user",
//         createdAt: serverTimestamp(),
//         lastLoginAt: serverTimestamp(),
//       };

//       await setDoc(ref, docData);
//     } else {
//       await updateDoc(ref, {
//         name: user.displayName ?? "",
//         photoURL: user.photoURL ?? "",
//         lastLoginAt: serverTimestamp(),
//       });
//     }

//     return user;
//   };

//   const logout = async () => {
//     await signOut(auth);
//   };

//   return { request, response, signIn, logout };
// }


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

console.log("CLIENT ID:", process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);

GoogleSignin.configure({
  webClientId: requireEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"),
  iosClientId: requireEnv("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"),
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