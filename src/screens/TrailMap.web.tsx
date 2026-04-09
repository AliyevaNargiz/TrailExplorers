import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import type { Trail } from "../data/trails";

export type MapRefType = null;

type Props = {
  trail: Trail;
  showUserLocation?: boolean;
  onMapReady?: (mapRef: MapRefType) => void;
};

export function centerMapOnLocation() {
  // no-op on web
}

export function centerMapOnTrailStart() {
  // no-op on web
}

export default function TrailMap({ trail, onMapReady }: Props) {
  useEffect(() => {
    if (onMapReady) {
      onMapReady(null);
    }
  }, [onMapReady]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Map is not available in browser</Text>
      <Text style={styles.text}>Trail: {trail.name}</Text>
      <Text style={styles.text}>Region: {trail.region}</Text>
      <Text style={styles.text}>
        Open this screen on Android or iPhone to use the real map and navigation.
      </Text>
      <Text style={styles.coords}>
        Start: {trail.startLocation.latitude}, {trail.startLocation.longitude}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    minHeight: 220,
    borderRadius: 12,
    backgroundColor: "#eef2e2",
    padding: 16,
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  text: {
    fontSize: 13,
    color: "#444",
  },
  coords: {
    fontSize: 12,
    color: "#666",
  },
});