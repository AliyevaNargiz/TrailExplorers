// import React, { useCallback, useEffect, useState } from "react";
// import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert, ScrollView  } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../app/navigationTypes";
// import { COLORS } from "../theme/colors";
// import type { Trail } from "../data/trails";
// import { fetchTrailById } from "../services/trailsService";
// import TrailMap from "../screens/TrailMap";
// import {
//   isTrailDownloaded,
//   saveOfflineMap,
//   removeOfflineMap,
// } from "../services/offlineMaps";

// type Props = NativeStackScreenProps<RootStackParamList, "TrailDetail">;

// export default function TrailDetailScreen({ navigation, route }: Props) {
//   const trailId = route.params?.id;
//   // console.log("✅ TrailDetail received id:", trailId);
//   console.log("Opening trail id:", trailId);
//   Alert.alert("Trail ID", String(trailId));
//   const [trail, setTrail] = useState<Trail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [offlineDownloaded, setOfflineDownloaded] = useState(false);
//   const [offlineLoading, setOfflineLoading] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       if (!trailId) {
//         setLoading(false);
//         Alert.alert("Error", "Missing trail id");
//         return;
//       }

//       try {
//         setLoading(true);
//         const t = await fetchTrailById(trailId);
//         // if (!t) {
//         //   Alert.alert("Not found", "This trail does not exist in the database.");
//         //   navigation.goBack();
//         //   return;
//         // }
//         if (!t) {
//   setTrail(null);
//   setLoading(false);
//   return;
// }
//         setTrail(t);
//       } catch (e: any) {
//         console.log(e);
//         Alert.alert("Error", e?.message ?? "Failed to load trail");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [trailId]);

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
//         <ActivityIndicator size="large" />
//         <Text style={styles.loadingText}>Loading trail...</Text>
//       </View>
//     );
//   }

//   if (!trail) {
//     return (
//       <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
//         <Text>Trail not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.topBar}>
//         <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Image source={require("../../assets/menu.png")} style={styles.iconImage} />
//         </Pressable>

//         <View style={styles.topIcons}>
//           <Image source={require("../../assets/icon-circle.png")} style={styles.iconImage} />
//           <Image source={require("../../assets/icon-plus.png")} style={styles.iconImage} />
//           <Image source={require("../../assets/icon-search.png")} style={styles.iconImage} />
//         </View>
//       </View>

//       <View style={styles.header}>
//         <Text style={styles.title}>{trail.name}</Text>
//         <View style={styles.headerMeta}>
//           <Text style={styles.pin}>●</Text>
//           <Text style={styles.region}>{trail.region}</Text>
//           <Text style={styles.star}>★</Text>
//           <Text style={styles.rating}>4.3</Text>
//           <Text style={styles.heart}>❤</Text>
//           <Text style={styles.likes}>52</Text>
//         </View>
//       </View>

//       <View style={styles.galleryRow}>
//         <Image source={require("../../assets/qaranohur.png")} style={styles.galleryLarge} />
//         <View style={styles.galleryCol}>
//           <Image source={require("../../assets/shamakhi.png")} style={styles.gallerySmall} />
//           <Image source={require("../../assets/gurgur.png")} style={styles.gallerySmall} />
//         </View>
//       </View>

//       <View style={styles.actionsRow}>
//         {["♡", "⤴", "✎", "🔖"].map((item) => (
//           <View key={item} style={styles.actionIcon}>
//             <Text style={styles.actionText}>{item}</Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.metricsRow}>
//         <Text style={styles.metricPill}>⏱ {trail.durationHours} hours of hike</Text>
//         <Text style={styles.metricPill}>📍 {trail.distanceKm} km</Text>
//         <Text style={styles.metricPill}>⛰ {trail.difficulty}</Text>
//         <Text style={styles.metricPill}>🗺 Offline map available</Text>
//       </View>

//       <Text style={styles.sectionTitle}>Overview</Text>
//       <Text style={styles.description}>{trail.description}</Text>

//       <Text style={styles.sectionTitle}>Reviews by other travelers</Text>
//       <View style={styles.reviewRow}>
//         {[
//           { name: "Harry", image: require("../../assets/harry.png") },
//           { name: "Liana", image: require("../../assets/liana.png") },
//           { name: "Agne", image: require("../../assets/agne.png") },
//         ].map((review) => (
//           <View key={review.name} style={styles.reviewCard}>
//             <Image source={review.image} style={styles.reviewAvatar} />
//             <Text style={styles.reviewName}>{review.name}</Text>
//             <Text style={styles.reviewText}>“Some guidance or short feedback.”</Text>
//           </View>
//         ))}
//       </View>

