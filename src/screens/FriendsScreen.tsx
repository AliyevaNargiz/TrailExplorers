import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <Text style={styles.subtitle}>
        Coming soon. Invite friends and plan group hikes.
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
