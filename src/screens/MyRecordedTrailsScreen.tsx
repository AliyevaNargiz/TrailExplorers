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

      <FlatList
        data={trails}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recorded trails yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editingId === item.id ? (
              <>
                {/* EDIT MODE */}
                <TextInput
                  value={editedName}
                  onChangeText={setEditedName}
                  style={styles.input}
                  placeholder="Enter trail name"
                />

                <View style={styles.row}>
                  <Pressable
                    style={styles.saveButton}
                    onPress={() => handleSave(item.id)}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </Pressable>

                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setEditingId(null)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                {/* NORMAL VIEW */}
                <Pressable
                  onPress={() =>
                    navigation.navigate("RecordedTrailDetail", {
                      trail: item,
                    })
                  }
                >
                  <Text style={styles.trailName}>
                    {item.title || "Unnamed Trail"}
                  </Text>

                  <Text style={styles.meta}>
                    {new Date(item.startedAt).toLocaleString()}
                  </Text>

                  <Text style={styles.meta}>
                    {(item.distanceMeters / 1000).toFixed(2)} km •{" "}
                    {Math.round(item.durationSeconds / 60)} min
                  </Text>
                </Pressable>

                {/* EDIT BUTTON */}
                <Pressable
                  style={styles.editButton}
                  onPress={() => {
                    setEditingId(item.id);
                    setEditedName(item.title || "");
                  }}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </Pressable>

                {/* DELETE BUTTON */}
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
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
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#f1f1f1",
    borderRadius: 16,
    padding: 16,
  },
  trailName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
  emptyText: {
    fontSize: 13,
    color: "#666",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  deleteButton: {
  marginTop: 10,
  backgroundColor: "#e74c3c",
  padding: 8,
  borderRadius: 10,
  alignItems: "center",
},

deleteText: {
  color: "white",
  fontWeight: "700",
  fontSize: 12,
},
input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 8,
  marginBottom: 10,
},

row: {
  flexDirection: "row",
  gap: 10,
},

editButton: {
  marginTop: 10,
  backgroundColor: "#3498db",
  padding: 8,
  borderRadius: 10,
  alignItems: "center",
},

saveButton: {
  flex: 1,
  backgroundColor: "#2ecc71",
  padding: 8,
  borderRadius: 10,
  alignItems: "center",
},

cancelButton: {
  flex: 1,
  backgroundColor: "#aaa",
  padding: 8,
  borderRadius: 10,
  alignItems: "center",
},

buttonText: {
  color: "white",
  fontWeight: "700",
},
});