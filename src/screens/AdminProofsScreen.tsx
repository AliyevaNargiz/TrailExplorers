// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   FlatList,
//   Pressable,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
//   orderBy,
//   query,
// } from "firebase/firestore";
// import { db } from "../services/firebase";
// import { useAppTheme } from "../theme/themeContext";

// export default function AdminEcoProofsScreen({ navigation }: any) {
//   const { colors: COLORS } = useAppTheme();
//   const styles = createStyles(COLORS);

//   const [proofs, setProofs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadProofs = async () => {
//     try {
//       setLoading(true);

//       const q = query(
//         collection(db, "eco_challenge_proofs"),
//         orderBy("submittedAt", "desc")
//       );

//       const snapshot = await getDocs(q);

//       const data = snapshot.docs.map((docSnap) => ({
//         id: docSnap.id,
//         ...docSnap.data(),
//       }));

//       setProofs(data);
//     } catch (error) {
//       console.log("Failed to load eco proofs:", error);
//       Alert.alert("Error", "Could not load eco proofs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProofs();
//   }, []);

//   const updateStatus = async (
//     id: string,
//     status: "approved" | "rejected"
//   ) => {
//     try {
//       await updateDoc(doc(db, "eco_challenge_proofs", id), {
//         status,
//         reviewedAt: new Date(),
//       });

//       Alert.alert("Success", `Proof ${status}`);
//       loadProofs();
//     } catch (error) {
//       console.log("Update failed:", error);
//       Alert.alert("Error", "Could not update proof.");
//     }
//   };

//   const renderItem = ({ item }: any) => (
//     <View style={styles.card}>
//       <Image source={{ uri: item.imageUrl }} style={styles.image} />

//       <Text style={styles.title}>{item.challengeId}</Text>
//       <Text style={styles.text}>{item.userName}</Text>
//       <Text style={styles.text}>{item.userEmail}</Text>
//       <Text style={styles.text}>Status: {item.status}</Text>

//       {item.status === "pending" && (
//         <View style={styles.actions}>
//           <Pressable
//             style={styles.approveBtn}
//             onPress={() => updateStatus(item.id, "approved")}
//           >
//             <Text style={styles.btnText}>Approve</Text>
//           </Pressable>

//           <Pressable
//             style={styles.rejectBtn}
//             onPress={() => updateStatus(item.id, "rejected")}
//           >
//             <Text style={styles.btnText}>Reject</Text>
//           </Pressable>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <View style={styles.topBar}>
//           <Pressable onPress={() => navigation.goBack()}>
//             <Text style={styles.backText}>←</Text>
//           </Pressable>

//           <Text style={styles.header}>Eco Challenge Review</Text>

//           <View style={{ width: 24 }} />
//         </View>

//         {loading ? (
//           <ActivityIndicator />
//         ) : (
//           <FlatList
//             data={proofs}
//             keyExtractor={(item) => item.id}
//             renderItem={renderItem}
//             ListEmptyComponent={
//               <Text style={styles.empty}>No eco proofs found.</Text>
//             }
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const createStyles = (COLORS: any) =>
//   StyleSheet.create({
//     safeArea: { flex: 1, backgroundColor: COLORS.white },
//     container: { flex: 1, padding: 20 },

//     topBar: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 20,
//     },

//     backText: { fontSize: 24, fontWeight: "800" },
//     header: { fontSize: 18, fontWeight: "800" },

//     card: {
//       backgroundColor: COLORS.lightGray,
//       borderRadius: 16,
//       padding: 16,
//       marginBottom: 12,
//     },

//     image: {
//       height: 150,
//       borderRadius: 12,
//       marginBottom: 10,
//     },

//     title: { fontWeight: "800", marginBottom: 4 },
//     text: { fontSize: 13, color: COLORS.grayText },

//     actions: {
//       flexDirection: "row",
//       gap: 10,
//       marginTop: 10,
//     },

//     approveBtn: {
//       flex: 1,
//       backgroundColor: COLORS.darkGreen,
//       padding: 12,
//       borderRadius: 10,
//       alignItems: "center",
//     },

//     rejectBtn: {
//       flex: 1,
//       backgroundColor: "#9b1c1c",
//       padding: 12,
//       borderRadius: 10,
//       alignItems: "center",
//     },

//     btnText: { color: "white", fontWeight: "800" },

