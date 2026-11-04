import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminTrailReviewsScreen() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "trail_submissions"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setSubmissions(data);
    } catch (error) {
      console.log("Load trail submissions error:", error);
      Alert.alert("Error", "Could not load trail submissions.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "trail_submissions", id), {
        status,
      });

      Alert.alert("Success", `Trail ${status}.`);
      loadSubmissions();
    } catch (error) {
      console.log("Update trail status error:", error);
      Alert.alert("Error", "Could not update trail status.");
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Admin Trail Reviews</Text>
        <Text style={styles.subtitle}>Review trails submitted by users</Text>

        {submissions.map((trail) => (
          <View key={trail.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{trail.name}</Text>
              <Text style={styles.status}>{trail.status}</Text>
            </View>

            <Text style={styles.location}>
              {trail.region} • {trail.village}
            </Text>

            {trail.mediaUrls?.[0] ? (
              <Image source={{ uri: trail.mediaUrls[0] }} style={styles.image} />
            ) : null}

            <Text style={styles.description}>{trail.description}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.info}>Difficulty: {trail.difficulty}</Text>
              <Text style={styles.info}>
                Distance: {trail.routeStats?.distanceKm ?? 0} km
              </Text>
            </View>

            <Text style={styles.submitter}>
              Submitted by: {trail.submittedBy?.name || trail.submittedBy?.email}
            </Text>

            <View style={styles.actions}>
              <Pressable
                style={[styles.button, styles.approve]}
                onPress={() => updateStatus(trail.id, "approved")}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.reject]}
                onPress={() => updateStatus(trail.id, "rejected")}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {submissions.length === 0 && (
          <Text style={styles.empty}>No trail submissions found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7F3" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: "#111", textAlign: "center" },
  subtitle: { fontSize: 13, color: "#777", textAlign: "center", marginBottom: 18 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  name: { fontSize: 18, fontWeight: "800", flex: 1 },
  status: {
    backgroundColor: "#D99A2B",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: "hidden",
    fontSize: 11,
    fontWeight: "700",
  },
  location: { color: "#666", marginTop: 6, marginBottom: 10 },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  description: { color: "#333", marginBottom: 10 },
  infoRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  info: { backgroundColor: "#F1F1EE", padding: 8, borderRadius: 10 },
  submitter: { marginTop: 10, color: "#666", fontSize: 12 },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  approve: { backgroundColor: "#2F7A42" },
  reject: { backgroundColor: "#D94141" },
  buttonText: { color: "#fff", fontWeight: "800" },
  empty: { textAlign: "center", color: "#777", marginTop: 30 },
});