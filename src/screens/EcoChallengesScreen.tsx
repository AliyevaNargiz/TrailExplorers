import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";
import {
  loadMergedEcoChallengesProgress,
  saveEcoChallengesProgress,
  saveEcoChallengesProgressToFirebase,
} from "../services/ecoChallengesStorage";
import { auth } from "../services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useFocusEffect } from "@react-navigation/native";

type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  impact: string;
  duration: string;
};

type ChallengeProof = {
  challengeId: string;
  imageUrl: string;
  submittedAt: number;
  status: "pending" | "approved" | "rejected";
  reviewedAt?: number;
  rejectionReason?: string;
};

const challengeData: Challenge[] = [
  {
    id: "cleanup",
    title: "Trail Clean-Up Stop",
    description: "Pick up litter you find along the road and dispose of it responsibly.",
    points: 40,
    impact: "Keeps trails clean for wildlife and hikers.",
    duration: "10 min",
  },
  {
    id: "reusable",
    title: "Refill, Don't Waste",
    description: "Use a reusable water bottle instead of single-use plastic during your hike.",
    points: 25,
    impact: "Cuts plastic waste on the route.",
    duration: "Whole hike",
  },
  {
    id: "respect",
    title: "Leave No Trace Check",
    description: "Finish your hike leaving no food wrappers, tissues, or gear behind.",
    points: 35,
    impact: "Protects the ecosystem and trail quality.",
    duration: "End of hike",
  },
  {
    id: "wildlife",
    title: "Wildlife Respect Mission",
    description: "Observe animals quietly and avoid feeding or disturbing them.",
    points: 30,
    impact: "Supports a safer habitat for local wildlife.",
    duration: "15 min",
  },
];

const rewardMilestones = [
  {
    id: "voucher",
    title: "Eco Trail Sticker Pack",
    pointsRequired: 80,
    description: "A small reward for your first eco-mission streak.",
  },
  {
    id: "bottle",
    title: "Reusable Bottle Gift",
    pointsRequired: 140,
    description: "Earn a practical hiking gift by staying consistent.",
  },
  {
    id: "premium",
    title: "Adventure Reward Box",
    pointsRequired: 220,
    description: "Unlock a bigger seasonal gift after multiple trail actions.",
  },
];

const achievementBadges = [
  {
    id: "first-step",
    title: "First Green Step",
    description: "Complete your first eco challenge on a hike.",
    isUnlocked: (completedIds: string[], totalPoints: number) =>
      completedIds.length >= 1 || totalPoints >= 25,
  },
  {
    id: "trail-guardian",
    title: "Trail Guardian",
    description: "Complete at least 3 eco actions to protect the trail.",
    isUnlocked: (completedIds: string[]) => completedIds.length >= 3,
  },
  {
    id: "eco-hero",
    title: "Eco Hero",
    description: "Reach 100 points through sustainable hiking habits.",
    isUnlocked: (_completedIds: string[], totalPoints: number) =>
      totalPoints >= 100,
  },
];

