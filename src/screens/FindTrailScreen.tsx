// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Pressable,
//   Image,
//   ActivityIndicator,
//   Alert,
// } from "react-native";

// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// import { COLORS } from "../theme/colors";
// import type { Trail } from "../data/trails";
// import { fetchTrails } from "../services/trailsService";
// import { RootStackParamList } from "../app/navigationTypes";
// import { seedTrailsToFirestore } from "../utils/seedTrails";

// type StackNav = NativeStackNavigationProp<RootStackParamList>;

// const filters = ["Location", "Duration", "Difficulty level"] as const;

// const trailImages: Record<string, any> = {
//   qaranohur: require("../../assets/qaranohur.png"),
//   // goygol: require("../../assets/goygol.png"),
//   lahic: require("../../assets/shamakhi.png"),
//   tufandag: require("../../assets/gurgur.png"),
// };

// export default function FindTrailScreen() {
//   const navigation = useNavigation<StackNav>();

//   const [trails, setTrails] = useState<Trail[]>([]);
//   const [loading, setLoading] = useState(true);

//   const onSeedPress = async () => {
//   try {
//     Alert.alert("Seeding", "Starting seed...");
//     await seedTrailsToFirestore();
//     Alert.alert("Done", "Seed finished. Reloading list...");
//     await load();
//   } catch (e: any) {
//     console.log("SEED ERROR:", e);
//     Alert.alert("Seed failed", e?.message ?? "Unknown error");
//   }
// };

// <Pressable
//   onPress={onSeedPress}
//   style={{ marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: "black" }}
// >
//   <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>
//     SEED TRAILS
//   </Text>
// </Pressable>

// useEffect(() => {
//   (async () => {
//     await seedTrailsToFirestore();   // RUN ONLY ONCE
//     await load();
//   })();
// }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>FIND YOUR TRAIL</Text>

//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator size="large" />
//         </View>
//       ) : (
//         <FlatList
//           data={trails}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.list}
//           renderItem={({ item }) => (
//             <Pressable
//               style={styles.card}
//               onPress={() =>
//                 navigation.navigate("TrailDetail", { id: item.id })
//               }
//             >
//               <Image
//                 source={
//                   trailImages[item.id] ??
//                   require("../../assets/qaranohur.png")
//                 }
//                 style={styles.cardImage}
//               />

//               <View style={styles.cardBody}>
//                 <Text style={styles.cardTitle}>{item.name}</Text>
//                 <Text style={styles.cardLocation}>{item.region}</Text>

//                 <View style={styles.metaRow}>
//                   <Text style={styles.metaText}>
//                     ⏱ {item.durationHours} h
//                   </Text>
//                   <Text style={styles.metaText}>
//                     📍 {item.distanceKm} km
//                   </Text>
//                   <Text style={styles.metaText}>
//                     ⛰ {item.difficulty}
//                   </Text>
//                 </View>
//               </View>
//             </Pressable>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     padding: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "800",
//     marginBottom: 14,
//   },
//   list: {
//     gap: 12,
//   },
//   card: {
//     flexDirection: "row",
//     gap: 12,
//     backgroundColor: COLORS.lightGray,
//     borderRadius: 16,
//     padding: 12,
//   },
//   cardImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 12,
//   },
//   cardBody: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   cardTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   cardLocation: {
//     fontSize: 12,
//     color: COLORS.grayText,
//     marginTop: 4,
//   },
//   metaRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 6,
//   },
//   metaText: {
//     fontSize: 11,
//     color: COLORS.grayText,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// function load() {
//   throw new Error("Function not implemented.");
// }


// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Pressable,
//   Image,
//   ActivityIndicator,
//   Alert,
// } from "react-native";

// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// import { COLORS } from "../theme/colors";
// import type { Trail } from "../data/trails";
// import { fetchTrails } from "../services/trailsService";
// import { RootStackParamList } from "../app/navigationTypes";
// import { seedTrailsToFirestore } from "../utils/seedTrails";

// type StackNav = NativeStackNavigationProp<RootStackParamList>;

// const filters = ["Location", "Duration", "Difficulty level"] as const;

// const trailImages: Record<string, any> = {
//   qaranohur: require("../../assets/qaranohur.png"),
//   // goygol: require("../../assets/goygol.png"),
//   lahic: require("../../assets/shamakhi.png"),
//   tufandag: require("../../assets/gurgur.png"),
// };

// export default function FindTrailScreen() {
//   const navigation = useNavigation<StackNav>();

//   const [trails, setTrails] = useState<Trail[]>([]);
//   const [loading, setLoading] = useState(true);

//   const onSeedPress = async () => {
//   try {
//     Alert.alert("Seeding", "Starting seed...");
//     await seedTrailsToFirestore();
//     Alert.alert("Done", "Seed finished. Reloading list...");
//     await load();
//   } catch (e: any) {
//     console.log("SEED ERROR:", e);
//     Alert.alert("Seed failed", e?.message ?? "Unknown error");
//   }
// };

