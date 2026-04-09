// import React, { useEffect, useMemo, useState } from "react";
// import { View, StyleSheet, Text, Alert, Pressable } from "react-native";
// import MapView, { Marker, Polyline, Region } from "react-native-maps";
// import * as Location from "expo-location";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../app/navigationTypes";
// import { COLORS } from "../theme/colors";

// type Props = NativeStackScreenProps<RootStackParamList, "OfflineMap">;

// export default function OfflineMapScreen({ route, navigation }: Props) {
//   const { trail } = route.params;
//   const [hasPermission, setHasPermission] = useState(false);
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);

//   const initialRegion: Region = useMemo(
//     () => ({
//       latitude: trail.center.latitude,
//       longitude: trail.center.longitude,
//       latitudeDelta: 0.05,
//       longitudeDelta: 0.05,
//     }),
//     [trail]
//   );

//   useEffect(() => {
//     let subscription: Location.LocationSubscription | null = null;

//     async function setupLocation() {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();

//         if (status !== "granted") {
//           setHasPermission(false);
//           Alert.alert(
//             "Permission needed",
//             "Location permission is required for offline navigation."
//           );
//           return;
//         }

//         setHasPermission(true);

//         const current = await Location.getCurrentPositionAsync({});
//         setUserLocation({
//           latitude: current.coords.latitude,
//           longitude: current.coords.longitude,
//         });

//         subscription = await Location.watchPositionAsync(
//           {
//             accuracy: Location.Accuracy.High,
//             timeInterval: 3000,
//             distanceInterval: 5,
//           },
//           (location) => {
//             setUserLocation({
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//             });
//           }
//         );
//       } catch (error) {
//         console.log("Offline location error:", error);
//       }
//     }

//     setupLocation();

//     return () => {
//       subscription?.remove();
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.topBar}>
//         <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Text style={styles.backText}>Back</Text>
//         </Pressable>
//         <Text style={styles.title}>Offline Navigation</Text>
//       </View>

//       <MapView
//         style={styles.map}
//         initialRegion={initialRegion}
//         showsUserLocation={hasPermission}
//         showsMyLocationButton
//       >
//         <Marker coordinate={trail.startLocation} title="Trail Start" />
//         {trail.endLocation && (
//           <Marker coordinate={trail.endLocation} title="Trail End" />
//         )}

//         <Polyline
//           coordinates={trail.route}
//           strokeWidth={4}
//           strokeColor="#2F8F63"
//         />

//         {userLocation && (
//           <Polyline
//             coordinates={[userLocation, trail.startLocation]}
//             strokeWidth={3}
//             strokeColor="#2E86FF"
//           />
//         )}
//       </MapView>

//       <View style={styles.infoCard}>
//         <Text style={styles.infoTitle}>{trail.name}</Text>
//         <Text style={styles.infoText}>{trail.region}</Text>
//         <Text style={styles.infoText}>
//           The green line is the trail. The blue line shows direction from your current location to the trail start.
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   topBar: {
//     paddingTop: 50,
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     backgroundColor: COLORS.white,
//   },
//   backButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: COLORS.lightGray,
//     borderRadius: 16,
//   },
//   backText: {
//     fontWeight: "600",
//     color: COLORS.black,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.black,
//   },
//   map: {
//     flex: 1,
//   },
//   infoCard: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 20,
//     backgroundColor: "rgba(255,255,255,0.95)",
//     borderRadius: 16,
//     padding: 14,
//     gap: 4,
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: COLORS.black,
//   },
//   infoText: {
//     fontSize: 12,
//     color: COLORS.grayText,
//     lineHeight: 16,
//   },
// });

import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Text, Alert, Pressable } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "OfflineMap">;

type LatLng = {
  latitude: number;
  longitude: number;
};

function getDistanceMeters(a: LatLng, b: LatLng) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;

  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * y;
}

