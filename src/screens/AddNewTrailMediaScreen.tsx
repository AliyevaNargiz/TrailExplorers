import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";
import { submitTrailSubmission } from "../services/trailSubmissionService";

type Props = NativeStackScreenProps<RootStackParamList, "AddNewTrailMedia">;

export default function AddNewTrailMediaScreen({ route, navigation }: Props) {
  const { draft } = route.params;
  const [waypointNotes, setWaypointNotes] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [elevationGain, setElevationGain] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const mockRoute = useMemo(
    () => [
      { latitude: 40.4093, longitude: 49.8671 },
      { latitude: 40.4102, longitude: 49.8682 },
      { latitude: 40.4111, longitude: 49.8691 },
    ],
    []
  );

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const payload = {
        ...draft,
        waypointNotes: waypointNotes.trim(),
        mediaUrls: [],
        route: mockRoute,
        routeStats: {
          distanceKm: Number(distanceKm) || 0,
          durationHours: Number(durationHours) || 0,
          elevationGain: Number(elevationGain) || 0,
        },
      };

      const result = await submitTrailSubmission (payload);

      navigation.replace("TrailSubmission", {
        submissionId: result.submissionId,
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to submit trail.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add New Trail</Text>
          <Text style={styles.subtitle}>Media and route information</Text>

          <Text style={styles.label}>Waypoint notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add key waypoints or notes"
            value={waypointNotes}
            onChangeText={setWaypointNotes}
            multiline
            placeholderTextColor={COLORS.grayText}
          />

          <Text style={styles.label}>Distance (km)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="5.4"
            value={distanceKm}
            onChangeText={setDistanceKm}
            placeholderTextColor={COLORS.grayText}
          />

          <Text style={styles.label}>Duration (hours)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="2.5"
            value={durationHours}
            onChangeText={setDurationHours}
            placeholderTextColor={COLORS.grayText}
          />

          <Text style={styles.label}>Elevation gain (m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="280"
            value={elevationGain}
            onChangeText={setElevationGain}
            placeholderTextColor={COLORS.grayText}
          />

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Temporary route setup</Text>
            <Text style={styles.infoText}>
              For now, we are using a placeholder route. Later we can connect
              this to your recorded map route and photo upload flow.
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Submit</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.black,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.grayText,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  infoCard: {
    marginTop: 18,
    backgroundColor: COLORS.lightGray,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  infoTitle: {
    fontWeight: "700",
    color: COLORS.black,
  },
  infoText: {
    color: COLORS.grayText,
    lineHeight: 18,
    fontSize: 12,
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.green,
  },
  secondaryButton: {
    backgroundColor: COLORS.lightGray,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButtonText: {
    color: COLORS.black,
    fontWeight: "700",
    fontSize: 14,
  },
});