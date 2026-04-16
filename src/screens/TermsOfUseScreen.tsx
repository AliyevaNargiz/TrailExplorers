import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "TermsOfUse">;

const terms = [
  "Use the app responsibly and follow local trail rules and safety guidance.",
  "Trail details may change over time, so hikers should verify conditions before travel.",
  "Users are responsible for the content they submit, including trail notes and profile details.",
  "Access to features may change as the app evolves and new tools are released.",
];

export default function TermsOfUseScreen({ navigation }: Props) {
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
          <Text style={styles.headerTitle}>Terms of Use</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Simple usage guidelines</Text>
          <Text style={styles.heroSubtitle}>
            These terms explain the basic expectations for using Trail Explorers.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          {terms.map((term, index) => (
            <View key={term} style={styles.termRow}>
              <Text style={styles.termNumber}>{index + 1}.</Text>
              <Text style={styles.termText}>{term}</Text>
            </View>
          ))}
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
    gap: 14,
  },
  termRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  termNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.darkGreen,
  },
  termText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.grayText,
  },
  });