import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacyPolicy">;

const sections = [
  {
    title: "Information we collect",
    body:
      "Trail Explorers may store profile details, saved routes, and settings preferences so the app can personalize your experience.",
  },
  {
    title: "How we use your data",
    body:
      "We use account details to support sign-in, improve recommendations, and help you continue trail activity across sessions.",
  },
  {
    title: "Location and trail activity",
    body:
      "If you allow location access, the app can suggest nearby hikes and improve route-related features while you explore.",
  },
  {
    title: "Your choices",
    body:
      "You can update profile details, manage permissions, and review available settings from the account and settings sections.",
  },
];

export default function PrivacyPolicyScreen({ navigation }: Props) {
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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Your privacy matters</Text>
          <Text style={styles.heroSubtitle}>
            This page gives a simple in-app summary of how information is handled.
          </Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
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
  heroTitle: {
    fontSize: 20,
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
  },
  sectionBody: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.grayText,
  },
  });
