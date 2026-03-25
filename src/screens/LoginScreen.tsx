import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>
        This screen is a placeholder. We can connect Google/Apple auth later.
      </Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.replace("Main")}
      >
        <Text style={styles.primaryText}>Continue to App</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grayText,
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
