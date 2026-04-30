import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  AppState,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  RootStackParamList,
  LocationPoint,
  RecordedTrail,
} from "../app/navigationTypes";
import {
  saveActiveRecording,
  clearActiveRecording,
  getActiveRecording,
  savePendingSubmission,
} from "../services/trailRecordingStorage";
import { calculateTotalDistance } from "../services/trailRecordingUtils";
import { BACKGROUND_LOCATION_TASK } from "../services/backgroundLocationTask";
import { saveRecordedTrailToFirestore } from "../services/recordTrailService";
import { COLORS } from "../theme/colors";
import { publishRecordedTrailToTrails } from "../services/trailsService";
import { TextInput } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "RecordTrail">;

export default function RecordTrailScreen({ navigation }: Props) {
  const [points, setPoints] = useState<LocationPoint[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [trailName, setTrailName] = useState("");
const [showNameInput, setShowNameInput] = useState(false);
  

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const storagePollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const distanceMeters = useMemo(() => calculateTotalDistance(points), [points]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimerFromStartedAt = (start: number) => {
    stopTimer();
    setElapsedSeconds(Math.floor((Date.now() - start) / 1000));

    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
  };

  const stopStoragePolling = () => {
    if (storagePollRef.current) {
      clearInterval(storagePollRef.current);
      storagePollRef.current = null;
    }
  };

  const syncFromStorage = async () => {
    try {
      const recording = await getActiveRecording();
      if (!recording) return;

      setPoints(recording.coordinates ?? []);
      setStartedAt(recording.startedAt ?? null);

      if (recording.startedAt) {
        setElapsedSeconds(
          recording.status === "paused"
            ? recording.durationSeconds ?? 0
            : Math.floor((Date.now() - recording.startedAt) / 1000)
        );
      }

      setIsRecording(recording.status === "recording");
      setIsPaused(recording.status === "paused");
    } catch (e) {
      console.log("syncFromStorage error:", e);
    }
  };

  const startStoragePolling = () => {
    stopStoragePolling();
    storagePollRef.current = setInterval(() => {
      syncFromStorage().catch(console.log);
    }, 3000);
  };

  const requestPermissions = async () => {
    const fg = await Location.requestForegroundPermissionsAsync();
    console.log("Foreground permission:", fg);

    if (fg.status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Foreground location permission is required to record a trail."
      );
      return false;
    }

    const bg = await Location.requestBackgroundPermissionsAsync();
    console.log("Background permission:", bg);

    if (bg.status !== "granted") {
      Alert.alert(
        "Background permission needed",
        "Background location permission is required so recording can continue when the app is not open."
      );
      return false;
    }

    return true;
  };

  const startBackgroundUpdates = async () => {
    const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK
    );

    if (!alreadyStarted) {
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 3000,
        distanceInterval: 15,
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Trail recording active",
          notificationBody: "Your trail is being recorded in the background.",
        },
      });
    }
  };

  const stopBackgroundUpdates = async () => {
    const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK
    );

    if (alreadyStarted) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    }
  };

  useEffect(() => {
    syncFromStorage().catch(console.log);
    startStoragePolling();

    const sub = AppState.addEventListener("change", () => {
      syncFromStorage().catch(console.log);
    });

    return () => {
      sub.remove();
      stopTimer();
      stopStoragePolling();
    };
  }, []);

  useEffect(() => {
    if (startedAt && isRecording) {
      startTimerFromStartedAt(startedAt);
    } else if (isPaused) {
      stopTimer();
    }
  }, [startedAt, isRecording, isPaused]);

  const startRecording = async () => {
    try {
      console.log("START pressed");

      const granted = await requestPermissions();
      console.log("Permissions granted:", granted);

      if (!granted) {
        console.log("Permission request failed or was denied");
        return;
      }

      await stopBackgroundUpdates();
      await clearActiveRecording();

      const start = Date.now();
      console.log("Start timestamp:", start);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      console.log("Current location:", currentLocation);

      const firstPoint: LocationPoint = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: currentLocation.timestamp ?? Date.now(),
        accuracy: currentLocation.coords.accuracy ?? undefined,
        altitude: currentLocation.coords.altitude ?? null,
        speed: currentLocation.coords.speed ?? null,
      };

      const draft: RecordedTrail = {
        id: String(start),
        status: "recording",
        startedAt: start,
        durationSeconds: 0,
        distanceMeters: 0,
        coordinates: [firstPoint],
      };

      setPoints([firstPoint]);
      setStartedAt(start);
      setElapsedSeconds(0);
      setIsRecording(true);
      setIsPaused(false);

      await saveActiveRecording(draft);
      console.log("Saved draft locally");

      await startBackgroundUpdates();
      console.log("Background updates started");

      await syncFromStorage();
      console.log("Sync complete");
    } catch (error) {
      console.log("startRecording error:", error);
      Alert.alert("Start failed", String(error));
    }
  };

  const pauseRecording = async () => {
    const active = await getActiveRecording();
    if (!active) return;

    await stopBackgroundUpdates();

    const updated: RecordedTrail = {
      ...active,
      status: "paused",
      durationSeconds: Math.floor((Date.now() - active.startedAt) / 1000),
      distanceMeters: calculateTotalDistance(active.coordinates ?? []),
      finishedAt: active.finishedAt,
    };

    await saveActiveRecording(updated);
    await syncFromStorage();
  };

  const resumeRecording = async () => {
    const granted = await requestPermissions();
    if (!granted) return;

    const active = await getActiveRecording();
    if (!active) {
      Alert.alert("No recording found", "Start a new recording first.");
      return;
    }

    const updated: RecordedTrail = {
      ...active,
      status: "recording",
    };

    await saveActiveRecording(updated);
    await startBackgroundUpdates();
    await syncFromStorage();
  };

  const finishRecording = async () => {
    try {
       if (!trailName.trim()) {
      Alert.alert("Name required", "Please enter a trail name.");
      return;
    }
      await stopBackgroundUpdates();
      stopTimer();

      const active = await getActiveRecording();

      if (!active || !active.startedAt || (active.coordinates ?? []).length < 1) {
        Alert.alert(
          "Not enough data",
          "Please record at least one trail point before finishing."
        );
        return;
      }

      const finishedAt = Date.now();

      const recordedTrail: RecordedTrail = {
        ...active,
         title: trailName.trim(), // ✅ ADD THIS LINE
        status: "finished",
        finishedAt,
        durationSeconds: Math.floor((finishedAt - active.startedAt) / 1000),
        distanceMeters: calculateTotalDistance(active.coordinates ?? []),
      };

      // Always save finished trail locally first, then attempt Firestore upload
      await savePendingSubmission(recordedTrail);
      // await saveRecordedTrailToFirestore(recordedTrail);

    //    try {
    //   await saveRecordedTrailToFirestore(recordedTrail);
    //   console.log("Trail uploaded to Firestore:", recordedTrail.id);
    // } catch (uploadError) {
    //   console.log("Upload failed, kept locally for later sync:", uploadError);
    //   Alert.alert(
    //     "Saved offline",
    //     "Your trail was saved on this device and will be uploaded when internet is available."
    //   );
    // }

      await clearActiveRecording();

      // const trailId = await publishRecordedTrailToTrails(recordedTrail);

      setIsRecording(false);
      setIsPaused(false);
      setPoints([]);
      setStartedAt(null);
      setElapsedSeconds(0);

      // Alert.alert("Success", "Trail saved to Firestore successfully.");

      // navigation.navigate("TrailSubmission", {
      //   recordedTrail,
      // });

      Alert.alert("Saved", "Your recorded trail was saved successfully.", [
  {
    text: "OK",
    onPress: () => navigation.navigate("Main"),
  },
]);

  //   } catch (error) {
  //     console.log("Failed to save recorded trail:", error);
  //     Alert.alert(
  //       "Save failed",
  //       "Could not save the trail to Firestore. Please try again."
  //     );
  //   }
  // };

   // 5. Try cloud upload after navigation; do not block finish
    saveRecordedTrailToFirestore(recordedTrail)
      .then(() => {
        console.log("Trail uploaded to Firestore:", recordedTrail.id);
      })
      .catch((uploadError) => {
        console.log("Upload failed, kept locally for later sync:", uploadError);
      });
  } catch (error) {
    console.log("Failed to finish recorded trail:", error);
    Alert.alert(
      "Save failed",
      "The trail could not be finalized. Please try again."
    );
  }
};

  const exitScreen = async () => {
    if (isRecording) {
      Alert.alert(
        "Recording in progress",
        "Pause or finish the recording before exiting."
      );
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
        <Text style={styles.subtitle}>
          Works offline. GPS points are stored locally and continue in background.
        </Text>

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
            <Pressable style={styles.buttonSecondary} onPress={() => setShowNameInput(true)}>
              <Text style={styles.buttonTextSecondary}>Finish Recording</Text>
            </Pressable>
          ) : null}

          {showNameInput ? (
            <View style={styles.nameBox}>
              <TextInput
                placeholder="Enter trail name"
                value={trailName}
                onChangeText={setTrailName}
                style={styles.nameInput}
              />

              <Pressable style={styles.button} onPress={finishRecording}>
                <Text style={styles.buttonText}>Save Trail</Text>
              </Pressable>
            </View>
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
   nameBox: {
    gap: 10,
  },
  nameInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 14,
    color: COLORS.black,
  },
});
