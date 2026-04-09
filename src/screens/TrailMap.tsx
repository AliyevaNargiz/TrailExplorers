// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { View, StyleSheet, Text, Alert } from "react-native";
// import MapView, { Marker, Polyline, Region } from "react-native-maps";
// import * as Location from "expo-location";
// import type { Trail } from "../data/trails";

// export type MapRefType = React.RefObject<MapView | null>;

// type Props = {
//   trail: Trail;
//   showUserLocation?: boolean;
//   onMapReady?: (mapRef: MapRefType) => void;
// };

// export function centerMapOnLocation(
//   mapRef: MapRefType,
//   location: { latitude: number; longitude: number }
// ) {
//   if (!mapRef?.current) return;

//   mapRef.current.animateToRegion(
//     {
//       latitude: location.latitude,
//       longitude: location.longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     },
//     1000
//   );
// }

// export function centerMapOnTrailStart(mapRef: MapRefType, trail: Trail) {
//   if (!mapRef?.current) return;

//   mapRef.current.animateToRegion(
//     {
//       latitude: trail.startLocation.latitude,
//       longitude: trail.startLocation.longitude,
//       latitudeDelta: 0.02,
//       longitudeDelta: 0.02,
//     },
//     1000
//   );
// }

// export default function TrailMap({
//   trail,
//   showUserLocation = true,
//   onMapReady,
// }: Props) {
//   const mapRef = useRef<MapView | null>(null);
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
//     if (onMapReady) {
//       onMapReady(mapRef);
//     }
//   }, [onMapReady]);

//   useEffect(() => {
//     async function setupLocation() {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();

//         if (status !== "granted") {
//           setHasPermission(false);
//           return;
//         }

//         setHasPermission(true);

//         const current = await Location.getCurrentPositionAsync({});
//         setUserLocation({
//           latitude: current.coords.latitude,
//           longitude: current.coords.longitude,
//         });
//       } catch (error) {
//         console.log("Location setup error:", error);
//       }
//     }

//     setupLocation();
//   }, []);

//   useEffect(() => {
//     if (!mapRef.current || !trail.route || trail.route.length < 2) return;

//     const timer = setTimeout(() => {
//       mapRef.current?.fitToCoordinates(trail.route, {
//         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//         animated: true,
//       });
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [trail]);

//   const handleCenterOnUser = async () => {
//     try {
//       if (!hasPermission) {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Location permission denied",
//             "Enable location permission to use navigation."
//           );
//           return;
//         }
//         setHasPermission(true);
//       }

//       let currentLocation = userLocation;

//       if (!currentLocation) {
//         const current = await Location.getCurrentPositionAsync({});
//         currentLocation = {
//           latitude: current.coords.latitude,
//           longitude: current.coords.longitude,
//         };
//         setUserLocation(currentLocation);
//       }

//       centerMapOnLocation(mapRef, currentLocation);
//     } catch (error) {
//       console.log("Center on user error:", error);
//       Alert.alert(
//         "Location unavailable",
//         "Your current location is not available yet. Check permission and device GPS."
//       );
//     }
//   };

//   return (
//     <View style={styles.wrapper}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={initialRegion}
//         showsUserLocation={false}
//         showsMyLocationButton={false}
//       >
//         <Marker coordinate={trail.startLocation} title="Start" />

//         {trail.endLocation && (
//           <Marker coordinate={trail.endLocation} title="End" />
//         )}

//         {trail.route?.length > 1 && (
//           <Polyline
//             coordinates={trail.route}
//             strokeWidth={4}
//             strokeColor="#2F8F63"
//           />
//         )}
//       </MapView>

//       <View style={styles.customLocationButtonWrap}>
//         <Text style={styles.customLocationButton} onPress={handleCenterOnUser}>
//           ◎
//         </Text>
//       </View>

