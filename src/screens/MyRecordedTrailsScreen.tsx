import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, RecordedTrail } from "../app/navigationTypes";
import { fetchRecordedTrailsForCurrentUser } from "../services/recordTrailService";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "MyRecordedTrails">;

export default function MyRecordedTrailsScreen({ navigation }: Props) {
  const [trails, setTrails] = useState<RecordedTrail[]>([]);
  const [loading, setLoading] = useState(true);

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
          <Pressable
            style={styles.card}
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
});