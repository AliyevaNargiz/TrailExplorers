// import React from "react";
// import {
//   FlatList,
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../app/navigationTypes";
// // import { guides, type Guide } from "../data/guides";
// import { getGuides, Guide } from "../services/guideService";
// import { type ThemeColors, useAppTheme } from "../theme/themeContext";

// type Props = NativeStackScreenProps<RootStackParamList, "Guides">;

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((part) => part[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// export default function GuidesScreen({ navigation }: Props) {
//   const { colors: COLORS } = useAppTheme();
//   const styles = createStyles(COLORS);

//   const renderGuide = ({ item }: { item: Guide }) => (
//     <Pressable
//       style={styles.card}
//       onPress={() => navigation.navigate("GuideProfile", { guideId: item.id })}
//     >
//       <View style={styles.avatar}>
//         <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
//       </View>

//       <View style={styles.cardContent}>
//         <Text style={styles.name}>{item.name}</Text>
//         <Text style={styles.role}>{item.title}</Text>
//         <Text style={styles.meta}>
//           {item.agency} • {item.region}
//         </Text>
//         <Text style={styles.bio} numberOfLines={2}>
//           {item.bio}
//         </Text>

//         <View style={styles.statsRow}>
//           <View style={styles.statPill}>
//             <Text style={styles.statValue}>{item.rating.toFixed(1)}</Text>
//             <Text style={styles.statLabel}>Rating</Text>
//           </View>
//           <View style={styles.statPill}>
//             <Text style={styles.statValue}>{item.yearsExperience}</Text>
//             <Text style={styles.statLabel}>Years</Text>
//           </View>
//           <View style={styles.statPill}>
//             <Text style={styles.statValue}>{item.hikesLed}</Text>
//             <Text style={styles.statLabel}>Hikes</Text>
//           </View>
//         </View>
//       </View>
//     </Pressable>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <View style={styles.topBar}>
//           <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
//             <Text style={styles.backText}>←</Text>
//           </Pressable>
//           <Text style={styles.headerTitle}>Professional Guides</Text>
//           <View style={styles.topBarSpacer} />
//         </View>

//         <Text style={styles.subtitle}>
//           Browse and connect with our professional guides to make your next hike safer and better.
//         </Text>

//         <FlatList
//           data={guides}
//           keyExtractor={(item) => item.id}
//           renderItem={renderGuide}
//           contentContainerStyle={styles.listContent}
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const createStyles = (COLORS: ThemeColors) =>
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//     },
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//       paddingHorizontal: 20,
//       paddingTop: 10,
//     },
//     topBar: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: 12,
//     },
//     backBtn: {
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       borderWidth: 1,
//       borderColor: COLORS.border,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: COLORS.white,
//     },
//     backText: {
//       fontSize: 18,
//       fontWeight: "700",
//       color: COLORS.black,
//     },
//     headerTitle: {
//       fontSize: 18,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     topBarSpacer: {
//       width: 36,
//     },
//     subtitle: {
//       fontSize: 13,
//       lineHeight: 19,
//       color: COLORS.grayText,
//       marginBottom: 18,
//     },
//     listContent: {
//       paddingBottom: 28,
//     },
//     separator: {
//       height: 12,
//     },
//     card: {
//       flexDirection: "row",
//       gap: 14,
//       backgroundColor: COLORS.lightGray,
//       borderRadius: 24,
//       padding: 16,
//       borderWidth: 1,
//       borderColor: COLORS.softBorder,
//     },
//     avatar: {
//       width: 62,
//       height: 62,
//       borderRadius: 31,
//       backgroundColor: COLORS.darkGreen,
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     avatarText: {
//       color: COLORS.white,
//       fontSize: 20,
//       fontWeight: "800",
//     },
//     cardContent: {
//       flex: 1,
//       gap: 5,
//     },
//     name: {
//       fontSize: 17,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     role: {
//       fontSize: 13,
//       fontWeight: "700",
//       color: COLORS.darkGreen,
//     },
//     meta: {
//       fontSize: 12,
//       color: COLORS.grayText,
//     },
//     bio: {
//       marginTop: 2,
//       fontSize: 13,
//       lineHeight: 19,
//       color: COLORS.black,
//     },
//     statsRow: {
//       flexDirection: "row",
//       gap: 8,
//       marginTop: 8,
//     },
//     statPill: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//       borderRadius: 14,
//       paddingHorizontal: 10,
//       paddingVertical: 10,
//       gap: 2,
//     },
//     statValue: {
//       fontSize: 14,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     statLabel: {
//       fontSize: 10,
//       color: COLORS.grayText,
//     },
//   });
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
// import { getGuides, type Guide } from "../services/guideService";
import { getGuides, type Guide } from "../services/guideService";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";

type Props = NativeStackScreenProps<RootStackParamList, "Guides">;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function GuidesScreen({ navigation }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        setLoading(true);
        const data = await getGuides();
        setGuides(data);
      } catch (error) {
        console.log("Failed to load guides:", error);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  const renderGuide = ({ item }: { item: Guide }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate("GuideProfile", { guideId: item.id })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(item.fullName)}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.role}>{item.agency}</Text>
        <Text style={styles.meta}>{item.region}</Text>

        <Text style={styles.bio} numberOfLines={2}>
          {item.bio}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statValue}>{item.experienceYears}</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Professional Guides</Text>

          <View style={styles.topBarSpacer} />
        </View>

        <Text style={styles.subtitle}>
          Browse and connect with professional guides to make your next hike
          safer and better.
        </Text>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={guides}
            keyExtractor={(item) => item.id}
            renderItem={renderGuide}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No guides found.</Text>
            }
          />
        )}
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
      paddingTop: 10,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
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
    subtitle: {
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.grayText,
      marginBottom: 18,
    },
    loaderWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    listContent: {
      paddingBottom: 28,
    },
    separator: {
      height: 12,
    },
    card: {
      flexDirection: "row",
      gap: 14,
      backgroundColor: COLORS.lightGray,
      borderRadius: 24,
      padding: 16,
      borderWidth: 1,
      borderColor: COLORS.softBorder,
    },
    avatar: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: COLORS.darkGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: COLORS.white,
      fontSize: 20,
      fontWeight: "800",
    },
    cardContent: {
      flex: 1,
      gap: 5,
    },
    name: {
      fontSize: 17,
      fontWeight: "800",
      color: COLORS.black,
    },
    role: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.darkGreen,
    },
    meta: {
      fontSize: 12,
      color: COLORS.grayText,
    },
    bio: {
      marginTop: 2,
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.black,
    },
    statsRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8,
    },
    statPill: {
      flex: 1,
      backgroundColor: COLORS.white,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 10,
      gap: 2,
    },
    statValue: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.black,
    },
    statLabel: {
      fontSize: 10,
      color: COLORS.grayText,
    },
    emptyText: {
      color: COLORS.grayText,
      fontSize: 14,
      textAlign: "center",
      marginTop: 30,
    },
  });