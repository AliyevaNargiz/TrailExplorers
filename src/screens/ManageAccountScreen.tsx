import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "ManageAccount">;

const connectedMethods = [
  { label: "Email Sign-In", status: "Connected" },
  { label: "Google Account", status: "Not connected" },
  { label: "Phone Number", status: "Not added" },
];

const accountActions = [
  "Review your account email and sign-in method.",
  "Control where trail activity and profile details appear.",
  "Manage future support and recovery options.",
];

export default function ManageAccountScreen({ navigation }: Props) {
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
          <Text style={styles.headerTitle}>Manage Account</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Account overview</Text>
          <Text style={styles.heroSubtitle}>
            Keep your account details organized and make sign-in easier to manage.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Connected methods</Text>
          {connectedMethods.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.row,
                index < connectedMethods.length - 1 && styles.rowBorder,
              ]}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowStatus}>{item.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What you can manage</Text>
          {accountActions.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{item}</Text>
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
  card: {
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e4",
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.black,
  },
  rowStatus: {
    fontSize: 12,
    color: COLORS.darkGreen,
    fontWeight: "700",
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
  });
