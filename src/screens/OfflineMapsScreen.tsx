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
        // const maps = await getOfflineMaps();
        // const list = Object.values(maps).map((item) => item.trail);
        // setTrails(list);
        const maps = await getOfflineMaps();
        console.log("OFFLINE MAPS RAW:", maps);


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
        <Text>Loading saved trails...</Text>
      </View>
    );
  }

  if (trails.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No offline maps yet.</Text>
      </View>
    );
  }

  return (
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
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.region}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});