import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
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

const styles = StyleSheet.create({
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
});