//       <Text style={styles.sectionTitle}>Trail Map</Text>
//       {/* <Image source={require("../../assets/map.png")} style={styles.mapImage} /> */}
//          {trail.route?.length > 0 ? (
//         <TrailMap trail={trail} />
//       ) : (
//         <View style={styles.mapFallback}>
//           <Text style={styles.mapFallbackText}>No map data available for this trail.</Text>
//         </View>
//       )}

//       <View style={styles.ctaRow}>
//         <Pressable style={[styles.ctaButton, styles.ctaLight]}>
//           <Text style={styles.ctaDarkText}>Download</Text>
//         </Pressable>
//         <Pressable style={[styles.ctaButton, styles.ctaDark]}>
//           <Text style={styles.ctaLightText}>Navigate</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }
// // 

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   content: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   center: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//   },
//   topBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   backButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   topIcons: {
//     flexDirection: "row",
//     gap: 10,
//   },
//   iconImage: {
//     width: 22,
//     height: 22,
//     resizeMode: "contain",
//   },
//   header: {
//     alignItems: "center",
//     marginTop: 14,
//     gap: 6,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: COLORS.black,
//   },
//   headerMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   pin: {
//     color: "#e34949",
//     fontSize: 10,
//   },
//   region: {
//     color: COLORS.grayText,
//     fontSize: 11,
//   },
//   star: {
//     color: COLORS.accent,
//     fontSize: 10,
//   },
//   rating: {
//     fontSize: 10,
//   },
//   heart: {
//     color: "#e34949",
//     fontSize: 10,
//   },
//   likes: {
//     fontSize: 10,
//   },
//   galleryRow: {
//     marginTop: 16,
//     flexDirection: "row",
//     gap: 8,
//   },
//   galleryLarge: {
//     width: 170,
//     height: 140,
//     borderRadius: 16,
//   },
//   galleryCol: {
//     gap: 8,
//   },
//   gallerySmall: {
//     width: 90,
//     height: 66,
//     borderRadius: 12,
//   },
//   actionsRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 10,
//     marginTop: 8,
//   },
//   actionIcon: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   actionText: {
//     fontSize: 10,
//   },
//   metricsRow: {
//     marginTop: 12,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//   },
//   metricPill: {
//     fontSize: 9,
//     color: COLORS.grayText,
//   },
//   sectionTitle: {
//     marginTop: 16,
//     fontSize: 13,
//     fontWeight: "700",
//     color: COLORS.black,
//   },
//   description: {
//     marginTop: 8,
//     color: COLORS.grayText,
//     fontSize: 11,
//     lineHeight: 16,
//   },
//   reviewRow: {
//     marginTop: 10,
//     flexDirection: "row",
//     gap: 10,
//   },
//   reviewCard: {
//     width: 92,
//     backgroundColor: COLORS.lightGray,
//     borderRadius: 14,
//     padding: 8,
//     gap: 6,
//   },
//   reviewAvatar: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//   },
//   reviewName: {
//     fontSize: 10,
//     fontWeight: "700",
//   },
//   reviewText: {
//     fontSize: 8,
//     color: COLORS.grayText,
//     lineHeight: 11,
//   },
//   mapFallback: {
//     marginTop: 10,
//     height: 120,
//     borderRadius: 12,
//     backgroundColor: COLORS.lightGray,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 16,
//   },
//   mapFallbackText: {
//     color: COLORS.grayText,
//     fontSize: 12,
//     textAlign: "center",
//   },
//   ctaRow: {
//     marginTop: 18,
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 16,
//   },
//   ctaButton: {
//     height: 40,
//     minWidth: 110,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   ctaLight: {
//     backgroundColor: "#c9d389",
//   },
//   ctaDark: {
//     backgroundColor: COLORS.green,
//   },
//   ctaDarkText: {
//     fontSize: 12,
//     color: COLORS.black,
//     fontWeight: "600",
//   },
//   ctaLightText: {
//     fontSize: 12,
//     color: COLORS.white,
//     fontWeight: "600",
//   },
// });

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";
import type { Trail } from "../data/trails";
import { fetchTrailById } from "../services/trailsService";
import * as Location from "expo-location";
import TrailMap, {
  centerMapOnLocation,
  type MapRefType,
} from "../screens/TrailMap";
import {
  isTrailDownloaded,
  saveOfflineMap,
  removeOfflineMap,
} from "../services/offlineMap";
import { Platform } from "react-native";
import * as Linking from "expo-linking";

