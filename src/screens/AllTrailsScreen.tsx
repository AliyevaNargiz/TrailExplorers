import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";
import type { Trail } from "../data/trails";
import { fetchTrails } from "../services/trailsService";

type Props = NativeStackScreenProps<RootStackParamList, "AllTrails">;

const trailImages: Record<string, any> = {
  qaranohur: require("../../assets/qaranohur.png"),
  shamakhi: require("../../assets/shamakhi.png"),
  gurgur: require("../../assets/gurgur.png"),
  goygol: require("../../assets/qaranohur.png"),
  lahic: require("../../assets/shamakhi.png"),
  tufandag: require("../../assets/gurgur.png"),
};

export default function AllTrailsScreen({ navigation }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchTrails();
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setTrails(sorted);
      } catch (e: any) {
        console.log(e);
        Alert.alert("Error", e?.message ?? "Failed to load trails");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>All Trails</Text>
        <View style={{ width: 32 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10, color: COLORS.grayText }}>Loading trails...</Text>
        </View>
      ) : (
        <FlatList
          data={trails}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate("TrailDetail", { id: item.id })}
            >
              <Image
                source={trailImages[item.id] ?? require("../../assets/qaranohur.png")}
                style={styles.cardImage}
              />

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>
                  <Text style={styles.pin}>● </Text>
                  {item.region}
                </Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>⏱ {item.durationHours} h</Text>
                  <Text style={styles.metaText}>📍 {item.distanceKm} km</Text>
                  <Text style={styles.metaText}>⛰ {item.difficulty}</Text>
                </View>

                <Text numberOfLines={2} style={styles.desc}>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={{ marginTop: 20, color: COLORS.grayText }}>
              No trails found in Firestore.
            </Text>
          }
        />
      )}
    </View>
  );
}

const createStyles = (COLORS: ThemeColors) =>
StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 22, paddingTop: 16 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 16, color: COLORS.black },
  headerTitle: { fontSize: 16, fontWeight: "800", color: COLORS.black },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: { flexDirection: "row", gap: 12, backgroundColor: COLORS.lightGray, borderRadius: 18, padding: 12 },
  cardImage: { width: 90, height: 90, borderRadius: 14 },
  cardBody: { flex: 1, gap: 6 },
  cardTitle: { fontSize: 13, fontWeight: "800", color: COLORS.black },
  cardSub: { fontSize: 10, color: COLORS.grayText },
  pin: { color: "#e34949" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaText: { fontSize: 9, color: COLORS.grayText },
  desc: { fontSize: 10, color: COLORS.grayText, lineHeight: 14 },
});