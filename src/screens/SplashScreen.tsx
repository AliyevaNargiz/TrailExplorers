import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
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
        <View style={styles.logoCircle}>
          <View style={styles.logoLine} />
          <View style={[styles.logoLine, styles.logoLineAlt]} />
          <Text style={styles.logoText}>LOGO{`\n`}LOADING</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (COLORS: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: isDark ? COLORS.white : COLORS.green,
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
    backgroundColor: isDark ? COLORS.lightGray : "#bfbfbf",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.black,
    textAlign: "center",
  },
  logoLine: {
    position: "absolute",
    width: 150,
    height: 2,
    backgroundColor: COLORS.black,
    transform: [{ rotate: "45deg" }],
  },
  logoLineAlt: {
    transform: [{ rotate: "-45deg" }],
  },
  });
