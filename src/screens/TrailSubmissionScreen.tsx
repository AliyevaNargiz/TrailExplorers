import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "TrailSubmission">;

export default function TrailSubmissionSuccessScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>You’re Amazing!</Text>
        <Text style={styles.text}>
          Thanks for sharing your adventure with the community.
        </Text>
        <Text style={styles.text}>
          Our AI is now scanning your trail to ensure it is safe, accurate, and ready for other hikers.
        </Text>
        <Text style={styles.text}>
          We’ll send you a notification as soon as it is approved and published.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Main")}>
        <Text style={styles.buttonText}>Leave</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#dce9c6",
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.black,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.black,
    textAlign: "center",
  },
  button: {
    marginTop: 28,
    backgroundColor: COLORS.green,
    height: 46,
    minWidth: 140,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});