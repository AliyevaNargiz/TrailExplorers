import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";
import { TRAILS } from "../data/trails";

type Props = NativeStackScreenProps<RootStackParamList, "TrailDetail">;

export default function TrailDetailScreen({ navigation, route }: Props) {
  const trail = TRAILS.find((item) => item.id === route.params?.id) ?? TRAILS[0];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/menu.png")}
            style={styles.iconImage}
          />
        </Pressable>
        <View style={styles.topIcons}>
          <Image
            source={require("../../assets/icon-circle.png")}
            style={styles.iconImage}
          />
          <Image
            source={require("../../assets/icon-plus.png")}
            style={styles.iconImage}
          />
          <Image
            source={require("../../assets/icon-search.png")}
            style={styles.iconImage}
          />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{trail.name}</Text>
        <View style={styles.headerMeta}>
          <Text style={styles.pin}>●</Text>
          <Text style={styles.region}>{trail.region}</Text>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>4.3</Text>
          <Text style={styles.heart}>❤</Text>
          <Text style={styles.likes}>52</Text>
        </View>
      </View>

      <View style={styles.galleryRow}>
        <Image
          source={require("../../assets/qaranohur.png")}
          style={styles.galleryLarge}
        />
        <View style={styles.galleryCol}>
          <Image
            source={require("../../assets/shamakhi.png")}
            style={styles.gallerySmall}
          />
          <Image
            source={require("../../assets/gurgur.png")}
            style={styles.gallerySmall}
          />
        </View>
      </View>

      <View style={styles.actionsRow}>
        {["♡", "⤴", "✎", "🔖"].map((item) => (
          <View key={item} style={styles.actionIcon}>
            <Text style={styles.actionText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metricsRow}>
        <Text style={styles.metricPill}>⏱ 4 hours of hike</Text>
        <Text style={styles.metricPill}>📍 7 km</Text>
        <Text style={styles.metricPill}>⛰ Hard</Text>
        <Text style={styles.metricPill}>🗺 Offline map available</Text>
      </View>

      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>

      <Text style={styles.sectionTitle}>Reviews by other travelers</Text>
      <View style={styles.reviewRow}>
        {[
          { name: "Harry", image: require("../../assets/harry.png") },
          { name: "Liana", image: require("../../assets/liana.png") },
          { name: "Agne", image: require("../../assets/agne.png") },
        ].map((review) => (
          <View key={review.name} style={styles.reviewCard}>
            <Image source={review.image} style={styles.reviewAvatar} />
            <Text style={styles.reviewName}>{review.name}</Text>
            <Text style={styles.reviewText}>
              “Some guidance or short feedback.”
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Trail Map</Text>
      <Image source={require("../../assets/map.png")} style={styles.mapImage} />

      <View style={styles.ctaRow}>
        <Pressable style={[styles.ctaButton, styles.ctaLight]}>
          <Text style={styles.ctaDarkText}>Download</Text>
        </Pressable>
        <Pressable style={[styles.ctaButton, styles.ctaDark]}>
          <Text style={styles.ctaLightText}>Navigate</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.white,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
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
  topIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconImage: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  header: {
    alignItems: "center",
    marginTop: 14,
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.black,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pin: {
    color: "#e34949",
    fontSize: 10,
  },
  region: {
    color: COLORS.grayText,
    fontSize: 11,
  },
  star: {
    color: COLORS.accent,
    fontSize: 10,
  },
  rating: {
    fontSize: 10,
  },
  heart: {
    color: "#e34949",
    fontSize: 10,
  },
  likes: {
    fontSize: 10,
  },
  galleryRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
  },
  galleryLarge: {
    width: 170,
    height: 140,
    borderRadius: 16,
  },
  galleryCol: {
    gap: 8,
  },
  gallerySmall: {
    width: 90,
    height: 66,
    borderRadius: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  actionIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 10,
  },
  metricsRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricPill: {
    fontSize: 9,
    color: COLORS.grayText,
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
  },
  description: {
    marginTop: 8,
    color: COLORS.grayText,
    fontSize: 11,
    lineHeight: 16,
  },
  reviewRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  reviewCard: {
    width: 92,
    backgroundColor: COLORS.lightGray,
    borderRadius: 14,
    padding: 8,
    gap: 6,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  reviewName: {
    fontSize: 10,
    fontWeight: "700",
  },
  reviewText: {
    fontSize: 8,
    color: COLORS.grayText,
    lineHeight: 11,
  },
  mapImage: {
    marginTop: 10,
    height: 90,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    width: "100%",
  },
  ctaRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  ctaButton: {
    height: 40,
    minWidth: 110,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaLight: {
    backgroundColor: "#c9d389",
  },
  ctaDark: {
    backgroundColor: COLORS.green,
  },
  ctaDarkText: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: "600",
  },
  ctaLightText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "600",
  },
});
