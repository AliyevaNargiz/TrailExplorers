import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { Image } from "react-native";
// import { COLORS } from "../theme/colors";
import { type ThemeColors, useAppTheme } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  const { colors: COLORS, isDark } = useAppTheme();
  const styles = createStyles(COLORS, isDark);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        
        {/* LOGO IMAGE */}
        <Image
          source={require("../../assets/logo.png")} // 🔥 adjust if needed
          style={styles.logo}
        />

        {/* OPTIONAL TEXT */}
        <Text style={styles.loadingText}>Loading...</Text>

      </View>
    </SafeAreaView>
  );
}

const createStyles = (COLORS: ThemeColors, isDark: boolean) =>
StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.green,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#bfbfbf",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2a2a2a",
    textAlign: "center",
  },
  logoLine: {
    position: "absolute",
    width: 150,
    height: 2,
    backgroundColor: "#2a2a2a",
    transform: [{ rotate: "45deg" }],
  },
  logoLineAlt: {
    transform: [{ rotate: "-45deg" }],
  },
   logo: {
      width: 180,
      height: 180,
      resizeMode: "contain",
      marginBottom: 20,
    },
    loadingText: {
      fontSize: 14,
      color: "#ffffff",
      fontWeight: "600",
      opacity: 0.8,
    },
});
