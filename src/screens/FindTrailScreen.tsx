import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { COLORS } from "../theme/colors";

const filters = ["Location", "Duration", "Difficulty level"] as const;
const cards = [
  {
    id: "qaranohur",
    title: "Qaranohur",
    location: "Ismayilli, Talistan village",
    rating: "4.3",
    likes: "52",
    image: require("../../assets/qaranohur.png"),
  },
  {
    id: "gurgur",
    title: "Gurgur waterfall",
    location: "Quba, Griz",
    rating: "4.3",
    likes: "52",
    image: require("../../assets/gurgur.png"),
  },
  {
    id: "shamakhi",
    title: "Shamakhi",
    location: "Shamakhi, Demirchi village",
    rating: "4.3",
    likes: "52",
    image: require("../../assets/shamakhi.png"),
  },
];

export default function FindTrailScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.burger}>
          <Image
            source={require("../../assets/menu.png")}
            style={styles.iconImage}
          />
        </View>
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

      <Text style={styles.title}>FIND YOUR TRAIL</Text>

      <View style={styles.filtersRow}>
        {filters.map((filter) => (
          <View key={filter} style={styles.filter}>
            <Text style={styles.filterLabel}>{filter}</Text>
            <View style={styles.select}>
              <Text style={styles.selectText}>choose option</Text>
              <Text style={styles.selectCaret}>˅</Text>
            </View>
          </View>
        ))}
        <Pressable style={styles.searchButton}>
          <Text style={styles.searchIcon}>Q</Text>
        </Pressable>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.heart}>❤</Text>
                  <Text style={styles.likes}>{item.likes}</Text>
                </View>
              </View>
              <Text style={styles.cardLocation}>
                <Text style={styles.pin}>● </Text>
                {item.location}
              </Text>
              <Text style={styles.cardDesc}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>⏱ 4 hours of hike</Text>
                <Text style={styles.metaText}>📍 7 km</Text>
                <Text style={styles.metaText}>⛰ Hard</Text>
                <Text style={styles.metaText}>🗺 Offline map available</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  burger: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
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
  title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.black,
  },
  filtersRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  filter: {
    flex: 1,
    gap: 6,
  },
  filterLabel: {
    fontSize: 10,
    color: COLORS.black,
    fontWeight: "600",
  },
  select: {
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 9,
    color: COLORS.grayText,
  },
  selectCaret: {
    fontSize: 10,
    color: COLORS.grayText,
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  list: {
    paddingVertical: 14,
    gap: 12,
    paddingBottom: 30,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 18,
    padding: 12,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  star: {
    color: COLORS.accent,
    fontSize: 10,
  },
  ratingText: {
    fontSize: 10,
    color: COLORS.black,
  },
  heart: {
    color: "#e34949",
    fontSize: 9,
  },
  likes: {
    fontSize: 9,
    color: COLORS.black,
  },
  cardLocation: {
    fontSize: 9,
    color: COLORS.grayText,
  },
  pin: {
    color: "#e34949",
  },
  cardDesc: {
    fontSize: 9,
    color: COLORS.grayText,
    lineHeight: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaText: {
    fontSize: 8,
    color: COLORS.grayText,
  },
});