type Props = NativeStackScreenProps<RootStackParamList, "TrailDetail">;

export default function TrailDetailScreen({ navigation, route }: Props) {
  const trailId = route.params?.id;
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [offlineDownloaded, setOfflineDownloaded] = useState(false);
  const [offlineLoading, setOfflineLoading] = useState(false);
  const [mapRef, setMapRef] = useState<MapRefType | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!trailId) {
        setLoading(false);
        Alert.alert("Error", "Missing trail id");
        return;
      }

      try {
        setLoading(true);
        const t = await fetchTrailById(trailId);

        if (!t) {
          setTrail(null);
          setLoading(false);
          return;
        }

        setTrail(t);
      } catch (e: any) {
        console.log(e);
        Alert.alert("Error", e?.message ?? "Failed to load trail");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [trailId]);

  useEffect(() => {
    const loadOfflineStatus = async () => {
      if (!trail?.id) return;

      try {
        const downloaded = await isTrailDownloaded(trail.id);
        setOfflineDownloaded(downloaded);
      } catch (e) {
        console.log("Failed to read offline map status", e);
      }
    };

    loadOfflineStatus();
  }, [trail]);

  const handleDownloadOffline = useCallback(async () => {
    if (!trail) return;

    try {
      setOfflineLoading(true);
      await saveOfflineMap(trail.id);
      setOfflineDownloaded(true);
      Alert.alert("Saved", "Offline map saved for this trail.");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to save offline map.");
    } finally {
      setOfflineLoading(false);
    }
  }, [trail]);

  const handleRemoveOffline = useCallback(async () => {
    if (!trail) return;

    try {
      setOfflineLoading(true);
      await removeOfflineMap(trail.id);
      setOfflineDownloaded(false);
      Alert.alert("Removed", "Offline map removed.");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to remove offline map.");
    } finally {
      setOfflineLoading(false);
    }
  }, [trail]);

