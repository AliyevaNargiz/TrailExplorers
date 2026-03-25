import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { TRAILS } from "../data/trails";

export async function seedTrailsToFirestore() {
  try {
    console.log("Seeding trails...", TRAILS.length);

    for (const trail of TRAILS) {
      const { id, ...data } = trail;
      await setDoc(doc(db, "trails", id), data);
      console.log("Seeded:", id);
    }

    console.log("✅ Done seeding trails");
  } catch (e: any) {
    console.log("❌ Seed error:", e?.message, e);
    throw e;
  }
}