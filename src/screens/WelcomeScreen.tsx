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
        <View style={styles.content}>
          <Text style={styles.title}>HEY TRAVELER!</Text>
          <Text style={styles.subtitle}>
            Welcome back! Please choose your sign in method.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => navigation.replace("Main")}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.apple}></Text>
            </View>
            <Text style={styles.buttonText}>Sign in with Apple</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>Exploration is just a click away!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 36,
  },
  content: {
    marginTop: 120,
    alignItems: "center",

    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: COLORS.grayText,
    marginBottom: 18,
  },
  button: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    fontSize: 14,
    fontWeight: "800",
    color: "#4285F4",
  },
  apple: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: -1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.black,
  },
  footer: {
    textAlign: "center",
    color: COLORS.black,
    fontSize: 11,
  },
});
