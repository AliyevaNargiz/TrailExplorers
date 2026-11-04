import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { useAppTheme, type ThemeColors } from "../theme/themeContext";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { PublicTrailSubmissionItem } from "../services/trailSubmissionService";

type Props = NativeStackScreenProps<RootStackParamList, "MyAddedTrailDetail">;

export default function MyAddedTrailDetailScreen({
  route,
  navigation,
}: Props) {
  const { trail: initialTrail } = route.params;
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);
  
  const [trail, setTrail] = useState<PublicTrailSubmissionItem | null>(initialTrail || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch fresh trail data from Firebase on mount
  useEffect(() => {
    const fetchFreshTrailData = async () => {
      if (!initialTrail?.id) return;

      try {
        setLoading(true);
        setError(null);
        const trailRef = doc(db, "trail_submissions", initialTrail.id);
        const trailSnap = await getDoc(trailRef);

        if (trailSnap.exists()) {
          const data = trailSnap.data();
          const freshTrail: PublicTrailSubmissionItem = {
            id: initialTrail.id,
            name: data.name ?? "Untitled Trail",
            description: data.description ?? "",
            region: data.region ?? "",
            village: data.village ?? "",
            difficulty: data.difficulty ?? "Easy",
            status: data.status ?? "pending_ai",
            distanceKm: data.routeStats?.distanceKm ?? 0,
            durationHours: data.routeStats?.durationHours ?? 0,
            elevationGain: data.routeStats?.elevationGain ?? 0,
            features: Array.isArray(data.features) ? data.features : [],
            mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
            waypointNotes: data.waypointNotes ?? "",
            createdAt: data.createdAt ?? null,
            averageRating: 0,
            reviewCount: 0,
          };
          setTrail(freshTrail);
        } else {
          setError("Trail not found");
        }
      } catch (err: any) {
        console.log("Error fetching trail:", err);
        setError(err?.message || "Failed to load trail");
      } finally {
        setLoading(false);
      }
    };

    fetchFreshTrailData();
  }, [initialTrail?.id]);

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "approved":
        return { bg: "#d4f1d4", text: "#2d7a2d" };
      case "pending":
      case "pending_ai":
      case "pending_admin":
        return { bg: "#fff4d4", text: "#8b7000" };
      case "rejected":
        return { bg: "#f1d4d4", text: "#8b2d2d" };
      default:
        return { bg: "#e6e6e6", text: "#666" };
    }
  };

  const isPendingReview =
    trail?.status === "pending_ai" ||
    trail?.status === "pending_admin" ||
    trail?.status === "pending" ||
    trail?.status === "needs_review";

  const handleReviewAction = async (newStatus: "approved" | "rejected") => {
    if (!trail?.id) return;

    try {
      setActionLoading(true);
      await updateDoc(doc(db, "trail_submissions", trail.id), {
        status: newStatus,
      });
      setTrail({ ...trail, status: newStatus });
    } catch (err: any) {
      console.log("Review action failed:", err);
      Alert.alert("Action failed", err?.message || "Unable to update trail status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Trail Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.content, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color={COLORS.green} />
          <Text style={styles.loadingText}>Loading trail details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !trail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Trail Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.content, { justifyContent: "center", alignItems: "center" }]}>
          <Text style={styles.errorText}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to Load Trail</Text>
          <Text style={styles.errorMessage}>{error || "Trail not found"}</Text>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const statusColors = getStatusBadgeColor(trail.status);
  const difficulty = trail.difficulty || "Unknown";
  const distanceKm = trail.distanceKm ?? 0;
  const durationHours = trail.durationHours ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Trail Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Title Section */}
        <View>
          <Text style={styles.title}>{trail.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.location}>
              📍 {trail.region || "Unknown Region"}
            </Text>
            {trail.village && <Text style={styles.location}>• {trail.village}</Text>}
          </View>
        </View>

        {/* Status Badge */}
        {trail.status && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors.bg },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {trail.status === "pending_ai"
                ? "Pending AI Review"
                : trail.status === "pending_admin"
                ? "Pending Admin Review"
                : trail.status === "approved"
                ? "✓ Approved"
                : trail.status === "rejected"
                ? "Rejected"
                : trail.status}
            </Text>
          </View>
        )}

        {/* Images Gallery */}
        {trail.mediaUrls && trail.mediaUrls.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagesContainer}
          >
            {trail.mediaUrls.map((url: string, index: number) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.image}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>No images added</Text>
          </View>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{distanceKm} km</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{durationHours} h</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Difficulty</Text>
            <Text style={styles.statValue}>{difficulty}</Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>About This Trail</Text>
          <Text style={styles.descriptionText}>
            {trail.description || "No description provided"}
          </Text>
        </View>

        {/* Waypoint Notes Card */}
        {trail.waypointNotes && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Waypoint Notes</Text>
            <Text style={styles.descriptionText}>{trail.waypointNotes}</Text>
          </View>
        )}

        {/* Approval Actions */}
        {isPendingReview && (
          <View style={styles.reviewActions}>
            <Pressable
              style={[
                styles.button,
                styles.rejectButton,
                actionLoading && styles.disabledButton,
              ]}
              disabled={actionLoading}
              onPress={() => handleReviewAction("rejected")}
            >
              <Text style={styles.secondaryButtonText}>Reject</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.primaryButton,
                actionLoading && styles.disabledButton,
              ]}
              disabled={actionLoading}
              onPress={() => handleReviewAction("approved")}
            >
              <Text style={styles.primaryButtonText}>Approve</Text>
            </Pressable>
          </View>
        )}

        {/* Additional Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Trail Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Region</Text>
            <Text style={styles.infoValue}>
              {trail.region || "Unknown"}
            </Text>
          </View>

          {trail.village && (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Village</Text>
                <Text style={styles.infoValue}>{trail.village}</Text>
              </View>
            </>
          )}

          {trail.status && (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{trail.status}</Text>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Back to My Trails</Text>
          </Pressable>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(COLORS: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.softBorder,
    },
    backBtn: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    backText: {
      fontSize: 24,
      color: COLORS.black,
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 16,
      fontWeight: "700",
      color: COLORS.black,
    },
    headerSpacer: {
      width: 40,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: COLORS.black,
      marginBottom: 8,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    location: {
      fontSize: 14,
      color: COLORS.grayText,
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 16,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
    },
    imagesContainer: {
      marginBottom: 20,
    },
    image: {
      width: 280,
      height: 200,
      borderRadius: 16,
      marginRight: 12,
      backgroundColor: COLORS.lightGray,
    },
    noImagePlaceholder: {
      height: 160,
      backgroundColor: COLORS.lightGray,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    noImageText: {
      fontSize: 14,
      color: COLORS.grayText,
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      backgroundColor: COLORS.lightGray,
      borderRadius: 14,
      padding: 14,
      alignItems: "center",
    },
    statLabel: {
      fontSize: 12,
      color: COLORS.grayText,
      marginBottom: 6,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.black,
    },
    infoCard: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.black,
      marginBottom: 12,
    },
    descriptionText: {
      fontSize: 14,
      color: COLORS.grayText,
      lineHeight: 20,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    infoLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: COLORS.grayText,
    },
    infoValue: {
      fontSize: 13,
      fontWeight: "500",
      color: COLORS.black,
    },
    infoDivider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: 12,
    },
    reviewActions: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    buttonRow: {
      gap: 12,
      marginTop: 8,
    },
    button: {
      flex: 1,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    primaryButton: {
      backgroundColor: COLORS.green,
    },
    secondaryButtonText: {
      color: COLORS.white,
      fontSize: 15,
      fontWeight: "700",
    },
    rejectButton: {
      backgroundColor: "#d94141",
    },
    disabledButton: {
      opacity: 0.6,
    },
    primaryButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: COLORS.white,
    },
    spacer: {
      height: 20,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: COLORS.grayText,
    },
    errorText: {
      fontSize: 48,
      marginBottom: 12,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.black,
      marginBottom: 8,
    },
    errorMessage: {
      fontSize: 14,
      color: COLORS.grayText,
      marginBottom: 24,
      textAlign: "center",
    },
  });
}