export default function EcoChallengesScreen() {
  const { colors: COLORS, isDark } = useAppTheme();
  const styles = createStyles(COLORS, isDark);

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>([]);
  const [proofs, setProofs] = useState<ChallengeProof[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [submittingChallengeId, setSubmittingChallengeId] = useState<string | null>(null);

  const loadProgress = async () => {
    setLoadingProgress(true);

    const progress = await loadMergedEcoChallengesProgress();

    setCompletedIds(progress.completedIds);
    setClaimedRewardIds(progress.claimedRewardIds);
    setProofs(progress.proofs ?? []);
    setLoadingProgress(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  useEffect(() => {
    if (loadingProgress) return;

    saveEcoChallengesProgress({
      completedIds,
      claimedRewardIds,
      proofs,
    });

    saveEcoChallengesProgressToFirebase({
      completedIds,
      claimedRewardIds,
      proofs,
    });
  }, [completedIds, claimedRewardIds, proofs, loadingProgress]);

  const totalPoints = useMemo(
    () =>
      challengeData.reduce(
        (sum, challenge) =>
          completedIds.includes(challenge.id) ? sum + challenge.points : sum,
        0
      ),
    [completedIds]
  );

  const unlockedBadges = useMemo(
    () =>
      achievementBadges.filter((badge) =>
        badge.isUnlocked(completedIds, totalPoints)
      ),
    [completedIds, totalPoints]
  );

  const nextReward = rewardMilestones.find(
    (reward) => totalPoints < reward.pointsRequired
  );

  const targetPoints =
    nextReward?.pointsRequired ??
    rewardMilestones[rewardMilestones.length - 1].pointsRequired;

  const progressRatio = Math.min(totalPoints / targetPoints, 1);

  const uploadChallengeProof = async (uri: string, challengeId: string) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    const token = await user.getIdToken();

    const filePath = `ecoChallengeProofs/${user.uid}/${challengeId}_${Date.now()}.jpg`;

    const uploadUrl =
      `https://firebasestorage.googleapis.com/v0/b/trailexplorers-cc935.firebasestorage.app/o` +
      `?uploadType=media&name=${encodeURIComponent(filePath)}`;

    const result = await FileSystem.uploadAsync(uploadUrl, uri, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg",
      },
    });

    if (result.status !== 200) {
      console.log("UPLOAD RESULT:", result);
      throw new Error("Upload failed");
    }

    console.log("UPLOAD RESULT:", result.status, result.body);

    const uploadedFile = JSON.parse(result.body);

    if (!uploadedFile.name) {
      throw new Error("Upload did not return a file name");
    }

    const downloadUrl =
      `https://firebasestorage.googleapis.com/v0/b/trailexplorers-cc935.firebasestorage.app/o/` +
      `${encodeURIComponent(uploadedFile.name)}?alt=media&token=${uploadedFile.downloadTokens}`;

    return downloadUrl;
  };

  const saveChallengeProofToFirestore = async (
    challengeId: string,
    imageUrl: string
  ) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    await addDoc(collection(db, "eco_challenge_proofs"), {
      challengeId,
      imageUrl,
      userId: user.uid,
      userName: user.displayName || "",
      userEmail: user.email || "",
      status: "pending",
      submittedAt: serverTimestamp(),
      reviewedAt: null,
      rejectionReason: "",
    });
  };

  const pickAndSubmitProof = async (
    challengeId: string,
    source: "camera" | "gallery"
  ) => {
    try {
      const challenge = challengeData.find((item) => item.id === challengeId);
      if (!challenge) return;

      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          source === "camera"
            ? "Please allow camera access to submit proof."
            : "Please allow gallery access to submit proof."
        );
        return;
      }

      setSubmittingChallengeId(challengeId);

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              quality: 0.7,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              quality: 0.7,
              allowsEditing: true,
            });

      if (result.canceled) return;

      const imageUrl = await uploadChallengeProof(
        result.assets[0].uri,
        challengeId
      );

      await saveChallengeProofToFirestore(challengeId, imageUrl);

      setProofs((current) => [
        ...current.filter((proof) => proof.challengeId !== challengeId),
        {
          challengeId,
          imageUrl,
          submittedAt: Date.now(),
          status: "pending",
        },
      ]);

      Alert.alert(
        "Proof submitted",
        `${challenge.title} is now waiting for admin approval.`
      );
    } catch (error) {
      console.log("Failed to submit challenge proof", error);
      Alert.alert("Error", "Could not submit challenge proof.");
    } finally {
      setSubmittingChallengeId(null);
    }
  };

  const handleSubmitProof = async (challengeId: string) => {
    const challenge = challengeData.find((item) => item.id === challengeId);
    if (!challenge) return;

    const existingProof = proofs.find(
      (proof) => proof.challengeId === challengeId
    );

    if (existingProof?.status === "pending") {
      Alert.alert(
        "Pending review",
        "Your proof is already waiting for admin review."
      );
      return;
    }

    if (existingProof?.status === "approved") {
      Alert.alert(
        "Already approved",
        "This challenge has already been approved."
      );
      return;
    }

    Alert.alert(
      "Submit photo proof",
      "Choose how you want to add your photo.",
      [
        {
          text: "Camera",
          onPress: () => pickAndSubmitProof(challengeId, "camera"),
        },
        {
          text: "Gallery",
          onPress: () => pickAndSubmitProof(challengeId, "gallery"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const claimReward = (rewardId: string) => {
    const reward = rewardMilestones.find((item) => item.id === rewardId);

    if (!reward) return;
    if (claimedRewardIds.includes(rewardId)) return;
    if (totalPoints < reward.pointsRequired) return;

    setClaimedRewardIds((current) => [...current, rewardId]);

    Alert.alert(
      "Reward claimed",
      `You claimed ${reward.title}. Keep hiking to unlock the next gift.`
    );
  };

  if (loadingProgress) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={COLORS.green} />
        <Text style={styles.loaderText}>Loading your eco progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Eco Rewards</Text>
        <Text style={styles.title}>Turn every hike into a greener adventure</Text>
        <Text style={styles.subtitle}>
          Submit photo proof for eco-friendly trail actions. Points are added
          after admin approval.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Approved points</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedIds.length}</Text>
            <Text style={styles.statLabel}>Approved challenges</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <Text style={styles.sectionMeta}>
          {unlockedBadges.length} / {achievementBadges.length} unlocked
        </Text>
      </View>

      <View style={styles.badgesRow}>
        {achievementBadges.map((badge) => {
          const unlocked = unlockedBadges.some((item) => item.id === badge.id);

          return (
            <View
              key={badge.id}
              style={[styles.badgeCard, unlocked && styles.badgeCardUnlocked]}
            >
              <View style={[styles.badgeIcon, unlocked && styles.badgeIconUnlocked]}>
                <Text style={styles.badgeIconText}>{unlocked ? "★" : "•"}</Text>
              </View>

              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>

              <Text
                style={[
                  styles.badgeStatus,
                  unlocked && styles.badgeStatusUnlocked,
                ]}
              >
                {unlocked ? "Unlocked" : "Locked"}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Reward Progress</Text>
        <Text style={styles.sectionMeta}>
          {nextReward
            ? `${Math.max(nextReward.pointsRequired - totalPoints, 0)} pts to next gift`
            : "Top reward unlocked"}
        </Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>
          {nextReward ? nextReward.title : "Adventure Reward Box"}
        </Text>

        <Text style={styles.progressText}>
          {nextReward
            ? nextReward.description
            : "You reached the highest eco reward available right now."}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.max(progressRatio * 100, 8)}%` },
            ]}
          />
        </View>

        <Text style={styles.progressFootnote}>
          {totalPoints} / {targetPoints} points
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Challenges On The Trail</Text>
        <Text style={styles.sectionMeta}>Photo proof required</Text>
      </View>

      {challengeData.map((challenge) => {
        const completed = completedIds.includes(challenge.id);
        const proof = proofs.find((item) => item.challengeId === challenge.id);
        const isSubmitting = submittingChallengeId === challenge.id;

        const statusText =
          proof?.status === "approved"
            ? "Approved"
            : proof?.status === "pending"
              ? "Pending admin review"
              : proof?.status === "rejected"
                ? "Rejected — submit again"
                : "Submit photo proof";

        return (
          <Pressable
            key={challenge.id}
            style={[
              styles.challengeCard,
              completed && styles.challengeCardCompleted,
              proof?.status === "pending" && styles.challengeCardPending,
              proof?.status === "rejected" && styles.challengeCardRejected,
            ]}
            onPress={() => handleSubmitProof(challenge.id)}
            disabled={
              isSubmitting ||
              proof?.status === "pending" ||
              proof?.status === "approved"
            }
          >
            <View style={styles.challengeTopRow}>
              <View style={styles.challengeBadge}>
                <Text style={styles.challengeBadgeText}>+{challenge.points}</Text>
              </View>

              <Text style={styles.challengeDuration}>{challenge.duration}</Text>
            </View>

            <Text style={styles.challengeTitle}>{challenge.title}</Text>

            <Text style={styles.challengeDescription}>
              {challenge.description}
            </Text>

            <Text style={styles.challengeImpact}>{challenge.impact}</Text>

            {proof?.imageUrl && (
              <Image source={{ uri: proof.imageUrl }} style={styles.proofImage} />
            )}

            <View style={styles.challengeFooter}>
              <Text
                style={[
                  styles.challengeStatus,
                  proof?.status === "approved" && styles.challengeStatusApproved,
                  proof?.status === "pending" && styles.challengeStatusPending,
                  proof?.status === "rejected" && styles.challengeStatusRejected,
                ]}
              >
                {isSubmitting ? "Uploading proof..." : statusText}
              </Text>
            </View>
          </Pressable>
        );
      })}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gift Milestones</Text>
        <Text style={styles.sectionMeta}>Approved points unlock gifts</Text>
      </View>

      {rewardMilestones.map((reward) => {
        const unlocked = totalPoints >= reward.pointsRequired;
        const claimed = claimedRewardIds.includes(reward.id);

        return (
          <View
            key={reward.id}
            style={[
              styles.rewardCard,
              unlocked && styles.rewardCardUnlocked,
            ]}
          >
            <View style={styles.rewardRow}>
              <View>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
              </View>

              <View style={styles.rewardPointsPill}>
                <Text style={styles.rewardPointsText}>
                  {reward.pointsRequired} pts
                </Text>
              </View>
            </View>

            <Text style={[styles.rewardStatus, unlocked && styles.rewardStatusUnlocked]}>
              {claimed
                ? "Claimed"
                : unlocked
                  ? "Ready to claim"
                  : "Keep hiking to unlock"}
            </Text>

            <Pressable
              style={[
                styles.claimButton,
                !unlocked && styles.claimButtonDisabled,
                claimed && styles.claimButtonClaimed,
              ]}
              onPress={() => claimReward(reward.id)}
              disabled={!unlocked || claimed}
            >
              <Text
                style={[
                  styles.claimButtonText,
                  (!unlocked || claimed) && styles.claimButtonTextDisabled,
                ]}
              >
                {claimed ? "Claimed" : unlocked ? "Claim Reward" : "Locked"}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (COLORS: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    loaderWrap: {
      flex: 1,
      backgroundColor: COLORS.white,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    loaderText: {
      marginTop: 12,
      fontSize: 13,
      color: COLORS.grayText,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 28,
    },
    heroCard: {
      borderRadius: 28,
      padding: 20,
      backgroundColor: isDark ? "#182229" : "#edf6ef",
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1,
      textTransform: "uppercase",
      color: COLORS.darkGreen,
    },
    title: {
      marginTop: 10,
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "800",
      color: COLORS.black,
    },
    subtitle: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.grayText,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 18,
    },
    statCard: {
      flex: 1,
      borderRadius: 18,
      padding: 16,
      backgroundColor: COLORS.white,
    },
    statValue: {
      fontSize: 22,
      fontWeight: "800",
      color: COLORS.black,
    },
    statLabel: {
      marginTop: 4,
      fontSize: 12,
      color: COLORS.grayText,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: 10,
      marginTop: 22,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.black,
    },
    sectionMeta: {
      fontSize: 11,
      color: COLORS.grayText,
    },
    badgesRow: {
      gap: 12,
    },
    badgeCard: {
      borderRadius: 22,
      padding: 18,
      backgroundColor: COLORS.lightGray,
      borderWidth: 1,
      borderColor: "transparent",
    },
    badgeCardUnlocked: {
      borderColor: COLORS.accent,
    },
    badgeIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? COLORS.border : "#e3e3e3",
    },
    badgeIconUnlocked: {
      backgroundColor: COLORS.accent,
    },
    badgeIconText: {
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.black,
    },
    badgeTitle: {
      marginTop: 12,
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.black,
    },
    badgeDescription: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.grayText,
    },
    badgeStatus: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.grayText,
    },
    badgeStatusUnlocked: {
      color: COLORS.accent,
    },
    progressCard: {
      borderRadius: 22,
      padding: 18,
      backgroundColor: COLORS.lightGray,
    },
    progressTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: COLORS.black,
    },
    progressText: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.grayText,
    },
    progressTrack: {
      marginTop: 14,
      height: 10,
      borderRadius: 999,
      backgroundColor: isDark ? COLORS.border : "#d9e6db",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: COLORS.green,
    },
    progressFootnote: {
      marginTop: 8,
      fontSize: 12,
      color: COLORS.grayText,
    },
    challengeCard: {
      borderRadius: 22,
      padding: 18,
      backgroundColor: COLORS.lightGray,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "transparent",
    },
    challengeCardCompleted: {
      borderColor: COLORS.green,
    },
    challengeCardPending: {
      borderColor: COLORS.accent,
    },
    challengeCardRejected: {
      borderColor: "#d9534f",
    },
    challengeTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    challengeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: COLORS.green,
    },
    challengeBadgeText: {
      fontSize: 11,
      fontWeight: "800",
      color: "#ffffff",
    },
    challengeDuration: {
      fontSize: 11,
      color: COLORS.grayText,
    },
    challengeTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: COLORS.black,
    },
    challengeDescription: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.grayText,
    },
    challengeImpact: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: "600",
      color: COLORS.darkGreen,
    },
    proofImage: {
      marginTop: 12,
      width: "100%",
      height: 160,
      borderRadius: 16,
    },
    challengeFooter: {
      marginTop: 14,
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    challengeStatus: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.black,
    },
    challengeStatusApproved: {
      color: COLORS.green,
    },
    challengeStatusPending: {
      color: COLORS.accent,
    },
    challengeStatusRejected: {
      color: "#d9534f",
    },
    rewardCard: {
      borderRadius: 22,
      padding: 18,
      backgroundColor: COLORS.lightGray,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "transparent",
    },
    rewardCardUnlocked: {
      borderColor: COLORS.accent,
    },
    rewardRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    rewardTitle: {
      flexShrink: 1,
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.black,
    },
    rewardDescription: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.grayText,
      maxWidth: 220,
    },
    rewardPointsPill: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: isDark ? COLORS.border : "#fff4d2",
    },
    rewardPointsText: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.black,
    },
    rewardStatus: {
      marginTop: 12,
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.grayText,
    },
    rewardStatusUnlocked: {
      color: COLORS.accent,
    },
    claimButton: {
      marginTop: 14,
      borderRadius: 16,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.green,
    },
    claimButtonDisabled: {
      backgroundColor: isDark ? COLORS.border : "#d8d8d8",
    },
    claimButtonClaimed: {
      backgroundColor: COLORS.accent,
    },
    claimButtonText: {
      fontSize: 13,
      fontWeight: "800",
      color: "#ffffff",
    },
    claimButtonTextDisabled: {
      color: isDark ? COLORS.grayText : "#6f6f6f",
    },
  });


// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Alert,
//   ActivityIndicator,
//   Image,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { ref, getDownloadURL } from "firebase/storage";
// import * as FileSystem from "expo-file-system/legacy";
// import { type ThemeColors, useAppTheme } from "../theme/themeContext";
// import {
//   loadMergedEcoChallengesProgress,
//   saveEcoChallengesProgress,
//   saveEcoChallengesProgressToFirebase,
// } from "../services/ecoChallengesStorage";
// import { auth, storage } from "../services/firebase";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../services/firebase";
// import { useFocusEffect } from "@react-navigation/native";

// type Challenge = {
//   id: string;
//   title: string;
//   description: string;
//   points: number;
//   impact: string;
//   duration: string;
// };

// type ChallengeProof = {
//   challengeId: string;
//   imageUrl: string;
//   submittedAt: number;
//   status: "pending" | "approved" | "rejected";
//   reviewedAt?: number;
//   rejectionReason?: string;
// };

// const challengeData: Challenge[] = [
//   {
//     id: "cleanup",
//     title: "Trail Clean-Up Stop",
//     description: "Pick up litter you find along the road and dispose of it responsibly.",
//     points: 40,
//     impact: "Keeps trails clean for wildlife and hikers.",
//     duration: "10 min",
//   },
//   {
//     id: "reusable",
//     title: "Refill, Don't Waste",
//     description: "Use a reusable water bottle instead of single-use plastic during your hike.",
//     points: 25,
//     impact: "Cuts plastic waste on the route.",
//     duration: "Whole hike",
//   },
//   {
//     id: "respect",
//     title: "Leave No Trace Check",
//     description: "Finish your hike leaving no food wrappers, tissues, or gear behind.",
//     points: 35,
//     impact: "Protects the ecosystem and trail quality.",
//     duration: "End of hike",
//   },
//   {
//     id: "wildlife",
//     title: "Wildlife Respect Mission",
//     description: "Observe animals quietly and avoid feeding or disturbing them.",
//     points: 30,
//     impact: "Supports a safer habitat for local wildlife.",
//     duration: "15 min",
//   },
// ];

// const rewardMilestones = [
//   {
//     id: "voucher",
//     title: "Eco Trail Sticker Pack",
//     pointsRequired: 80,
//     description: "A small reward for your first eco-mission streak.",
//   },
//   {
//     id: "bottle",
//     title: "Reusable Bottle Gift",
//     pointsRequired: 140,
//     description: "Earn a practical hiking gift by staying consistent.",
//   },
//   {
//     id: "premium",
//     title: "Adventure Reward Box",
//     pointsRequired: 220,
//     description: "Unlock a bigger seasonal gift after multiple trail actions.",
//   },
// ];

// const achievementBadges = [
//   {
//     id: "first-step",
//     title: "First Green Step",
//     description: "Complete your first eco challenge on a hike.",
//     isUnlocked: (completedIds: string[], totalPoints: number) =>
//       completedIds.length >= 1 || totalPoints >= 25,
//   },
//   {
//     id: "trail-guardian",
//     title: "Trail Guardian",
//     description: "Complete at least 3 eco actions to protect the trail.",
//     isUnlocked: (completedIds: string[]) => completedIds.length >= 3,
//   },
//   {
//     id: "eco-hero",
//     title: "Eco Hero",
//     description: "Reach 100 points through sustainable hiking habits.",
//     isUnlocked: (_completedIds: string[], totalPoints: number) =>
//       totalPoints >= 100,
//   },
// ];

// export default function EcoChallengesScreen() {
//   const { colors: COLORS, isDark } = useAppTheme();
//   const styles = createStyles(COLORS, isDark);

//   const [completedIds, setCompletedIds] = useState<string[]>([]);
//   const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>([]);
//   const [proofs, setProofs] = useState<ChallengeProof[]>([]);
//   const [loadingProgress, setLoadingProgress] = useState(true);
//   const [submittingChallengeId, setSubmittingChallengeId] = useState<string | null>(null);

//   const loadProgress = async () => {
//   setLoadingProgress(true);

//   const progress = await loadMergedEcoChallengesProgress();

//   setCompletedIds(progress.completedIds);
//   setClaimedRewardIds(progress.claimedRewardIds);
//   setProofs(progress.proofs ?? []);
//   setLoadingProgress(false);
// };

// useFocusEffect(
//   useCallback(() => {
//     loadProgress();
//   }, [])
// );

//   useEffect(() => {
//     if (loadingProgress) return;

//     saveEcoChallengesProgress({
//       completedIds,
//       claimedRewardIds,
//       proofs,
//     });

//     saveEcoChallengesProgressToFirebase({
//       completedIds,
//       claimedRewardIds,
//       proofs,
//     });
//   }, [completedIds, claimedRewardIds, proofs, loadingProgress]);

//   const totalPoints = useMemo(
//     () =>
//       challengeData.reduce(
//         (sum, challenge) =>
//           completedIds.includes(challenge.id) ? sum + challenge.points : sum,
//         0
//       ),
//     [completedIds]
//   );

//   const unlockedBadges = useMemo(
//     () =>
//       achievementBadges.filter((badge) =>
//         badge.isUnlocked(completedIds, totalPoints)
//       ),
//     [completedIds, totalPoints]
//   );

//   const nextReward = rewardMilestones.find(
//     (reward) => totalPoints < reward.pointsRequired
//   );

//   const targetPoints =
//     nextReward?.pointsRequired ??
//     rewardMilestones[rewardMilestones.length - 1].pointsRequired;

//   const progressRatio = Math.min(totalPoints / targetPoints, 1);

// const uploadChallengeProof = async (uri: string, challengeId: string) => {
//   const user = auth.currentUser;

//   if (!user) {
//     throw new Error("User not logged in");
//   }

//   const token = await user.getIdToken();

//   const filePath = `ecoChallengeProofs/${user.uid}/${challengeId}_${Date.now()}.jpg`;

//   const uploadUrl =
//     `https://firebasestorage.googleapis.com/v0/b/trailexplorers-cc935.firebasestorage.app/o` +
//     `?uploadType=media&name=${encodeURIComponent(filePath)}`;

//   const result = await FileSystem.uploadAsync(uploadUrl, uri, {
//     httpMethod: "POST",
//     uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "image/jpeg",
//     },
//   });

//   if (result.status !== 200) {
//     console.log("UPLOAD RESULT:", result);
//     throw new Error("Upload failed");
//   }

//   console.log("UPLOAD RESULT:", result.status, result.body);

// const uploadedFile = JSON.parse(result.body);

// if (!uploadedFile.name) {
//   throw new Error("Upload did not return a file name");
// }

// // const downloadUrl =
// //   `https://firebasestorage.googleapis.com/v0/b/trailexplorers-cc935.firebasestorage.app/o/` +
// //   `${encodeURIComponent(uploadedFile.name)}?alt=media`;

// const downloadUrl =
//   `https://firebasestorage.googleapis.com/v0/b/trailexplorers-cc935.firebasestorage.app/o/` +
//   `${encodeURIComponent(uploadedFile.name)}?alt=media&token=${uploadedFile.downloadTokens}`;

// return downloadUrl;
// };

//   const handleSubmitProof = async (challengeId: string) => {
//     try {
//       const challenge = challengeData.find((item) => item.id === challengeId);
//       if (!challenge) return;

//       const existingProof = proofs.find(
//         (proof) => proof.challengeId === challengeId
//       );

//       if (existingProof?.status === "pending") {
//         Alert.alert(
//           "Pending review",
//           "Your proof is already waiting for admin review."
//         );
//         return;
//       }

//       if (existingProof?.status === "approved") {
//         Alert.alert(
//           "Already approved",
//           "This challenge has already been approved."
//         );
//         return;
//       }

//       const permission = await ImagePicker.requestCameraPermissionsAsync();

// if (!permission.granted) {
//   Alert.alert(
//     "Camera permission needed",
//     "Please allow camera access to submit proof."
//   );
//   return;
// }

// setSubmittingChallengeId(challengeId);

// const result = await ImagePicker.launchCameraAsync({
//   mediaTypes: ["images"],
//   quality: 0.7,
// });
//       if (result.canceled) return;

//       const imageUrl = await uploadChallengeProof(
//         result.assets[0].uri,
//         challengeId
//       );
//       await saveChallengeProofToFirestore(challengeId, imageUrl);

//       setProofs((current) => [
//         ...current.filter((proof) => proof.challengeId !== challengeId),
//         {
//           challengeId,
//           imageUrl,
//           submittedAt: Date.now(),
//           status: "pending",
//         },
//       ]);

//       Alert.alert(
//         "Proof submitted",
//         `${challenge.title} is now waiting for admin approval.`
//       );
//     } catch (error) {
//       console.log("Failed to submit challenge proof", error);
//       Alert.alert("Error", "Could not submit challenge proof.");
//     } finally {
//       setSubmittingChallengeId(null);
//     }
//   };

//   const saveChallengeProofToFirestore = async (
//   challengeId: string,
//   imageUrl: string
// ) => {
//   const user = auth.currentUser;

//   if (!user) {
//     throw new Error("User not logged in");
//   }

//   await addDoc(collection(db, "eco_challenge_proofs"), {
//     challengeId,
//     imageUrl,
//     userId: user.uid,
//     userName: user.displayName || "",
//     userEmail: user.email || "",
//     status: "pending",
//     submittedAt: serverTimestamp(),
//     reviewedAt: null,
//     rejectionReason: "",
//   });
// };

//   const claimReward = (rewardId: string) => {
//     const reward = rewardMilestones.find((item) => item.id === rewardId);

//     if (!reward) return;
//     if (claimedRewardIds.includes(rewardId)) return;
//     if (totalPoints < reward.pointsRequired) return;

//     setClaimedRewardIds((current) => [...current, rewardId]);

//     Alert.alert(
//       "Reward claimed",
//       `You claimed ${reward.title}. Keep hiking to unlock the next gift.`
//     );
//   };

//   if (loadingProgress) {
//     return (
//       <View style={styles.loaderWrap}>
//         <ActivityIndicator size="large" color={COLORS.green} />
//         <Text style={styles.loaderText}>Loading your eco progress...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       showsVerticalScrollIndicator={false}
//     >
//       <View style={styles.heroCard}>
//         <Text style={styles.eyebrow}>Eco Rewards</Text>
//         <Text style={styles.title}>Turn every hike into a greener adventure</Text>
//         <Text style={styles.subtitle}>
//           Submit photo proof for eco-friendly trail actions. Points are added
//           after admin approval.
//         </Text>

//         <View style={styles.statsRow}>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{totalPoints}</Text>
//             <Text style={styles.statLabel}>Approved points</Text>
//           </View>

//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{completedIds.length}</Text>
//             <Text style={styles.statLabel}>Approved challenges</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Achievements</Text>
//         <Text style={styles.sectionMeta}>
//           {unlockedBadges.length} / {achievementBadges.length} unlocked
//         </Text>
//       </View>

//       <View style={styles.badgesRow}>
//         {achievementBadges.map((badge) => {
//           const unlocked = unlockedBadges.some((item) => item.id === badge.id);

//           return (
//             <View
//               key={badge.id}
//               style={[styles.badgeCard, unlocked && styles.badgeCardUnlocked]}
//             >
//               <View style={[styles.badgeIcon, unlocked && styles.badgeIconUnlocked]}>
//                 <Text style={styles.badgeIconText}>{unlocked ? "★" : "•"}</Text>
//               </View>

//               <Text style={styles.badgeTitle}>{badge.title}</Text>
//               <Text style={styles.badgeDescription}>{badge.description}</Text>

//               <Text
//                 style={[
//                   styles.badgeStatus,
//                   unlocked && styles.badgeStatusUnlocked,
//                 ]}
//               >
//                 {unlocked ? "Unlocked" : "Locked"}
//               </Text>
//             </View>
//           );
//         })}
//       </View>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Reward Progress</Text>
//         <Text style={styles.sectionMeta}>
//           {nextReward
//             ? `${Math.max(nextReward.pointsRequired - totalPoints, 0)} pts to next gift`
//             : "Top reward unlocked"}
//         </Text>
//       </View>

//       <View style={styles.progressCard}>
//         <Text style={styles.progressTitle}>
//           {nextReward ? nextReward.title : "Adventure Reward Box"}
//         </Text>

//         <Text style={styles.progressText}>
//           {nextReward
//             ? nextReward.description
//             : "You reached the highest eco reward available right now."}
//         </Text>

//         <View style={styles.progressTrack}>
//           <View
//             style={[
//               styles.progressFill,
//               { width: `${Math.max(progressRatio * 100, 8)}%` },
//             ]}
//           />
//         </View>

//         <Text style={styles.progressFootnote}>
//           {totalPoints} / {targetPoints} points
//         </Text>
//       </View>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Challenges On The Trail</Text>
//         <Text style={styles.sectionMeta}>Photo proof required</Text>
//       </View>

//       {challengeData.map((challenge) => {
//         const completed = completedIds.includes(challenge.id);
//         const proof = proofs.find((item) => item.challengeId === challenge.id);
//         const isSubmitting = submittingChallengeId === challenge.id;

//         const statusText =
//           proof?.status === "approved"
//             ? "Approved"
//             : proof?.status === "pending"
//               ? "Pending admin review"
//               : proof?.status === "rejected"
//                 ? "Rejected — submit again"
//                 : "Submit photo proof";

//         return (
//           <Pressable
//             key={challenge.id}
//             style={[
//               styles.challengeCard,
//               completed && styles.challengeCardCompleted,
//               proof?.status === "pending" && styles.challengeCardPending,
//               proof?.status === "rejected" && styles.challengeCardRejected,
//             ]}
//             onPress={() => handleSubmitProof(challenge.id)}
//             disabled={isSubmitting || proof?.status === "pending" || proof?.status === "approved"}
//           >
//             <View style={styles.challengeTopRow}>
//               <View style={styles.challengeBadge}>
//                 <Text style={styles.challengeBadgeText}>+{challenge.points}</Text>
//               </View>

//               <Text style={styles.challengeDuration}>{challenge.duration}</Text>
//             </View>

//             <Text style={styles.challengeTitle}>{challenge.title}</Text>

//             <Text style={styles.challengeDescription}>
//               {challenge.description}
//             </Text>

//             <Text style={styles.challengeImpact}>{challenge.impact}</Text>

//             {proof?.imageUrl && (
//               <Image source={{ uri: proof.imageUrl }} style={styles.proofImage} />
//             )}

//             <View style={styles.challengeFooter}>
//               <Text
//                 style={[
//                   styles.challengeStatus,
//                   proof?.status === "approved" && styles.challengeStatusApproved,
//                   proof?.status === "pending" && styles.challengeStatusPending,
//                   proof?.status === "rejected" && styles.challengeStatusRejected,
//                 ]}
//               >
//                 {isSubmitting ? "Uploading proof..." : statusText}
//               </Text>
//             </View>
//           </Pressable>
//         );
//       })}

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Gift Milestones</Text>
//         <Text style={styles.sectionMeta}>Approved points unlock gifts</Text>
//       </View>

//       {rewardMilestones.map((reward) => {
//         const unlocked = totalPoints >= reward.pointsRequired;
//         const claimed = claimedRewardIds.includes(reward.id);

//         return (
//           <View
//             key={reward.id}
//             style={[
//               styles.rewardCard,
//               unlocked && styles.rewardCardUnlocked,
//             ]}
//           >
//             <View style={styles.rewardRow}>
//               <View>
//                 <Text style={styles.rewardTitle}>{reward.title}</Text>
//                 <Text style={styles.rewardDescription}>{reward.description}</Text>
//               </View>

//               <View style={styles.rewardPointsPill}>
//                 <Text style={styles.rewardPointsText}>
//                   {reward.pointsRequired} pts
//                 </Text>
//               </View>
//             </View>

//             <Text style={[styles.rewardStatus, unlocked && styles.rewardStatusUnlocked]}>
//               {claimed
//                 ? "Claimed"
//                 : unlocked
//                   ? "Ready to claim"
//                   : "Keep hiking to unlock"}
//             </Text>

//             <Pressable
//               style={[
//                 styles.claimButton,
//                 !unlocked && styles.claimButtonDisabled,
//                 claimed && styles.claimButtonClaimed,
//               ]}
//               onPress={() => claimReward(reward.id)}
//               disabled={!unlocked || claimed}
//             >
//               <Text
//                 style={[
//                   styles.claimButtonText,
//                   (!unlocked || claimed) && styles.claimButtonTextDisabled,
//                 ]}
//               >
//                 {claimed ? "Claimed" : unlocked ? "Claim Reward" : "Locked"}
//               </Text>
//             </Pressable>
//           </View>
//         );
//       })}
//     </ScrollView>
//   );
// }

// const createStyles = (COLORS: ThemeColors, isDark: boolean) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//     },
//     loaderWrap: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//       alignItems: "center",
//       justifyContent: "center",
//       padding: 24,
//     },
//     loaderText: {
//       marginTop: 12,
//       fontSize: 13,
//       color: COLORS.grayText,
//     },
//     content: {
//       paddingHorizontal: 20,
//       paddingTop: 18,
//       paddingBottom: 28,
//     },
//     heroCard: {
//       borderRadius: 28,
//       padding: 20,
//       backgroundColor: isDark ? "#182229" : "#edf6ef",
//     },
//     eyebrow: {
//       fontSize: 11,
//       fontWeight: "800",
//       letterSpacing: 1,
//       textTransform: "uppercase",
//       color: COLORS.darkGreen,
//     },
//     title: {
//       marginTop: 10,
//       fontSize: 24,
//       lineHeight: 30,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     subtitle: {
//       marginTop: 8,
//       fontSize: 13,
//       lineHeight: 20,
//       color: COLORS.grayText,
//     },
//     statsRow: {
//       flexDirection: "row",
//       gap: 12,
//       marginTop: 18,
//     },
//     statCard: {
//       flex: 1,
//       borderRadius: 18,
//       padding: 16,
//       backgroundColor: COLORS.white,
//     },
//     statValue: {
//       fontSize: 22,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     statLabel: {
//       marginTop: 4,
//       fontSize: 12,
//       color: COLORS.grayText,
//     },
//     sectionHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "flex-end",
//       gap: 10,
//       marginTop: 22,
//       marginBottom: 10,
//     },
//     sectionTitle: {
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     sectionMeta: {
//       fontSize: 11,
//       color: COLORS.grayText,
//     },
//     badgesRow: {
//       gap: 12,
//     },
//     badgeCard: {
//       borderRadius: 22,
//       padding: 18,
//       backgroundColor: COLORS.lightGray,
//       borderWidth: 1,
//       borderColor: "transparent",
//     },
//     badgeCardUnlocked: {
//       borderColor: COLORS.accent,
//     },
//     badgeIcon: {
//       width: 34,
//       height: 34,
//       borderRadius: 17,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: isDark ? COLORS.border : "#e3e3e3",
//     },
//     badgeIconUnlocked: {
//       backgroundColor: COLORS.accent,
//     },
//     badgeIconText: {
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     badgeTitle: {
//       marginTop: 12,
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     badgeDescription: {
//       marginTop: 6,
//       fontSize: 12,
//       lineHeight: 18,
//       color: COLORS.grayText,
//     },
//     badgeStatus: {
//       marginTop: 10,
//       fontSize: 12,
//       fontWeight: "700",
//       color: COLORS.grayText,
//     },
//     badgeStatusUnlocked: {
//       color: COLORS.accent,
//     },
//     progressCard: {
//       borderRadius: 22,
//       padding: 18,
//       backgroundColor: COLORS.lightGray,
//     },
//     progressTitle: {
//       fontSize: 17,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     progressText: {
//       marginTop: 6,
//       fontSize: 12,
//       lineHeight: 18,
//       color: COLORS.grayText,
//     },
//     progressTrack: {
//       marginTop: 14,
//       height: 10,
//       borderRadius: 999,
//       backgroundColor: isDark ? COLORS.border : "#d9e6db",
//       overflow: "hidden",
//     },
//     progressFill: {
//       height: "100%",
//       borderRadius: 999,
//       backgroundColor: COLORS.green,
//     },
//     progressFootnote: {
//       marginTop: 8,
//       fontSize: 12,
//       color: COLORS.grayText,
//     },
//     challengeCard: {
//       borderRadius: 22,
//       padding: 18,
//       backgroundColor: COLORS.lightGray,
//       marginBottom: 12,
//       borderWidth: 1,
//       borderColor: "transparent",
//     },
//     challengeCardCompleted: {
//       borderColor: COLORS.green,
//     },
//     challengeCardPending: {
//       borderColor: COLORS.accent,
//     },
//     challengeCardRejected: {
//       borderColor: "#d9534f",
//     },
//     challengeTopRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 12,
//     },
//     challengeBadge: {
//       paddingHorizontal: 10,
//       paddingVertical: 6,
//       borderRadius: 999,
//       backgroundColor: COLORS.green,
//     },
//     challengeBadgeText: {
//       fontSize: 11,
//       fontWeight: "800",
//       color: "#ffffff",
//     },
//     challengeDuration: {
//       fontSize: 11,
//       color: COLORS.grayText,
//     },
//     challengeTitle: {
//       fontSize: 17,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     challengeDescription: {
//       marginTop: 6,
//       fontSize: 13,
//       lineHeight: 19,
//       color: COLORS.grayText,
//     },
//     challengeImpact: {
//       marginTop: 10,
//       fontSize: 12,
//       fontWeight: "600",
//       color: COLORS.darkGreen,
//     },
//     proofImage: {
//       marginTop: 12,
//       width: "100%",
//       height: 160,
//       borderRadius: 16,
//     },
//     challengeFooter: {
//       marginTop: 14,
//       flexDirection: "row",
//       justifyContent: "flex-start",
//     },
//     challengeStatus: {
//       fontSize: 12,
//       fontWeight: "700",
//       color: COLORS.black,
//     },
//     challengeStatusApproved: {
//       color: COLORS.green,
//     },
//     challengeStatusPending: {
//       color: COLORS.accent,
//     },
//     challengeStatusRejected: {
//       color: "#d9534f",
//     },
//     rewardCard: {
//       borderRadius: 22,
//       padding: 18,
//       backgroundColor: COLORS.lightGray,
//       marginBottom: 12,
//       borderWidth: 1,
//       borderColor: "transparent",
//     },
//     rewardCardUnlocked: {
//       borderColor: COLORS.accent,
//     },
//     rewardRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       gap: 12,
//     },
//     rewardTitle: {
//       flexShrink: 1,
//       fontSize: 16,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     rewardDescription: {
//       marginTop: 6,
//       fontSize: 12,
//       lineHeight: 18,
//       color: COLORS.grayText,
//       maxWidth: 220,
//     },
//     rewardPointsPill: {
//       alignSelf: "flex-start",
//       paddingHorizontal: 10,
//       paddingVertical: 7,
//       borderRadius: 999,
//       backgroundColor: isDark ? COLORS.border : "#fff4d2",
//     },
//     rewardPointsText: {
//       fontSize: 11,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     rewardStatus: {
//       marginTop: 12,
//       fontSize: 12,
//       fontWeight: "700",
//       color: COLORS.grayText,
//     },
//     rewardStatusUnlocked: {
//       color: COLORS.accent,
//     },
//     claimButton: {
//       marginTop: 14,
//       borderRadius: 16,
//       paddingVertical: 12,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: COLORS.green,
//     },
//     claimButtonDisabled: {
//       backgroundColor: isDark ? COLORS.border : "#d8d8d8",
//     },
//     claimButtonClaimed: {
//       backgroundColor: COLORS.accent,
//     },
//     claimButtonText: {
//       fontSize: 13,
//       fontWeight: "800",
//       color: "#ffffff",
//     },
//     claimButtonTextDisabled: {
//       color: isDark ? COLORS.grayText : "#6f6f6f",
//     },
//   });


// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Alert,
//   ActivityIndicator,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Image,
//   Text,
//   View,
// } from "react-native";

// import { type ThemeColors, useAppTheme } from "../theme/themeContext";
// import {
//   loadMergedEcoChallengesProgress,
//   saveEcoChallengesProgress,
//   saveEcoChallengesProgressToFirebase,
// } from "../services/ecoChallengesStorage";
// import * as ImagePicker from "expo-image-picker";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { auth, storage } from "../services/firebase";

// type Challenge = {
//   id: string;
//   title: string;
//   description: string;
//   points: number;
//   impact: string;
//   duration: string;
// };

// const challengeData: Challenge[] = [
//   {
//     id: "cleanup",
//     title: "Trail Clean-Up Stop",
//     description: "Pick up litter you find along the road and dispose of it responsibly.",
//     points: 40,
//     impact: "Keeps trails clean for wildlife and hikers.",
//     duration: "10 min",
//   },
//   {
//     id: "reusable",
//     title: "Refill, Don't Waste",
//     description: "Use a reusable water bottle instead of single-use plastic during your hike.",
//     points: 25,
//     impact: "Cuts plastic waste on the route.",
//     duration: "Whole hike",
//   },
//   {
//     id: "respect",
//     title: "Leave No Trace Check",
//     description: "Finish your hike leaving no food wrappers, tissues, or gear behind.",
//     points: 35,
//     impact: "Protects the ecosystem and trail quality.",
//     duration: "End of hike",
//   },
//   {
//     id: "wildlife",
//     title: "Wildlife Respect Mission",
//     description: "Observe animals quietly and avoid feeding or disturbing them.",
//     points: 30,
//     impact: "Supports a safer habitat for local wildlife.",
//     duration: "15 min",
//   },
// ];

// const rewardMilestones = [
//   {
//     id: "voucher",
//     title: "Eco Trail Sticker Pack",
//     pointsRequired: 80,
//     description: "A small reward for your first eco-mission streak.",
//   },
//   {
//     id: "bottle",
//     title: "Reusable Bottle Gift",
//     pointsRequired: 140,
//     description: "Earn a practical hiking gift by staying consistent.",
//   },
//   {
//     id: "premium",
//     title: "Adventure Reward Box",
//     pointsRequired: 220,
//     description: "Unlock a bigger seasonal gift after multiple trail actions.",
//   },
// ];
// const [proofs, setProofs] = useState<
//   { challengeId: string; imageUrl: string; completedAt: number }[]
// >([]);

// const achievementBadges = [
//   {
//     id: "first-step",
//     title: "First Green Step",
//     description: "Complete your first eco challenge on a hike.",
//     isUnlocked: (completedIds: string[], totalPoints: number) =>
//       completedIds.length >= 1 || totalPoints >= 25,
//   },
//   {
//     id: "trail-guardian",
//     title: "Trail Guardian",
//     description: "Complete at least 3 eco actions to protect the trail.",
//     isUnlocked: (completedIds: string[]) => completedIds.length >= 3,
//   },
//   {
//     id: "eco-hero",
//     title: "Eco Hero",
//     description: "Reach 100 points through sustainable hiking habits.",
//     isUnlocked: (_completedIds: string[], totalPoints: number) =>
//       totalPoints >= 100,
//   },
// ];

// export default function EcoChallengesScreen() {
//   const { colors: COLORS, isDark } = useAppTheme();
//   const styles = createStyles(COLORS, isDark);
//   const [completedIds, setCompletedIds] = useState<string[]>([]);
//   const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>([]);
//   const [loadingProgress, setLoadingProgress] = useState(true);

//   useEffect(() => {
//     let mounted = true;

//     const loadProgress = async () => {
//       const progress = await loadMergedEcoChallengesProgress();

//       if (!mounted) return;

//       setCompletedIds(progress.completedIds);
//       setClaimedRewardIds(progress.claimedRewardIds);
//       setLoadingProgress(false);
//     };

//     loadProgress();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     if (loadingProgress) return;

//     saveEcoChallengesProgress({
//       completedIds,
//       claimedRewardIds,
//     });
//     saveEcoChallengesProgressToFirebase({
//       completedIds,
//       claimedRewardIds,
//     });
//   }, [claimedRewardIds, completedIds, loadingProgress]);

//   const totalPoints = useMemo(
//     () =>
//       challengeData.reduce(
//         (sum, challenge) =>
//           completedIds.includes(challenge.id) ? sum + challenge.points : sum,
//         0
//       ),
//     [completedIds]
//   );

//   const unlockedBadges = useMemo(
//     () =>
//       achievementBadges.filter((badge) =>
//         badge.isUnlocked(completedIds, totalPoints)
//       ),
//     [completedIds, totalPoints]
//   );

//   const nextReward = rewardMilestones.find(
//     (reward) => totalPoints < reward.pointsRequired
//   );
//   const targetPoints =
//     nextReward?.pointsRequired ??
//     rewardMilestones[rewardMilestones.length - 1].pointsRequired;
//   const progressRatio = Math.min(totalPoints / targetPoints, 1);

//   const toggleChallenge = (challengeId: string) => {
//     const challenge = challengeData.find((item) => item.id === challengeId);
//     if (!challenge) return;

//     const isCompleted = completedIds.includes(challengeId);

//     setCompletedIds((current) =>
//       isCompleted
//         ? current.filter((id) => id !== challengeId)
//         : [...current, challengeId]
//     );

//     if (!isCompleted) {
//       Alert.alert(
//         "Challenge completed",
//         `You earned ${challenge.points} points for ${challenge.title}.`
//       );
//     }
//   };

//   const claimReward = (rewardId: string) => {
//     const reward = rewardMilestones.find((item) => item.id === rewardId);

//     if (!reward) return;
//     if (claimedRewardIds.includes(rewardId)) return;
//     if (totalPoints < reward.pointsRequired) return;

//     setClaimedRewardIds((current) => [...current, rewardId]);
//     Alert.alert(
//       "Reward claimed",
//       `You claimed ${reward.title}. Keep hiking to unlock the next gift.`
//     );
//   };

//   if (loadingProgress) {
//     return (
//       <View style={styles.loaderWrap}>
//         <ActivityIndicator size="large" color={COLORS.green} />
//         <Text style={styles.loaderText}>Loading your eco progress...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       showsVerticalScrollIndicator={false}
//     >
//       <View style={styles.heroCard}>
//         <Text style={styles.eyebrow}>Eco Rewards</Text>
//         <Text style={styles.title}>Turn every hike into a greener adventure</Text>
//         <Text style={styles.subtitle}>
//           Complete eco-friendly actions on the trail, earn points, and unlock
//           gifts that keep hikers motivated to care for nature.
//         </Text>

//         <View style={styles.statsRow}>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{totalPoints}</Text>
//             <Text style={styles.statLabel}>Points earned</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{completedIds.length}</Text>
//             <Text style={styles.statLabel}>Challenges done</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Achievements</Text>
//         <Text style={styles.sectionMeta}>
//           {unlockedBadges.length} / {achievementBadges.length} unlocked
//         </Text>
//       </View>

//       <View style={styles.badgesRow}>
//         {achievementBadges.map((badge) => {
//           const unlocked = unlockedBadges.some((item) => item.id === badge.id);

//           return (
//             <View
//               key={badge.id}
//               style={[styles.badgeCard, unlocked && styles.badgeCardUnlocked]}
//             >
//               <View style={[styles.badgeIcon, unlocked && styles.badgeIconUnlocked]}>
//                 <Text style={styles.badgeIconText}>{unlocked ? "★" : "•"}</Text>
//               </View>
//               <Text style={styles.badgeTitle}>{badge.title}</Text>
//               <Text style={styles.badgeDescription}>{badge.description}</Text>
//               <Text
//                 style={[
//                   styles.badgeStatus,
//                   unlocked && styles.badgeStatusUnlocked,
//                 ]}
//               >
//                 {unlocked ? "Unlocked" : "Locked"}
//               </Text>
//             </View>
//           );
//         })}
//       </View>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Reward Progress</Text>
//         <Text style={styles.sectionMeta}>
//           {nextReward
//             ? `${Math.max(nextReward.pointsRequired - totalPoints, 0)} pts to next gift`
//             : "Top reward unlocked"}
//         </Text>
//       </View>

//       <View style={styles.progressCard}>
//         <Text style={styles.progressTitle}>
//           {nextReward ? nextReward.title : "Adventure Reward Box"}
//         </Text>
//         <Text style={styles.progressText}>
//           {nextReward
//             ? nextReward.description
//             : "You reached the highest eco reward available right now."}
//         </Text>
//         <View style={styles.progressTrack}>
//           <View
//             style={[
//               styles.progressFill,
//               { width: `${Math.max(progressRatio * 100, 8)}%` },
//             ]}
//           />
//         </View>
//         <Text style={styles.progressFootnote}>
//           {totalPoints} / {targetPoints} points
//         </Text>
//       </View>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Challenges On The Trail</Text>
//         <Text style={styles.sectionMeta}>Tap to mark complete</Text>
//       </View>

//       {challengeData.map((challenge) => {
//         const completed = completedIds.includes(challenge.id);

//         return (
//           <Pressable
//             key={challenge.id}
//             style={[
//               styles.challengeCard,
//               completed && styles.challengeCardCompleted,
//             ]}
//             onPress={() => toggleChallenge(challenge.id)}
//           >
//             <View style={styles.challengeTopRow}>
//               <View style={styles.challengeBadge}>
//                 <Text style={styles.challengeBadgeText}>+{challenge.points}</Text>
//               </View>
//               <Text style={styles.challengeDuration}>{challenge.duration}</Text>
//             </View>

//             <Text style={styles.challengeTitle}>{challenge.title}</Text>
//             <Text style={styles.challengeDescription}>
//               {challenge.description}
//             </Text>
//             <Text style={styles.challengeImpact}>{challenge.impact}</Text>

//             <View style={styles.challengeFooter}>
//               <Text
//                 style={[
//                   styles.challengeStatus,
//                   completed && styles.challengeStatusDone,
//                 ]}
//               >
//                 {completed ? "Completed" : "Mark as complete"}
//               </Text>
//             </View>
//           </Pressable>
//         );
//       })}

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Gift Milestones</Text>
//         <Text style={styles.sectionMeta}>Stay consistent to earn more</Text>
//       </View>

//       {rewardMilestones.map((reward) => {
//         const unlocked = totalPoints >= reward.pointsRequired;
//         const claimed = claimedRewardIds.includes(reward.id);

//         return (
//           <View
//             key={reward.id}
//             style={[
//               styles.rewardCard,
//               unlocked && styles.rewardCardUnlocked,
//             ]}
//           >
//             <View style={styles.rewardRow}>
//               <View>
//                 <Text style={styles.rewardTitle}>{reward.title}</Text>
//                 <Text style={styles.rewardDescription}>{reward.description}</Text>
//               </View>
//               <View style={styles.rewardPointsPill}>
//                 <Text style={styles.rewardPointsText}>
//                   {reward.pointsRequired} pts
//                 </Text>
//               </View>
//             </View>
//             <Text style={[styles.rewardStatus, unlocked && styles.rewardStatusUnlocked]}>
//               {claimed
//                 ? "Claimed"
//                 : unlocked
//                   ? "Ready to claim"
//                   : "Keep hiking to unlock"}
//             </Text>
//             <Pressable
//               style={[
//                 styles.claimButton,
//                 !unlocked && styles.claimButtonDisabled,
//                 claimed && styles.claimButtonClaimed,
//               ]}
//               onPress={() => claimReward(reward.id)}
//               disabled={!unlocked || claimed}
//             >
//               <Text
//                 style={[
//                   styles.claimButtonText,
//                   (!unlocked || claimed) && styles.claimButtonTextDisabled,
//                 ]}
//               >
//                 {claimed ? "Claimed" : unlocked ? "Claim Reward" : "Locked"}
//               </Text>
//             </Pressable>
//           </View>
//         );
//       })}
//     </ScrollView>
//   );
// }

// const createStyles = (COLORS: ThemeColors, isDark: boolean) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//     },
//     loaderWrap: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//       alignItems: "center",
//       justifyContent: "center",
//       padding: 24,
//     },
//     loaderText: {
//       marginTop: 12,
//       fontSize: 13,
//       color: COLORS.grayText,
//     },
//     content: {
//       paddingHorizontal: 20,
//       paddingTop: 18,
//       paddingBottom: 28,
//     },
//     heroCard: {
//       borderRadius: 28,
//       padding: 20,
//       backgroundColor: isDark ? "#182229" : "#edf6ef",
//     },
//     eyebrow: {
//       fontSize: 11,
//       fontWeight: "800",
//       letterSpacing: 1,
//       textTransform: "uppercase",
//       color: COLORS.darkGreen,
//     },
//     title: {
//       marginTop: 10,
//       fontSize: 24,
//       lineHeight: 30,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     subtitle: {
//       marginTop: 8,
//       fontSize: 13,
//       lineHeight: 20,
//       color: COLORS.grayText,
//     },
//     statsRow: {
//       flexDirection: "row",
//       gap: 12,
//       marginTop: 18,
//     },
//     statCard: {
//       flex: 1,
//       borderRadius: 18,
//       padding: 16,
//       backgroundColor: COLORS.white,
//     },
//     statValue: {
//       fontSize: 22,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     statLabel: {
//       marginTop: 4,
//       fontSize: 12,
//       color: COLORS.grayText,
//     },
//     sectionHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "flex-end",
//       gap: 10,
//       marginTop: 22,
//       marginBottom: 10,
//     },
//     sectionTitle: {
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     sectionMeta: {
//       fontSize: 11,
//       color: COLORS.grayText,
//     },
//     badgesRow: {
//       gap: 12,
//     },
//     badgeCard: {
//       borderRadius: 22,
//       padding: 18,
//       backgroundColor: COLORS.lightGray,
//       borderWidth: 1,
//       borderColor: "transparent",
//     },
//     badgeCardUnlocked: {
//       borderColor: COLORS.accent,
//     },
//     badgeIcon: {
//       width: 34,
//       height: 34,
//       borderRadius: 17,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: isDark ? COLORS.border : "#e3e3e3",
//     },
//     badgeIconUnlocked: {
//       backgroundColor: COLORS.accent,
//     },
//     badgeIconText: {
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     badgeTitle: {
//       marginTop: 12,
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     badgeDescription: {
//       marginTop: 6,
//       fontSize: 12,
//       lineHeight: 18,
//       color: COLORS.grayText,
//     },
//     badgeStatus: {
//       marginTop: 10,
//       fontSize: 12,
//       fontWeight: "700",
//       color: COLORS.grayText,
//     },
//     badgeStatusUnlocked: {
//       color: COLORS.accent,
//     },
//     progressCard: {
//       borderRadius: 22,
//       padding: 18,
//       backgroundColor: COLORS.lightGray,
//     },
//     progressTitle: {
//       fontSize: 17,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     progressText: {
//       marginTop: 6,
//       fontSize: 12,
//       lineHeight: 18,
//       color: COLORS.grayText,
//     },
//     progressTrack: {
//       marginTop: 14,
//       height: 10,
//       borderRadius: 999,
//       backgroundColor: isDark ? COLORS.border : "#d9e6db",
//       overflow: "hidden",
//     },
//     progressFill: {
//       height: "100%",
//       borderRadius: 999,
//       backgroundColor: COLORS.green,
//     },
//     progressFootnote: {
//       marginTop: 8,
//       fontSize: 12,
//       color: COLORS.grayText,
//     },
//     challengeCard: {
//       borderRadius: 22,
//       padding: 18,
//       backgroundColor: COLORS.lightGray,
//       marginBottom: 12,
//       borderWidth: 1,
//       borderColor: "transparent",
//     },
//     challengeCardCompleted: {
//       borderColor: COLORS.green,
//     },
//     challengeTopRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 12,
//     },
//     challengeBadge: {
//       paddingHorizontal: 10,
//       paddingVertical: 6,
//       borderRadius: 999,
//       backgroundColor: COLORS.green,
//     },
//     challengeBadgeText: {
//       fontSize: 11,
//       fontWeight: "800",
//       color: "#ffffff",
//     },
//     challengeDuration: {
//       fontSize: 11,
//       color: COLORS.grayText,
//     },
//     challengeTitle: {
//       fontSize: 17,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     challengeDescription: {
//       marginTop: 6,
//       fontSize: 13,
//       lineHeight: 19,
//       color: COLORS.grayText,
//     },
//     challengeImpact: {
//       marginTop: 10,
//       fontSize: 12,
//       fontWeight: "600",
//       color: COLORS.darkGreen,
//     },
//     challengeFooter: {
//       marginTop: 14,
//       flexDirection: "row",
//       justifyContent: "flex-start",
//     },
//     challengeStatus: {
//       fontSize: 12,
//       fontWeight: "700",
//       color: COLORS.black,
//     },
//     challengeStatusDone: {
//       color: COLORS.green,
//     },
//     rewardCard: {
//       borderRadius: 22,
//       padding: 18,
//       backgroundColor: COLORS.lightGray,
//       marginBottom: 12,
//       borderWidth: 1,
//       borderColor: "transparent",
//     },
//     rewardCardUnlocked: {
//       borderColor: COLORS.accent,
//     },
//     rewardRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       gap: 12,
//     },
//     rewardTitle: {
//       flexShrink: 1,
//       fontSize: 16,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     rewardDescription: {
//       marginTop: 6,
//       fontSize: 12,
//       lineHeight: 18,
//       color: COLORS.grayText,
//       maxWidth: 220,
//     },
//     rewardPointsPill: {
//       alignSelf: "flex-start",
//       paddingHorizontal: 10,
//       paddingVertical: 7,
//       borderRadius: 999,
//       backgroundColor: isDark ? COLORS.border : "#fff4d2",
//     },
//     rewardPointsText: {
//       fontSize: 11,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     rewardStatus: {
//       marginTop: 12,
//       fontSize: 12,
//       fontWeight: "700",
//       color: COLORS.grayText,
//     },
//     rewardStatusUnlocked: {
//       color: COLORS.accent,
//     },
//     claimButton: {
//       marginTop: 14,
//       borderRadius: 16,
//       paddingVertical: 12,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: COLORS.green,
//     },
//     claimButtonDisabled: {
//       backgroundColor: isDark ? COLORS.border : "#d8d8d8",
//     },
//     claimButtonClaimed: {
//       backgroundColor: COLORS.accent,
//     },
//     claimButtonText: {
//       fontSize: 13,
//       fontWeight: "800",
//       color: "#ffffff",
//     },
//     claimButtonTextDisabled: {
//       color: isDark ? COLORS.grayText : "#6f6f6f",
//     },
//   });

