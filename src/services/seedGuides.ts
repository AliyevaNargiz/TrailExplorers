import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

const sampleGuides = [
  {
    fullName: "Ali Mammadov",
    bio: "Experienced hiking guide with deep knowledge of mountain and forest trails.",
    region: "Gabala",
    agency: "Mountain Pro",
    languages: ["English", "Azerbaijani"],
    specialties: ["Mountain hikes", "Eco tours", "Beginner groups"],
    rating: 4.8,
    experienceYears: 6,
     phone: "+994501234567",          // ✅ ADD
    email: "ali.guide@gmail.com", 
  },
  {
    fullName: "Leyla Karimova",
    bio: "Nature and culture guide specializing in village walks and scenic routes.",
    region: "Lahij",
    agency: "Green Path Tours",
    languages: ["English", "Azerbaijani", "Turkish"],
    specialties: ["Cultural trails", "Eco walks", "Small groups"],
    rating: 4.7,
    experienceYears: 5,
     phone: "+994501234567",          // ✅ ADD
    email: "ali.guide@gmail.com", 
  },
  {
    fullName: "Murad Huseynov",
    bio: "Adventure guide for challenging hikes, forest routes, and full-day trail trips.",
    region: "Gusar",
    agency: "Peak Nomads",
    languages: ["English", "Azerbaijani", "Russian"],
    specialties: ["Advanced hikes", "Forest trails", "Custom routes"],
    rating: 4.9,
    experienceYears: 8,
     phone: "+994501234567",          // ✅ ADD
    email: "murad.huseynov@gmail.com", 
  },
];

export async function seedGuides() {
  for (const guide of sampleGuides) {
    const existingQuery = query(
      collection(db, "guides"),
      where("fullName", "==", guide.fullName)
    );

    const existingSnapshot = await getDocs(existingQuery);

    if (existingSnapshot.empty) {
  await addDoc(collection(db, "guides"), guide);
  console.log("Added guide:", guide.fullName);
} else {
  const existingDoc = existingSnapshot.docs[0];

  await updateDoc(doc(db, "guides", existingDoc.id), {
    phone: guide.phone,
    email: guide.email,
  });

  console.log("Updated guide contact:", guide.fullName);
}
  }
}