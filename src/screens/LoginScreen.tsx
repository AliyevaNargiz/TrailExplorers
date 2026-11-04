import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/colors";
import { useGoogleSignIn } from "../services/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);
  const [loading, setLoading] = React.useState(false);
  const { request, signIn } = useGoogleSignIn();

  const onGooglePress = async () => {
    if (!request) {
      Alert.alert("Please wait", "Google sign-in is still initializing.");
      return;
    }

    try {
      setLoading(true);
      const user = await signIn();
      console.log("Logged in:", user.uid);
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (e: any) {
      console.log(e);
      Alert.alert("Login Failed", e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign in to EcoTrail</Text>
          <Text style={styles.subtitle}>
            Continue with Google to access your saved trails, offline maps, and
            eco-friendly adventure tools.
          </Text>

          <Pressable
            style={[styles.primaryButton, loading || !request ? styles.disabledButton : null]}
            onPress={onGooglePress}
            disabled={loading || !request}
          >
            <Text style={styles.primaryText}>
              {loading ? "Signing in..." : "Continue with Google"}
            </Text>
          </Pressable>

          <Text style={styles.noteText}>
            One tap sign-in secures your profile and keeps your trail progress
            synced across devices.
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: "#E8F6EC",
    },
    screen: {
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
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 22,
      color: "#4C6B55",
      marginBottom: 28,
      textAlign: "center",
    },
    primaryButton: {
      height: 52,
      borderRadius: 16,
      backgroundColor: "#2F7A42",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    disabledButton: {
      backgroundColor: "#A8C5A3",
    },
    primaryText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },
    noteText: {
      fontSize: 13,
      lineHeight: 20,
      color: "#4C6B55",
      textAlign: "center",
    },
  });
