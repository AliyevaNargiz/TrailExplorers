import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function MapsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maps</Text>
      <Text style={styles.subtitle}>
        Coming soon. Offline maps and route navigation will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.grayText,
    textAlign: "center",
  },
});
