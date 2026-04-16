import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";
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
      //navigation.replace("Main");
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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TrailExplorers</Text>
      <Pressable style={styles.primaryButton} onPress={onGooglePress} disabled={loading || !request}>
        <Text style={styles.primaryText}>{loading ? "Loading..." : "Continue with Google"}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (COLORS: ThemeColors) =>
StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 16, backgroundColor: COLORS.white },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.black, textAlign: "center" },
  primaryButton: { height: 50, borderRadius: 14, backgroundColor: COLORS.black, alignItems: "center", justifyContent: "center" },
  primaryText: { color: COLORS.white, fontSize: 15, fontWeight: "700" },
});
