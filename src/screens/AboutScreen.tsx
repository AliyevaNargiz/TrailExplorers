import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

const highlights = [
  "Discover curated hiking trails across different regions.",
  "Track your adventures, eco challenges, and saved routes.",
  "Find inspiration for your next outdoor trip with a cleaner flow.",
];

export default function AboutScreen({ navigation }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>About</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.versionTag}>Trail Explorers v1.0</Text>
          <Text style={styles.heroTitle}>Built for people who love the trail</Text>
          <Text style={styles.heroSubtitle}>
            Trail Explorers helps hikers plan, track, and enjoy outdoor adventures
            with a calm, simple mobile experience.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>What the app offers</Text>
          {highlights.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.infoText}>support@trailexplorers.app</Text>
          
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 16,
    color: COLORS.black,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.black,
  },
  topBarSpacer: {
    width: 32,
  },
  heroCard: {
    backgroundColor: "#eef4ef",
    borderRadius: 24,
    padding: 20,
  },
  versionTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.darkGreen,
  },
  heroTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.black,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.grayText,
  },
  sectionCard: {
    marginTop: 18,
    borderRadius: 22,
    backgroundColor: COLORS.lightGray,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.darkGreen,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.grayText,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.grayText,
    marginTop: 4,
  },
  });
