// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Pressable,
//   ActivityIndicator,
// } from "react-native";
// import { getOfflineMaps } from "../services/offlineMap";
// import type { Trail } from "../data/trails";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../app/navigationTypes";

// type Props = NativeStackScreenProps<RootStackParamList, "OfflineMaps">;

// export default function OfflineMapsScreen({ navigation }: Props) {
//   const [trails, setTrails] = useState<Trail[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const maps = await getOfflineMaps();

//         const list = Object.values(maps).map((item) => item.trail);
//         setTrails(list);
//       } catch (e) {
//         console.log(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//         <Text>Loading saved trails...</Text>
//       </View>
//     );
//   }

//   if (trails.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Text>No offline maps yet.</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={trails}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={styles.list}
//       renderItem={({ item }) => (
//         <Pressable
//           style={styles.card}
//           onPress={() =>
//             navigation.navigate("OfflineMap", {
//               trail: item,
//               navigationMode: true,
//             })
//           }
//         >
//           <Text style={styles.title}>{item.name}</Text>
//           <Text style={styles.subtitle}>{item.region}</Text>
//         </Pressable>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   list: {
//     padding: 16,
//     gap: 12,
//   },
//   card: {
//     backgroundColor: "#eee",
//     padding: 16,
//     borderRadius: 12,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   subtitle: {
//     fontSize: 12,
//     color: "#666",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });`

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getOfflineMaps } from "../services/offlineMap";
import { COLORS } from "../theme/colors";
import type { Trail } from "../data/trails";
import type { RootStackParamList } from "../app/navigationTypes";

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function OfflineMapsScreen() {
  const navigation = useNavigation<RootNav>();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const maps = await getOfflineMaps();
        const list = Object.values(maps)
          .map((item) => item?.trail)
          .filter((trail): trail is Trail => !!trail && !!trail.id);

        setTrails(list);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading offline maps...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Offline Maps</Text>
        <Text style={styles.screenSubtitle}>
          Downloaded trails and maps you can use without mobile data.
        </Text>
      </View>

      {trails.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No offline maps yet</Text>
          <Text style={styles.emptyText}>
            Save a trail while online and it will appear here for offline
            navigation.
          </Text>
        </View>
      ) : (
        <FlatList
          data={trails}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("OfflineMap", {
                  trail: item,
                  navigationMode: true,
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Offline</Text>
                </View>
              </View>
              <Text style={styles.subtitle}>{item.region}</Text>
              <View style={styles.labelRow}>
                <View style={styles.labelChip}>
                  <Text style={styles.labelChipText}>Saved map</Text>
                </View>
                <View style={styles.labelChip}>
                  <Text style={styles.labelChipText}>Route preview</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  header: {
    marginBottom: 18,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.grayText,
    lineHeight: 20,
  },
  list: {
    paddingBottom: 20,
    gap: 14,
  },
  card: {
    backgroundColor: "#F6F8FB",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8EDF3",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.grayText,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#DDEEF7",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1C5DA8",
  },
  labelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  labelChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EDF3",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
  labelChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.black,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.grayText,
  },
  emptyCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FAFBF9",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E8EDF3",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.grayText,
    textAlign: "center",
    lineHeight: 20,
  },
});