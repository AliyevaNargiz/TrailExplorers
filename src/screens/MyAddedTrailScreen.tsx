import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import {
  fetchMyTrailSubmissions,
  deleteTrailSubmission,
} from "../services/trailSubmissionService";

type Props = NativeStackScreenProps<RootStackParamList, "MyAddedTrail">;

type TrailSubmissionItem = {
  id: string;
  name: string;
  description?: string;
  region?: string;
  village?: string;
  difficulty?: string;
  status?: string;
  distanceKm?: number;
  durationHours?: number;
};

export default function MyAddedTrailScreen({ navigation }: Props) {
  const [trails, setTrails] = useState<TrailSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchMyTrailSubmissions();
        setTrails(data);
      } catch (e) {
        console.log(e);
        setTrails([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = (trailId: string) => {
    Alert.alert("Delete Trail", "Are you sure you want to delete this trail?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeletingId(trailId);
            await deleteTrailSubmission(trailId);
            setTrails((prev) => prev.filter((trail) => trail.id !== trailId));
            Alert.alert("Deleted", "Trail removed successfully.");
          } catch (error) {
            console.log("Failed to delete trail:", error);
            Alert.alert("Error", "Failed to delete trail.");
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "pending_ai":
        return "Pending review";
      case "needs_review":
        return "Needs review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status || "Unknown";
    }
  };

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "approved":
        return styles.statusApproved;
      case "rejected":
        return styles.statusRejected;
      case "needs_review":
        return styles.statusNeedsReview;
      case "pending_ai":
      default:
        return styles.statusPending;
    }
  };

  const renderItem = ({ item }: { item: TrailSubmissionItem }) => (
    <Pressable style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name || "Untitled Trail"}
        </Text>

        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.locationText}>
        {[item.region, item.village].filter(Boolean).join(" • ") || "Location not set"}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>Difficulty</Text>
          <Text style={styles.metaValue}>{item.difficulty || "—"}</Text>
        </View>

        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>Distance</Text>
          <Text style={styles.metaValue}>
            {typeof item.distanceKm === "number" ? `${item.distanceKm} km` : "—"}
          </Text>
        </View>

        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>Duration</Text>
          <Text style={styles.metaValue}>
            {typeof item.durationHours === "number" ? `${item.durationHours} h` : "—"}
          </Text>
        </View>
      </View>

      {!!item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.actionRow}>
        <Pressable
          style={[
            styles.deleteButton,
            deletingId === item.id && styles.deleteButtonDisabled,
          ]}
          onPress={() => handleDelete(item.id)}
          disabled={deletingId === item.id}
        >
          <Text style={styles.deleteButtonText}>
            {deletingId === item.id ? "Deleting..." : "Delete"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading your trails...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.headerTitle}>My Added Trails</Text>

          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.subtitle}>
          All trails you submitted from the Add New Trail flow
        </Text>

        <FlatList
          data={trails}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No added trails yet</Text>
              <Text style={styles.emptyText}>
                Your submitted trails will appear here.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F4",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#F7F7F4",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#777777",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ECECE8",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 18,
    color: "#222222",
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },
  headerSpacer: {
    width: 36,
  },
  subtitle: {
    fontSize: 12,
    color: "#7D7D7D",
    marginBottom: 16,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#151515",
  },
  locationText: {
    marginTop: 6,
    fontSize: 12,
    color: "#777777",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  metaPill: {
    backgroundColor: "#F3F3EF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 88,
  },
  metaLabel: {
    fontSize: 10,
    color: "#8C8C8C",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#222222",
  },
  description: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    color: "#5F5F5F",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#E24D4D",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonDisabled: {
    backgroundColor: "#C96666",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statusPending: {
    backgroundColor: "#7DAA7B",
  },
  statusNeedsReview: {
    backgroundColor: "#D39C3F",
  },
  statusApproved: {
    backgroundColor: "#4FA36D",
  },
  statusRejected: {
    backgroundColor: "#C85A5A",
  },
  emptyWrap: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222222",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#7D7D7D",
    textAlign: "center",
  },
});