// <Pressable
//   onPress={onSeedPress}
//   style={{ marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: "black" }}
// >
//   <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>
//     SEED TRAILS
//   </Text>
// </Pressable>

// useEffect(() => {
//   (async () => {
//     await seedTrailsToFirestore();   // RUN ONLY ONCE
//     await load();
//   })();
// }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>FIND YOUR TRAIL</Text>

//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator size="large" />
//         </View>
//       ) : (
//         <FlatList
//           data={trails}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.list}
//           renderItem={({ item }) => (
//             <Pressable
//               style={styles.card}
//               onPress={() =>
//                 navigation.navigate("TrailDetail", { id: item.id })
//               }
//             >
//               <Image
//                 source={
//                   trailImages[item.id] ??
//                   require("../../assets/qaranohur.png")
//                 }
//                 style={styles.cardImage}
//               />

//               <View style={styles.cardBody}>
//                 <Text style={styles.cardTitle}>{item.name}</Text>
//                 <Text style={styles.cardLocation}>{item.region}</Text>

//                 <View style={styles.metaRow}>
//                   <Text style={styles.metaText}>
//                     ⏱ {item.durationHours} h
//                   </Text>
//                   <Text style={styles.metaText}>
//                     📍 {item.distanceKm} km
//                   </Text>
//                   <Text style={styles.metaText}>
//                     ⛰ {item.difficulty}
//                   </Text>
//                 </View>
//               </View>
//             </Pressable>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     padding: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "800",
//     marginBottom: 14,
//   },
//   list: {
//     gap: 12,
//   },
//   card: {
//     flexDirection: "row",
//     gap: 12,
//     backgroundColor: COLORS.lightGray,
//     borderRadius: 16,
//     padding: 12,
//   },
//   cardImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 12,
//   },
//   cardBody: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   cardTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   cardLocation: {
//     fontSize: 12,
//     color: COLORS.grayText,
//     marginTop: 4,
//   },
//   metaRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 6,
//   },
//   metaText: {
//     fontSize: 11,
//     color: COLORS.grayText,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// function load() {
//   throw new Error("Function not implemented.");
// }


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { type ThemeColors, useAppTheme } from "../theme/colors";
import type { Trail } from "../data/trails";
import { fetchTrails } from "../services/trailsService";
import { RootStackParamList } from "../app/navigationTypes";
import { seedTrailsToFirestore } from "../utils/seedTrails";

type StackNav = NativeStackNavigationProp<RootStackParamList>;

const trailImages: Record<string, any> = {
  qaranohur: require("../../assets/qaranohur.png"),
  lahic: require("../../assets/shamakhi.png"),
  tufandag: require("../../assets/gurgur.png"),
};

export default function FindTrailScreen() {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);
  const navigation = useNavigation<StackNav>();

  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchTrails();
      setTrails(data);
    } catch (e: any) {
      console.log("LOAD ERROR:", e);
      Alert.alert("Error", e?.message ?? "Failed to load trails");
    } finally {
      setLoading(false);
    }
  };

  const onSeedPress = async () => {
    try {
      Alert.alert("Seeding", "Starting seed...");
      await seedTrailsToFirestore();
      Alert.alert("Done", "Seed finished. Reloading list...");
      await load();
    } catch (e: any) {
      console.log("SEED ERROR:", e);
      Alert.alert("Seed failed", e?.message ?? "Unknown error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>FIND YOUR TRAIL</Text>

        <View style={styles.topActions}>
          <Pressable
            style={styles.addButton}
            onPress={() => navigation.navigate("AddNewTrailBasic")}
          >
            <Text style={styles.addButtonText}>+ Add New Trail</Text>
          </Pressable>

          <Pressable style={styles.seedButton} onPress={onSeedPress}>
            <Text style={styles.seedButtonText}>Seed Trails</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={trails}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => navigation.navigate("TrailDetail", { id: item.id })}
              >
                <Image
                  source={
                    trailImages[item.id] ?? require("../../assets/qaranohur.png")
                  }
                  style={styles.cardImage}
                />

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardLocation}>{item.region}</Text>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>⏱ {item.durationHours} h</Text>
                    <Text style={styles.metaText}>📍 {item.distanceKm} km</Text>
                    <Text style={styles.metaText}>⛰ {item.difficulty}</Text>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No trails found yet.</Text>
              </View>
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
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
    color: COLORS.black,
  },
  topActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  addButton: {
    flex: 1,
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
  seedButton: {
    backgroundColor: COLORS.black,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  seedButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
  list: {
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 12,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardBody: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.black,
  },
  cardLocation: {
    fontSize: 12,
    color: COLORS.grayText,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.grayText,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrap: {
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.grayText,
  },
  });