function findNearestRouteIndex(user: LatLng, route: LatLng[]) {
  let nearestIndex = 0;
  let nearestDistance = Number.MAX_SAFE_INTEGER;

  route.forEach((point, index) => {
    const distance = getDistanceMeters(user, point);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return {
    nearestIndex,
    nearestDistance,
  };
}

export default function OfflineMapScreen({ route, navigation }: Props) {
  const { trail, navigationMode = false } = route.params;

  const mapRef = useRef<MapView | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [instruction, setInstruction] = useState("Preparing navigation...");
  const [nearestPointIndex, setNearestPointIndex] = useState<number | null>(null);
  const [distanceToTrail, setDistanceToTrail] = useState<number | null>(null);

  const initialRegion: Region = useMemo(
    () => ({
      latitude: trail.center.latitude,
      longitude: trail.center.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }),
    [trail]
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function setupLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setHasPermission(false);
          Alert.alert(
            "Permission needed",
            "Location permission is required for offline navigation."
          );
          return;
        }

        setHasPermission(true);

        const current = await Location.getCurrentPositionAsync({});
        const firstLocation = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };

        setUserLocation(firstLocation);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          (location) => {
            const nextLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setUserLocation(nextLocation);
          }
        );
      } catch (error) {
        console.log("Offline location error:", error);
      }
    }

    setupLocation();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!navigationMode || !userLocation || !trail.route?.length) return;

    const startDistance = getDistanceMeters(userLocation, trail.startLocation);
    const { nearestIndex, nearestDistance } = findNearestRouteIndex(
      userLocation,
      trail.route
    );

    setNearestPointIndex(nearestIndex);
    setDistanceToTrail(nearestDistance);

    if (startDistance > 80 && nearestDistance > 60) {
      setInstruction(
        `Move to trail start. Distance: ${Math.round(startDistance)} m`
      );
      return;
    }

    if (nearestDistance > 40) {
      setInstruction(
        `You are off route by ${Math.round(nearestDistance)} m. Return to the trail.`
      );
      return;
    }

    const nextIndex = Math.min(nearestIndex + 1, trail.route.length - 1);
    const nextPoint = trail.route[nextIndex];
    const distanceToNext = getDistanceMeters(userLocation, nextPoint);

    if (nextIndex === trail.route.length - 1 && distanceToNext < 30) {
      setInstruction("You are near the end of the trail.");
      return;
    }

    setInstruction(
      `Continue on trail. Next point in ${Math.round(distanceToNext)} m`
    );
  }, [navigationMode, userLocation, trail]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>
          {navigationMode ? "Offline Navigator" : "Offline Map"}
        </Text>
      </View>

      {navigationMode && (
        <View style={styles.navigationCard}>
          <Text style={styles.navigationTitle}>Navigation</Text>
          <Text style={styles.navigationText}>{instruction}</Text>
          {distanceToTrail !== null && (
            <Text style={styles.navigationMeta}>
              Distance to trail: {Math.round(distanceToTrail)} m
            </Text>
          )}
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={hasPermission}
        showsMyLocationButton
      >
        <Marker coordinate={trail.startLocation} title="Trail Start" />
        {trail.endLocation && (
          <Marker coordinate={trail.endLocation} title="Trail End" />
        )}

        <Polyline
          coordinates={trail.route}
          strokeWidth={4}
          strokeColor="#2F8F63"
        />

        {userLocation && nearestPointIndex !== null && trail.route[nearestPointIndex] && (
          <Polyline
            coordinates={[userLocation, trail.route[nearestPointIndex]]}
            strokeWidth={3}
            strokeColor="#2E86FF"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.white,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
  },
  backText: {
    fontWeight: "600",
    color: COLORS.black,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
  },
  map: {
    flex: 1,
  },
  navigationCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  navigationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.black,
  },
  navigationText: {
    fontSize: 13,
    color: COLORS.black,
    lineHeight: 18,
  },
  navigationMeta: {
    fontSize: 12,
    color: COLORS.grayText,
  },
});