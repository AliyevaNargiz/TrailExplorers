import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainTabParamList, RootStackParamList } from "../app/navigationTypes";
import {
  fetchCommunityProfiles,
  type PublicUserProfile,
} from "../services/trailSubmissionService";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Friends">,
  NativeStackScreenProps<RootStackParamList>
>;

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

export default function FriendsScreen({ navigation }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);
  const [profiles, setProfiles] = useState<PublicUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchCommunityProfiles();
        setProfiles(data);
      } catch (loadError) {
        console.log("Failed to load community profiles:", loadError);
        setProfiles([]);
        setError("We couldn't load community profiles right now.");
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  const renderItem = ({ item }: { item: PublicUserProfile }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate("FriendProfile", {
          userId: item.uid,
          fallbackName: item.name,
          fallbackEmail: item.email,
          fallbackPhotoURL: item.photoURL,
          fallbackHomeRegion: item.homeRegion,
          fallbackBio: item.bio,
        })
      }
    >
      <View style={styles.cardHeader}>
        {item.photoURL ? (
          <Image source={{ uri: item.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>{getInitials(item.name)}</Text>
          </View>
        )}

        <View style={styles.cardTextWrap}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name || "Trail Explorer"}
          </Text>
          <Text style={styles.region} numberOfLines={1}>
            {item.homeRegion || "Exploring new regions"}
          </Text>
        </View>

        <View style={styles.chevronWrap}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>
        {item.bio || "View this hiker's profile and trail recommendations."}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{item.submissionsCount}</Text>
          <Text style={styles.statLabel}>Submissions</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{item.approvedSubmissionsCount}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" />
          <Text style={styles.stateText}>Loading hikers and their trails...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <Text style={styles.subtitle}>
            Browse other hikers and open their recommended trail submissions.
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <FlatList
          data={profiles}
          keyExtractor={(item) => item.uid}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No public hikers yet</Text>
              <Text style={styles.emptyText}>
                Profiles with trail submissions will appear here for the community
                to explore.
              </Text>
            </View>
          }
        />
      </View>
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
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    header: {
      marginBottom: 16,
      gap: 6,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: COLORS.black,
    },
    subtitle: {
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.grayText,
    },
    errorText: {
      marginBottom: 12,
      color: "#b04848",
      fontSize: 12,
    },
    listContent: {
      paddingBottom: 28,
    },
    separator: {
      height: 12,
    },
    card: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 24,
      padding: 16,
      borderWidth: 1,
      borderColor: COLORS.softBorder,
      gap: 14,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    avatar: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: COLORS.softBorder,
    },
    avatarFallback: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: COLORS.darkGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarFallbackText: {
      color: COLORS.white,
      fontSize: 20,
      fontWeight: "800",
    },
    cardTextWrap: {
      flex: 1,
      gap: 4,
    },
    name: {
      fontSize: 17,
      fontWeight: "800",
      color: COLORS.black,
    },
    region: {
      fontSize: 12,
      color: COLORS.grayText,
    },
    chevronWrap: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: COLORS.white,
      alignItems: "center",
      justifyContent: "center",
    },
    chevron: {
      fontSize: 22,
      lineHeight: 22,
      color: COLORS.black,
    },
    bio: {
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.black,
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
    },
    statPill: {
      flex: 1,
      backgroundColor: COLORS.white,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 12,
      gap: 3,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "800",
      color: COLORS.black,
    },
    statLabel: {
      fontSize: 11,
      color: COLORS.grayText,
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
    emptyWrap: {
      alignItems: "center",
      paddingTop: 72,
      paddingHorizontal: 24,
      gap: 8,
    },
    emptyTitle: {
      fontSize: 18,
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
  });
