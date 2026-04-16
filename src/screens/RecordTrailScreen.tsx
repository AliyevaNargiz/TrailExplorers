import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, LocationPoint, RecordedTrail } from "../app/navigationTypes";
import {
  saveActiveRecording,
  clearActiveRecording,
} from "../services/trailRecordingStorage";
import { calculateTotalDistance } from "../services/trailRecordingUtils";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "RecordTrail">;

export default function RecordTrailScreen({ navigation }: Props) {
  const [points, setPoints] = useState<LocationPoint[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const watcherRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      watcherRef.current?.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const distanceMeters = useMemo(() => calculateTotalDistance(points), [points]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Location permission is required to record a trail.");
      return;
    }

    const start = Date.now();
    setStartedAt(start);
    setElapsedSeconds(0);
    setIsRecording(true);
    setIsPaused(false);
    setPoints([]);

    startTimer();

    watcherRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      async (location) => {
        const point: LocationPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp ?? Date.now(),
          accuracy: location.coords.accuracy ?? undefined,
          altitude: location.coords.altitude ?? null,
          speed: location.coords.speed ?? null,
        };

        setPoints((prev) => {
          const next = [...prev, point];

          const draft: RecordedTrail = {
            id: String(start),
            status: "recording",
            startedAt: start,
            durationSeconds: elapsedSeconds,
            distanceMeters: calculateTotalDistance(next),
            coordinates: next,
          };

          saveActiveRecording(draft).catch(console.log);
          return next;
        });
      }
    );
  };

  const pauseRecording = async () => {
    watcherRef.current?.remove();
    watcherRef.current = null;
    stopTimer();
    setIsPaused(true);
    setIsRecording(false);

    if (startedAt) {
      const draft: RecordedTrail = {
        id: String(startedAt),
        status: "paused",
        startedAt,
        durationSeconds: elapsedSeconds,
        distanceMeters,
        coordinates: points,
      };
      await saveActiveRecording(draft);
    }
  };

  const resumeRecording = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Location permission is required to continue recording.");
      return;
    }

    setIsPaused(false);
    setIsRecording(true);
    startTimer();

    watcherRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      async (location) => {
        const point: LocationPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp ?? Date.now(),
          accuracy: location.coords.accuracy ?? undefined,
          altitude: location.coords.altitude ?? null,
          speed: location.coords.speed ?? null,
        };

        setPoints((prev) => {
          const next = [...prev, point];

          if (!startedAt) return next;

          const draft: RecordedTrail = {
            id: String(startedAt),
            status: "recording",
            startedAt,
            durationSeconds: elapsedSeconds,
            distanceMeters: calculateTotalDistance(next),
            coordinates: next,
          };

          saveActiveRecording(draft).catch(console.log);
          return next;
        });
      }
    );
  };

  const finishRecording = async () => {
    watcherRef.current?.remove();
    watcherRef.current = null;
    stopTimer();
    setIsRecording(false);
    setIsPaused(false);

    if (!startedAt || points.length < 2) {
      Alert.alert("Not enough data", "Please record more trail points before finishing.");
      return;
    }

    const recordedTrail: RecordedTrail = {
      id: String(startedAt),
      status: "finished",
      startedAt,
      finishedAt: Date.now(),
      durationSeconds: elapsedSeconds,
      distanceMeters,
      coordinates: points,
    };

    await saveActiveRecording(recordedTrail);
    await clearActiveRecording();

    navigation.navigate("TrailSubmission", {
      recordedTrail,
    });
  };

  const exitScreen = async () => {
    if (isRecording) {
      Alert.alert("Recording in progress", "Pause or finish the recording before exiting.");
      return;
    }
    navigation.goBack();
  };

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

    if (h > 0) {
      return `${h}h ${m}m ${s}s`;
    }
    return `${m}m ${s}s`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Record Trail</Text>
        <Text style={styles.subtitle}>Works offline. GPS points are stored locally.</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{(distanceMeters / 1000).toFixed(2)} km</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatDuration(elapsedSeconds)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Points</Text>
            <Text style={styles.statValue}>{points.length}</Text>
          </View>
        </View>

        <MapView style={styles.map} initialRegion={region} showsUserLocation>
          {points.length > 0 ? (
            <>
              <Polyline coordinates={points} strokeWidth={4} strokeColor="#2f7d4a" />
              <Marker coordinate={points[0]} title="Start" />
              <Marker coordinate={points[points.length - 1]} title="Current" />
            </>
          ) : null}
        </MapView>

        <View style={styles.actions}>
          {!isRecording && !isPaused ? (
            <Pressable style={styles.button} onPress={startRecording}>
              <Text style={styles.buttonText}>Start Recording</Text>
            </Pressable>
          ) : null}

          {isRecording ? (
            <Pressable style={styles.buttonSecondary} onPress={pauseRecording}>
              <Text style={styles.buttonTextSecondary}>Pause Recording</Text>
            </Pressable>
          ) : null}

          {isPaused ? (
            <Pressable style={styles.button} onPress={resumeRecording}>
              <Text style={styles.buttonText}>Resume Recording</Text>
            </Pressable>
          ) : null}

          {(isRecording || isPaused) ? (
            <Pressable style={styles.buttonSecondary} onPress={finishRecording}>
              <Text style={styles.buttonTextSecondary}>Finish Recording</Text>
            </Pressable>
          ) : null}

          <Pressable style={styles.exitButton} onPress={exitScreen}>
            <Text style={styles.exitText}>Exit</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.black,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 12,
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
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  button: {
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  buttonSecondary: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8efdd",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextSecondary: {
    color: COLORS.black,
    fontWeight: "700",
  },
  exitButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  exitText: {
    color: COLORS.black,
    fontWeight: "700",
  },
});