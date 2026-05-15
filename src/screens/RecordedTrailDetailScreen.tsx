import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";
// import type { Trail } from "../data/trails";
type Props = NativeStackScreenProps<
  RootStackParamList,
  "RecordedTrailDetail"
>;

export default function RecordedTrailDetailScreen({ route, navigation }: Props) {
    
  const { trail } = route.params;
  const routePoints = trail.coordinates.map((point) => ({
  latitude: point.latitude,
  longitude: point.longitude,
}));

  const recordedTrailAsTrail = {
  id: trail.id,
  name: trail.title || "Recorded Trail",
  region: "Recorded Trail",
  distanceKm: Number((trail.distanceMeters / 1000).toFixed(2)),
  durationHours: Number((trail.durationSeconds / 3600).toFixed(1)),
  difficulty: "Easy" as const,
  elevationM: 0,
  description: "Recorded trail",
  startLocation: routePoints[0],
  endLocation: routePoints[routePoints.length - 1],
  center: routePoints[0],
  route: routePoints,
};

  const points = trail.coordinates ?? [];

  const region = points.length
    ? {
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 40.4093,
        longitude: 49.8671,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trail.title || "Recorded Trail"}</Text>

      <Text style={styles.date}>
        {new Date(trail.startedAt).toLocaleString()}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>
            {(trail.distanceMeters / 1000).toFixed(2)} km
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>
            {formatDuration(trail.durationSeconds)}
          </Text>
        </View>
      </View>

      <MapView style={styles.map} initialRegion={region}>
        {points.length > 0 && (
          <>
            <Polyline
              coordinates={points}
              strokeWidth={4}
              strokeColor="#2f7d4a"
            />
            <Marker coordinate={points[0]} title="Start" />
            <Marker coordinate={points[points.length - 1]} title="Finish" />
          </>
        )}
      </MapView>

      <View style={styles.offlineCard}>
        <Text style={styles.offlineTitle}>Offline Map</Text>
        <Text style={styles.offlineText}>
          Download this trail map so it can be used later without internet.
        </Text>

        <Pressable
  style={styles.downloadButton}
  onPress={() => {
    Alert.alert("Saved", "This recorded trail is available offline.");
  }}
>
  <Text style={styles.downloadText}>Download Offline Map</Text>
</Pressable>

<Pressable
  style={styles.navigateButton}
  onPress={() =>
    navigation.navigate("OfflineMap", {
      trail: recordedTrailAsTrail as any,
      navigationMode: true,
    })
  }
>
  <Text style={styles.navigateText}>Navigate</Text>
</Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.black,
  },
  date: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 14,
    padding: 12,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
  },
  map: {
    height: 260,
    borderRadius: 16,
    overflow: "hidden",
  },
  offlineCard: {
    marginTop: 18,
    backgroundColor: "#f1f1f1",
    borderRadius: 16,
    padding: 16,
  },
  offlineTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.black,
  },
  offlineText: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  downloadButton: {
    marginTop: 14,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  navigateButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#d8edc5",
    alignItems: "center",
    justifyContent: "center",
  },
  navigateText: {
    color: COLORS.black,
    fontWeight: "700",
  },
  backButton: {
    marginTop: 14,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: COLORS.black,
    fontWeight: "700",
  },
});