//     empty: {
//       textAlign: "center",
//       marginTop: 30,
//       color: COLORS.grayText,
//     },
//   });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAppTheme } from "../theme/themeContext";

const challengePoints: Record<string, number> = {
  cleanup: 40,
  reusable: 25,
  respect: 35,
  wildlife: 30,
};

export default function AdminEcoProofsScreen({ navigation }: any) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);

  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProofs = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "eco_challenge_proofs"),
        orderBy("submittedAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setProofs(data);
    } catch (error) {
      console.log("Failed to load eco proofs:", error);
      Alert.alert("Error", "Could not load eco proofs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProofs();
  }, []);

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const proof = proofs.find((item) => item.id === id);

      if (!proof) {
        Alert.alert("Error", "Proof not found.");
        return;
      }

      await updateDoc(doc(db, "eco_challenge_proofs", id), {
        status,
        reviewedAt: serverTimestamp(),
      });

     const progressRef = doc(
  db,
  "users",
  proof.userId,
  "progress",
  "ecoChallenges"
);

const progressSnap = await getDoc(progressRef);
const current = progressSnap.exists() ? progressSnap.data() : {};

const completedIds = Array.isArray(current.completedIds)
  ? current.completedIds
  : [];

const existingProofs = Array.isArray(current.proofs)
  ? current.proofs
  : [];

const updatedProofs = [
  ...existingProofs.filter(
    (p: any) => p.challengeId !== proof.challengeId
  ),
  {
    challengeId: proof.challengeId,
    imageUrl: proof.imageUrl,
    submittedAt: Date.now(),
    status,
    reviewedAt: Date.now(),
  },
];

await setDoc(
  progressRef,
  {
    completedIds:
      status === "approved" && !completedIds.includes(proof.challengeId)
        ? [...completedIds, proof.challengeId]
        : completedIds,
    proofs: updatedProofs,
    updatedAt: serverTimestamp(),
  },
  { merge: true }
);

      await addDoc(collection(db, "notifications"), {
        userId: proof.userId,
        proofId: id,
        type: "eco_challenge",
        title:
          status === "approved"
            ? "Eco Challenge Approved ✅"
            : "Eco Challenge Rejected ❌",
        message:
          status === "approved"
            ? `Your ${proof.challengeId} eco challenge was approved. You earned ${
                challengePoints[proof.challengeId] ?? 0
              } points.`
            : `Your ${proof.challengeId} eco challenge proof was rejected.`,
        challengeId: proof.challengeId,
        points:
          status === "approved"
            ? challengePoints[proof.challengeId] ?? 0
            : 0,
        imageUrl: proof.imageUrl,
        status,
        read: false,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", `Proof ${status}.`);
      loadProofs();
    } catch (error) {
      console.log("Update failed:", error);
      Alert.alert("Error", "Could not update proof.");
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <Text style={styles.title}>{item.challengeId}</Text>
      <Text style={styles.text}>{item.userName || "Unknown user"}</Text>
      <Text style={styles.text}>{item.userEmail || "No email"}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>

      {item.status === "pending" && (
        <View style={styles.actions}>
          <Pressable
            style={styles.approveBtn}
            onPress={() => updateStatus(item.id, "approved")}
          >
            <Text style={styles.btnText}>Approve</Text>
          </Pressable>

          <Pressable
            style={styles.rejectBtn}
            onPress={() => updateStatus(item.id, "rejected")}
          >
            <Text style={styles.btnText}>Reject</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.header}>Eco Challenge Review</Text>

          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={proofs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>No eco proofs found.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (COLORS: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white },
    container: { flex: 1, padding: 20 },

    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    backText: { fontSize: 24, fontWeight: "800" },
    header: { fontSize: 18, fontWeight: "800" },

    card: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },

    image: {
      height: 150,
      borderRadius: 12,
      marginBottom: 10,
    },

    title: { fontWeight: "800", marginBottom: 4 },
    text: { fontSize: 13, color: COLORS.grayText },

    actions: {
      flexDirection: "row",
      gap: 10,
      marginTop: 10,
    },

    approveBtn: {
      flex: 1,
      backgroundColor: COLORS.darkGreen,
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
    },

    rejectBtn: {
      flex: 1,
      backgroundColor: "#9b1c1c",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
    },

    btnText: { color: "white", fontWeight: "800" },

    empty: {
      textAlign: "center",
      marginTop: 30,
      color: COLORS.grayText,
    },
  });