const handleNavigate = useCallback(() => {
  if (!trail) return;

  if (!offlineDownloaded) {
    Alert.alert(
      "Offline map missing",
      "Please download the offline map first."
    );
    return;
  }

  navigation.navigate("OfflineMap", {
    trail,
    navigationMode: true,
  });
}, [trail, offlineDownloaded, navigation]);
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading trail...</Text>
      </View>
    );
  }

  if (!trail) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Trail not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require("../../assets/menu.png")} style={styles.iconImage} />
        </Pressable>

        <View style={styles.topIcons}>
          <Image source={require("../../assets/icon-circle.png")} style={styles.iconImage} />
          <Image source={require("../../assets/icon-plus.png")} style={styles.iconImage} />
          <Image source={require("../../assets/icon-search.png")} style={styles.iconImage} />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{trail.name}</Text>
        <View style={styles.headerMeta}>
          <Text style={styles.pin}>●</Text>
          <Text style={styles.region}>{trail.region}</Text>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>4.3</Text>
          <Text style={styles.heart}>❤</Text>
          <Text style={styles.likes}>52</Text>
        </View>
      </View>

      <View style={styles.galleryRow}>
        <Image source={require("../../assets/qaranohur.png")} style={styles.galleryLarge} />
        <View style={styles.galleryCol}>
          <Image source={require("../../assets/shamakhi.png")} style={styles.gallerySmall} />
          <Image source={require("../../assets/gurgur.png")} style={styles.gallerySmall} />
        </View>
      </View>

      <View style={styles.actionsRow}>
        {["♡", "⤴", "✎", "🔖"].map((item) => (
          <View key={item} style={styles.actionIcon}>
            <Text style={styles.actionText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metricsRow}>
        <Text style={styles.metricPill}>⏱ {trail.durationHours} hours of hike</Text>
        <Text style={styles.metricPill}>📍 {trail.distanceKm} km</Text>
        <Text style={styles.metricPill}>⛰ {trail.difficulty}</Text>
        <Text style={styles.metricPill}>
          🗺 {offlineDownloaded ? "Offline map downloaded" : "Offline map not downloaded"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.description}>{trail.description}</Text>

      <Text style={styles.sectionTitle}>Reviews by other travelers</Text>
      <View style={styles.reviewRow}>
        {[
          { name: "Harry", image: require("../../assets/harry.png") },
          { name: "Liana", image: require("../../assets/liana.png") },
          { name: "Agne", image: require("../../assets/agne.png") },
        ].map((review) => (
          <View key={review.name} style={styles.reviewCard}>
            <Image source={review.image} style={styles.reviewAvatar} />
            <Text style={styles.reviewName}>{review.name}</Text>
            <Text style={styles.reviewText}>“Some guidance or short feedback.”</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Trail Map</Text>
      {trail.route?.length > 0 ? (
        <TrailMap trail={trail} onMapReady={setMapRef} />
      ) : (
        <View style={styles.mapFallback}>
          <Text style={styles.mapFallbackText}>No map data available for this trail.</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Offline Map</Text>

      <View style={styles.offlineCard}>
        <Text style={styles.offlineTitle}>
          {offlineDownloaded ? "Offline map is available" : "Offline map not downloaded"}
        </Text>

        <Text style={styles.offlineText}>
          {offlineDownloaded
            ? "This trail has been saved and can be prepared for offline navigation."
            : "Download this trail map so it can be used later without internet."}
        </Text>

        <View style={styles.offlineActions}>
          {!offlineDownloaded ? (
            <Pressable
              style={[styles.offlineButton, styles.offlineDownloadButton]}
              onPress={handleDownloadOffline}
              disabled={offlineLoading}
            >
              <Text style={styles.offlineDownloadText}>
                {offlineLoading ? "Saving..." : "Download Offline Map"}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.offlineButton, styles.offlineRemoveButton]}
              onPress={handleRemoveOffline}
              disabled={offlineLoading}
            >
              <Text style={styles.offlineRemoveText}>
                {offlineLoading ? "Removing..." : "Remove Offline Map"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.ctaRow}>
        <Pressable
          style={[styles.ctaButton, styles.ctaLight]}
          onPress={handleDownloadOffline}
          disabled={offlineLoading || offlineDownloaded}
        >
          <Text style={styles.ctaDarkText}>
            {offlineDownloaded ? "Downloaded" : offlineLoading ? "Saving..." : "Download"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.ctaButton, styles.ctaDark]}
          onPress={handleNavigate}
        >
          <Text style={styles.ctaLightText}>Navigate</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  topIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconImage: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  header: {
    alignItems: "center",
    marginTop: 14,
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.black,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pin: {
    color: "#e34949",
    fontSize: 10,
  },
  region: {
    color: COLORS.grayText,
    fontSize: 11,
  },
  star: {
    color: COLORS.accent,
    fontSize: 10,
  },
  rating: {
    fontSize: 10,
  },
  heart: {
    color: "#e34949",
    fontSize: 10,
  },
  likes: {
    fontSize: 10,
  },
  galleryRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
  },
  galleryLarge: {
    width: 170,
    height: 140,
    borderRadius: 16,
  },
  galleryCol: {
    gap: 8,
  },
  gallerySmall: {
    width: 90,
    height: 66,
    borderRadius: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  actionIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 10,
  },
  metricsRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricPill: {
    fontSize: 9,
    color: COLORS.grayText,
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
  },
  description: {
    marginTop: 8,
    color: COLORS.grayText,
    fontSize: 11,
    lineHeight: 16,
  },
  reviewRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  reviewCard: {
    width: 92,
    backgroundColor: COLORS.lightGray,
    borderRadius: 14,
    padding: 8,
    gap: 6,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  reviewName: {
    fontSize: 10,
    fontWeight: "700",
  },
  reviewText: {
    fontSize: 8,
    color: COLORS.grayText,
    lineHeight: 11,
  },
  mapFallback: {
    marginTop: 10,
    height: 120,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  mapFallbackText: {
    color: COLORS.grayText,
    fontSize: 12,
    textAlign: "center",
  },
  offlineCard: {
    marginTop: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  offlineTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
  },
  offlineText: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.grayText,
  },
  offlineActions: {
    marginTop: 6,
    flexDirection: "row",
  },
  offlineButton: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  offlineDownloadButton: {
    backgroundColor: COLORS.green,
  },
  offlineRemoveButton: {
    backgroundColor: "#e7e7e7",
  },
  offlineDownloadText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 12,
  },
  offlineRemoveText: {
    color: COLORS.black,
    fontWeight: "600",
    fontSize: 12,
  },
  ctaRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  ctaButton: {
    height: 40,
    minWidth: 110,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaLight: {
    backgroundColor: "#c9d389",
  },
  ctaDark: {
    backgroundColor: COLORS.green,
  },
  ctaDarkText: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: "600",
  },
  ctaLightText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "600",
  },
});