//       {!hasPermission && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>Location off</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     marginTop: 10,
//     height: 220,
//     borderRadius: 12,
//     overflow: "hidden",
//     position: "relative",
//   },
//   map: {
//     flex: 1,
//   },
//   badge: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     backgroundColor: "rgba(0,0,0,0.65)",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//   },
//   badgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   customLocationButtonWrap: {
//     position: "absolute",
//     right: 12,
//     bottom: 12,
//   },
//   customLocationButton: {
//     backgroundColor: "white",
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     textAlign: "center",
//     textAlignVertical: "center",
//     fontSize: 22,
//     lineHeight: 42,
//     elevation: 3,
//   },
// });

import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Text, Alert, Pressable, Platform } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import type { Trail } from "../data/trails";

export type MapRefType = React.RefObject<MapView | null>;

type Props = {
  trail: Trail;
  showUserLocation?: boolean;
  onMapReady?: (mapRef: MapRefType) => void;
};

export function centerMapOnLocation(
  mapRef: MapRefType,
  location: { latitude: number; longitude: number }
) {
  if (!mapRef?.current) return;

  mapRef.current.animateToRegion(
    {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    1000
  );
}

export default function TrailMap({
  trail,
  showUserLocation = true,
  onMapReady,
}: Props) {
  const mapRef = useRef<MapView | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
    if (onMapReady) onMapReady(mapRef);
  }, [onMapReady]);

  useEffect(() => {
    async function setupLocation() {
      try {
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          setHasPermission(false);
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setHasPermission(false);
          return;
        }

        setHasPermission(true);

        const current = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      } catch (error) {
        console.log("Location setup error:", error);
      }
    }

    setupLocation();
  }, []);

  const handleMapReady = () => {
    if (trail.route?.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(trail.route, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }

    if (onMapReady) onMapReady(mapRef);
  };

  const handleCenterOnUser = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert("GPS is off", "Please enable location services.");
        return;
      }

      let granted = hasPermission;

      if (!granted) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        granted = status === "granted";
        setHasPermission(granted);

        if (!granted) {
          Alert.alert(
            "Location permission denied",
            "Enable location permission to use navigation."
          );
          return;
        }
      }

      let currentLocation = userLocation;

      if (!currentLocation) {
        const current = await Location.getCurrentPositionAsync({});
        currentLocation = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };
        setUserLocation(currentLocation);
      }

      centerMapOnLocation(mapRef, currentLocation);
    } catch (error) {
      console.log("Center on user error:", error);
      Alert.alert(
        "Location unavailable",
        "Your current location is not available yet. Check permission and device GPS."
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={handleMapReady}
        showsUserLocation={showUserLocation && hasPermission}
        // showsMyLocationButton={false}
        showsMyLocationButton={hasPermission}
      > */}
      <MapView
  ref={mapRef}
  style={styles.map}
  initialRegion={initialRegion}
  showsUserLocation={false}
  showsMyLocationButton={false}
  onMapReady={() => {
    if (trail.route?.length > 1) {
      mapRef.current?.fitToCoordinates(trail.route, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }}
>
        <Marker coordinate={trail.startLocation} title="Start" />
        {trail.endLocation && <Marker coordinate={trail.endLocation} title="End" />}
        {trail.route?.length > 1 && (
          <Polyline
            coordinates={trail.route}
            strokeWidth={4}
            strokeColor="#2F8F63"
          />
        )}
      </MapView>

      <View style={styles.customLocationButtonWrap}>
        <Pressable style={styles.customLocationButton} onPress={handleCenterOnUser}>
          <Text style={styles.customLocationButtonText}>◎</Text>
        </Pressable>
      </View>

      {!hasPermission && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Location off</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    flex: 1,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  customLocationButtonWrap: {
    position: "absolute",
    right: 12,
    bottom: 12,
  },
  customLocationButton: {
    backgroundColor: "white",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  customLocationButtonText: {
    fontSize: 22,
  },
});