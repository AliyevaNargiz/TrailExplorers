import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, RecordedTrail } from "../app/navigationTypes";
import { fetchRecordedTrailsForCurrentUser } from "../services/recordTrailService";
import { COLORS } from "../theme/colors";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "MyRecordedTrails">;

export default function MyRecordedTrailsScreen({ navigation }: Props) {
  const [trails, setTrails] = useState<RecordedTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
const [editedName, setEditedName] = useState("");



   const handleDelete = (id: string) => {
  Alert.alert("Delete Trail", "Are you sure you want to delete this trail?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          // 🔥 DELETE FROM FIRESTORE
          await deleteDoc(doc(db, "recorded_trails", id));

          // 🧹 REMOVE FROM UI
          setTrails((prev) => prev.filter((t) => t.id !== id));

          Alert.alert("Deleted", "Trail removed successfully");
        } catch (error) {
          console.log(error);
          Alert.alert("Error", "Failed to delete trail");
        }
      },
    },
  ]);
};

  const handleSave = (id: string) => {
  setTrails((prev) =>
    prev.map((t) =>
      t.id === id ? { ...t, title: editedName } : t
    )
  );

  setEditingId(null);
};

  useEffect(() => {
    const loadTrails = async () => {
      try {
        const data = await fetchRecordedTrailsForCurrentUser();
        setTrails(data);
      } catch (error) {
        console.log("Failed to load recorded trails:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrails();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading recorded trails...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recorded Trails</Text>
      <Text style={styles.subtitle}>
        Track and manage your recorded trails in one place.
      </Text>

      <FlatList
        data={trails}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No recorded trails yet</Text>
            <Text style={styles.emptyText}>
              Your completed trail recordings will appear here once you start
              recording.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editingId === item.id ? (
              <>
                <TextInput
                  value={editedName}
                  onChangeText={setEditedName}
                  style={styles.input}
                  placeholder="Enter trail name"
                />

                <View style={styles.buttonRow}> 
                  <Pressable
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={() => handleSave(item.id)}
                  >
                    <Text style={styles.actionText}>Save</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => setEditingId(null)}
                  >
                    <Text style={styles.actionText}>Cancel</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Pressable
                  onPress={() =>
                    navigation.navigate("RecordedTrailDetail", {
                      trail: item,
                    })
                  }
                  style={styles.cardHeader}
                >
                  <Text style={styles.trailName}>
                    {item.title || "Unnamed Trail"}
                  </Text>
                  <Text style={styles.meta}>
                    {new Date(item.startedAt).toLocaleString()}
                  </Text>
                </Pressable>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.metaLabel}>Distance</Text>
                    <Text style={styles.metaValue}>
                      {(item.distanceMeters / 1000).toFixed(2)} km
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.metaLabel}>Duration</Text>
                    <Text style={styles.metaValue}>
                      {Math.round(item.durationSeconds / 60)} min
                    </Text>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <Pressable
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => {
                      setEditingId(item.id);
                      setEditedName(item.title || "");
                    }}
                  >
                    <Text style={styles.actionText}>Edit</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 16,
  },
  trailName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 14,
    color: "#5F5F5F",
    marginBottom: 20,
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
  metaLabel: {
    fontSize: 10,
    color: "#8E8E8E",
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
  emptyWrap: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 84,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2eb82e",
  },
  saveButton: {
    backgroundColor: "#2e9d5e",
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});