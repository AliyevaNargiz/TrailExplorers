import { View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS } from "../theme/colors";

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.subtitle}>
        Save routes, download maps, and track your weekly hiking goals.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Goal</Text>
        <Text style={styles.cardValue}>18 km / 25 km</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>Saved Trails</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>Offline Maps</Text>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>Safety Checklist</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: COLORS.white,
  },
  title: {
    color: COLORS.black,
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.grayText,
    fontSize: 14,
  },
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: "rgba(244,243,239,0.1)",
  },
  cardTitle: {
    color: COLORS.grayText,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  cardValue: {
    marginTop: 8,
    color: COLORS.black,
    fontSize: 20,
    fontWeight: "700",
  },
  progressTrack: {
    marginTop: 14,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(244,243,239,0.1)",
  },
  progressFill: {
    width: "70%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.black,
  },
  section: {
    marginTop: 22,
    gap: 12,
  },
  menuItem: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.lightGray,
  },
  menuText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "600",
  },
});
