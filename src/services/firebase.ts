import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//const firebaseConfig = {
  //apiKey: "YOUR_API_KEY",
//  authDomain: "YOUR_PROJECT.firebaseapp.com",
 // projectId: "YOUR_PROJECT_ID",
 // storageBucket: "YOUR_PROJECT.appspot.com",
 // messagingSenderId: "XXXX",
 // appId: "XXXX",
//};

const firebaseConfig = {
  apiKey: "AIzaSyCcS5IDHTW0Lk3P4-tHOw80CLOKxKHPDmU",
  authDomain: "trailexplorers-cc935.firebaseapp.com",
  projectId: "trailexplorers-cc935",
  storageBucket: "trailexplorers-cc935.appspot.com",
  messagingSenderId: "286057375578",
  appId: "1:286057375578:web:c77cf6a6aacca1ac0e3563",
  measurementId: "G-YNPT9PRY4Q"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);