import React from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back to the Eco Trail!</Text>
          <Text style={styles.subtitle}>
            Discover new eco-friendly trails, save offline maps, and join the
            green adventure.
          </Text>

          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Trail discovery</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Offline maps</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Eco stats</Text>
            </View>
          </View>

          <Pressable
            style={styles.googleButton}
            onPress={() => navigation.navigate("Login")}
          >
            <View style={styles.googleIconWrap}>
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>

          {/**
          <Pressable
            style={styles.appleButton}
            onPress={() => navigation.replace("Main")}
          >
            <View style={styles.appleIconWrap}>
              <Text style={styles.appleIcon}></Text>
            </View>
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </Pressable>
          */}

          <Text style={styles.noteText}>
            Your Google account will be used to keep your trail activity safe and
            synced across devices.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#E8F6EC",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#E8F6EC",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    shadowColor: "#1A4B2B",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    borderWidth: 1,
    borderColor: "#D8EED8",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E4630",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4C6B55",
    marginBottom: 28,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  chip: {
    backgroundColor: "#E8F6EC",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D8EED8",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2B6B3A",
  },
  googleButton: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: "#E3F4DF",
    borderWidth: 1,
    borderColor: "#B8DDBC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  googleIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#D8EFD6",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2A7A3B",
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E4630",
  },
  noteText: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: "#4C6B55",
    textAlign: "center",
  },
  appleButton: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  appleIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
  },
  appleIcon: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  appleButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
