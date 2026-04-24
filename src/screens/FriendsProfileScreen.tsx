import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";
import {
  fetchPublicUserProfile,
  fetchTrailSubmissionsByUserId,
  type PublicTrailSubmissionItem,
  type PublicUserProfile,
} from "../services/trailSubmissionService";

type Props = NativeStackScreenProps<RootStackParamList, "FriendProfile">;

function getInitials(name: string) {
  const trimmed = name.trim();

  if (!trimmed) return "TE";

  return trimmed
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: any) {
  if (!value) return "Recently active";

  const millis =
    typeof value?.toMillis === "function"
      ? value.toMillis()
      : typeof value?.seconds === "number"
      ? value.seconds * 1000
      : typeof value === "number"
      ? value
      : Date.parse(value);

  if (!millis || Number.isNaN(millis)) return "Recently active";

  return new Date(millis).toLocaleDateString();
}

function formatMetric(value: number, suffix: string) {
  if (!Number.isFinite(value) || value <= 0) return "--";
  return `${value} ${suffix}`;
}

export default function FriendsProfileScreen({
  navigation,
  route,
}: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);
  const {
    userId,
    fallbackBio,
    fallbackEmail,
    fallbackHomeRegion,
    fallbackName,
    fallbackPhotoURL,
  } = route.params;

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [submissions, setSubmissions] = useState<PublicTrailSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileData, submissionData] = await Promise.all([
          fetchPublicUserProfile(userId),
          fetchTrailSubmissionsByUserId(userId),
        ]);

        setProfile(profileData);
        setSubmissions(submissionData);
      } catch (loadError) {
        console.log("Failed to load friend profile:", loadError);
        setError("We couldn't load this hiker's profile right now.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const displayProfile = useMemo(
    () => ({
      uid: userId,
      name: profile?.name || fallbackName || "Trail Explorer",
      email: profile?.email || fallbackEmail || "",
      photoURL: profile?.photoURL || fallbackPhotoURL || "",
      homeRegion: profile?.homeRegion || fallbackHomeRegion || "",
      bio: profile?.bio || fallbackBio || "",
      submissionsCount: profile?.submissionsCount ?? submissions.length,
      approvedSubmissionsCount:
        profile?.approvedSubmissionsCount ??
        submissions.filter((submission) => submission.status === "approved").length,
      latestSubmissionAt:
        profile?.latestSubmissionAt ?? submissions[0]?.createdAt ?? null,
    }),
    [
      fallbackBio,
      fallbackEmail,
      fallbackHomeRegion,
      fallbackName,
      fallbackPhotoURL,
      profile,
      submissions,
      userId,
    ]
  );

  const renderSubmissionCard = ({
    item,
  }: {
    item: PublicTrailSubmissionItem;
  }) => (
    <View style={styles.submissionCard}>
      <View style={styles.submissionHeader}>
        <Text style={styles.submissionTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.status === "pending_ai" ? "Pending" : item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.submissionLocation}>
        {[item.region, item.village].filter(Boolean).join(" • ") || "Location not set"}
      </Text>

      {!!item.description && (
        <Text style={styles.submissionDescription} numberOfLines={3}>
          {item.description}
        </Text>
      )}

      <View style={styles.metricsRow}>
        <View style={styles.metricPill}>
          <Text style={styles.metricLabel}>Difficulty</Text>
          <Text style={styles.metricValue}>{item.difficulty}</Text>
        </View>
        <View style={styles.metricPill}>
          <Text style={styles.metricLabel}>Distance</Text>
          <Text style={styles.metricValue}>
            {formatMetric(item.distanceKm, "km")}
          </Text>
        </View>
        <View style={styles.metricPill}>
          <Text style={styles.metricLabel}>Duration</Text>
          <Text style={styles.metricValue}>
            {formatMetric(item.durationHours, "h")}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" />
          <Text style={styles.stateText}>Loading profile and trail submissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Friend Profile</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.profileCard}>
          {displayProfile.photoURL ? (
            <Image source={{ uri: displayProfile.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>
                {getInitials(displayProfile.name)}
              </Text>
            </View>
          )}

          <Text style={styles.name}>{displayProfile.name}</Text>
          <Text style={styles.metaText}>
            {displayProfile.homeRegion || "Exploring new regions"}
          </Text>
          <Text style={styles.metaText}>
            {displayProfile.email || "Community hiker"}
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {displayProfile.submissionsCount}
              </Text>
              <Text style={styles.summaryLabel}>Submissions</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {displayProfile.approvedSubmissionsCount}
              </Text>
              <Text style={styles.summaryLabel}>Approved</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {formatDate(displayProfile.latestSubmissionAt)}
              </Text>
              <Text style={styles.summaryLabel}>Last shared</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About this hiker</Text>
          <Text style={styles.bioText}>
            {displayProfile.bio || "No public bio added yet."}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended trail submissions</Text>
          <Text style={styles.sectionCaption}>
            Trails shared by {displayProfile.name.split(" ")[0] || "this hiker"}
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <FlatList
          data={submissions}
          keyExtractor={(item) => item.id}
          renderItem={renderSubmissionCard}
          scrollEnabled={false}
          contentContainerStyle={styles.submissionList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No trail submissions yet</Text>
              <Text style={styles.emptyText}>
                When this hiker shares recommended trails, they will appear here.
              </Text>
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 32,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.white,
    },
    backText: {
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.black,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: COLORS.black,
    },
    topBarSpacer: {
      width: 36,
    },
    profileCard: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 26,
      padding: 20,
      alignItems: "center",
      gap: 8,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: COLORS.softBorder,
      marginBottom: 6,
    },
    avatarFallback: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: COLORS.darkGreen,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    avatarFallbackText: {
      color: COLORS.white,
      fontSize: 34,
      fontWeight: "800",
    },
    name: {
      fontSize: 24,
      fontWeight: "800",
      color: COLORS.black,
      textAlign: "center",
    },
    metaText: {
      fontSize: 13,
      color: COLORS.grayText,
      textAlign: "center",
    },
    summaryRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 12,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: COLORS.white,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 14,
      alignItems: "center",
      gap: 4,
      minHeight: 80,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.black,
      textAlign: "center",
    },
    summaryLabel: {
      fontSize: 11,
      color: COLORS.grayText,
      textAlign: "center",
    },
    sectionCard: {
      marginTop: 18,
      backgroundColor: COLORS.lightGray,
      borderRadius: 22,
      padding: 18,
      gap: 10,
    },
    sectionHeader: {
      marginTop: 22,
      gap: 4,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.black,
    },
    sectionCaption: {
      fontSize: 12,
      color: COLORS.grayText,
    },
    bioText: {
      fontSize: 14,
      lineHeight: 21,
      color: COLORS.black,
    },
    errorText: {
      marginTop: 10,
      color: "#b04848",
      fontSize: 12,
    },
    submissionList: {
      paddingTop: 14,
    },
    separator: {
      height: 12,
    },
    submissionCard: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 22,
      padding: 16,
      gap: 10,
    },
    submissionHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    },
    submissionTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.black,
    },
    statusBadge: {
      borderRadius: 999,
      backgroundColor: COLORS.green,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    statusText: {
      color: COLORS.white,
      fontSize: 10,
      fontWeight: "800",
      textTransform: "capitalize",
    },
    submissionLocation: {
      fontSize: 12,
      color: COLORS.grayText,
    },
    submissionDescription: {
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.black,
    },
    metricsRow: {
      flexDirection: "row",
      gap: 10,
    },
    metricPill: {
      flex: 1,
      backgroundColor: COLORS.white,
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 12,
      gap: 3,
    },
    metricLabel: {
      fontSize: 10,
      color: COLORS.grayText,
    },
    metricValue: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.black,
    },
    emptyWrap: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 28,
      alignItems: "center",
      gap: 8,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.black,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.grayText,
      textAlign: "center",
    },
    centerState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      gap: 12,
    },
    stateText: {
      fontSize: 13,
      color: COLORS.grayText,
      textAlign: "center",
    },
  });
