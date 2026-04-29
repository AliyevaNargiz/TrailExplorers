import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function MapsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🗺️</Text>
          </View>

          <View style={styles.titleGroup}>
            <Text style={styles.title}>Offline Maps</Text>
            <Text style={styles.subtitle}>
              Download trail maps and navigate offline while you explore.
            </Text>
          </View>
        </View>

        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Offline ready</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Route preview</Text>
          </View>
          <View style={styles.tag}> 
            <Text style={styles.tagText}>No signal needed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your map labels</Text>
          <View style={styles.labelList}>
            <View style={styles.labelItem}>
              <Text style={styles.labelItemText}>Mountain trail</Text>
            </View>
            <View style={styles.labelItem}>
              <Text style={styles.labelItemText}>Winter route</Text>
            </View>
            <View style={styles.labelItem}>
              <Text style={styles.labelItemText}>River path</Text>
            </View>
          </View>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>How it works</Text>
          <Text style={styles.noteText}>
            When offline maps are ready, you’ll be able to save trail areas and
            open them without mobile data.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#FAFBF9",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 22,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E7F3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 32,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.grayText,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#ECEFF8",
  },
  tagText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: "700",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 12,
  },
  labelList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  labelItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  labelItemText: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: "700",
  },
  noteBox: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.black,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.grayText,
    lineHeight: 20,
  },
});
