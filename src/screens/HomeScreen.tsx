import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { MainTabParamList, RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";
import type { Trail } from "../data/trails";
import { fetchTrails } from "../services/trailsService";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

// Local images by Firestore doc id.
// (Later you can store imageUrl in Firestore and use it instead.)
const trailImages: Record<string, any> = {
  qaranohur: require("../../assets/qaranohur.png"),
  shamakhi: require("../../assets/shamakhi.png"),
  gurgur: require("../../assets/gurgur.png"),
  goygol: require("../../assets/qaranohur.png"), // fallback
  lahic: require("../../assets/shamakhi.png"),   // fallback
  tufandag: require("../../assets/gurgur.png"),  // fallback
};

export default function HomeScreen({ navigation }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loadingTrails, setLoadingTrails] = useState(true);

  const progressItems = [
    "2.5 km total hike completed",
    "Completed 5 different trails",
    "Completed 7 ECO-Challenges",
    "Added 2 new trail for exploration",
    "“Qobustan” trail in progress",
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingTrails(true);
        const data = await fetchTrails();

        // Optional: stable ordering (so it doesn't shuffle)
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setTrails(sorted);
      } catch (e) {
        console.log(e);
        setTrails([]);
      } finally {
        setLoadingTrails(false);
      }
    };

    load();
  }, []);

  // show only first 3 trails in the Home section
  const discoverCards = useMemo(() => trails.slice(0, 3), [trails]);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <Pressable style={styles.burger} onPress={() => setMenuOpen(true)}>
//           <Image
//             source={require("../../assets/menu.png")}
//             style={styles.iconImage}
//           />
//         </Pressable>
//         <View style={styles.topIcons}>
//           <Image
//             source={require("../../assets/icon-circle.png")}
//             style={styles.iconImage}
//           />
//           <Image
//             source={require("../../assets/icon-plus.png")}
//             style={styles.iconImage}
//           />
//           <Image
//             source={require("../../assets/icon-search.png")}
//             style={styles.iconImage}
//           />
//         </View>
//       </View>

//       <Text style={styles.title}>HEY NARA!</Text>
//       <Text style={styles.subtitle}>Are you ready for your next adventure?</Text>

//       <View style={styles.progressCard}>
//         <Text style={styles.progressTitle}>YOUR PROGRESS</Text>
//         {progressItems.map((item) => (
//           <View key={item} style={styles.progressRow}>
//             <View style={styles.checkCircle}>
//               <Text style={styles.checkMark}>✓</Text>
//             </View>
//             <Text style={styles.progressText}>{item}</Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.sectionHeader}>
//         <View>
//           <Text style={styles.sectionTitle}>DISCOVER NEW TRAILS</Text>
//           <Text style={styles.sectionSubtitle}>
//             Recommended specially for you
//           </Text>
//         </View>

//         <Pressable onPress={() => navigation.navigate("Main")}>
//           <Text style={styles.viewAll}>view all</Text>
//         </Pressable>
//       </View>

//       {loadingTrails ? (
//         <View style={{ paddingVertical: 16 }}>
//           <ActivityIndicator />
//         </View>
//       ) : (
//         <FlatList
//           data={discoverCards}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.trailList}
//           renderItem={({ item }) => (
//             <Pressable
//               style={styles.trailCard}
//               onPress={() => navigation.navigate("TrailDetail", { id: item.id })}
//             >
//               <Image
//                 source={
//                   trailImages[item.id] ?? require("../../assets/qaranohur.png")
//                 }
//                 style={styles.trailImage}
//               />
//               <Text style={styles.trailName}>{item.name}</Text>

//               <Text style={styles.trailMeta}>
//                 <Text style={styles.trailDot}>● </Text>
//                 {item.region}{" "}
//                 <Text style={styles.trailStar}>★</Text> 4.3
//               </Text>
//             </Pressable>
//           )}
//           ListEmptyComponent={
//             <Text style={{ color: COLORS.grayText, fontSize: 12 }}>
//               No trails found in Firestore.
//             </Text>
//           }
//         />
//       )}

//       <View style={styles.sectionHeader}>
//         <View>
//           <Text style={styles.sectionTitle}>MEET PROFESSIONAL GUIDES</Text>
//           <Text style={styles.sectionSubtitle}>
//             Our partner tour agencies and local guides will make your hiking
//             experience more comfortable and easy!
//           </Text>
//         </View>
//         <Text style={styles.viewAll}>view all</Text>
//         <Pressable onPress={() => navigation.navigate("AllTrails")}>
//         <Text style={styles.viewAll}>view all</Text>
//         </Pressable>
//       </View>

//       <View style={styles.guidesRow}>
//         {[0, 1, 2, 3, 4].map((item) => (
//           <View key={item} style={styles.guideAvatar} />
//         ))}
//       </View>

//       {menuOpen ? (
//         <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
//           <Pressable style={styles.menuCard} onPress={() => {}}>
//             <View style={styles.menuHeader}>
//               <Text style={styles.menuBack}>←</Text>
//               <Text style={styles.menuTitle}>MENU</Text>
//             </View>
//             {[
//               { label: "Personal Profile" },
//               { label: "History", icon: require("../../assets/history.png") },
//               { label: "Settings", icon: require("../../assets/setting 1.png") },
//               {
//                 label: "Notifications",
//                 icon: require("../../assets/notification-bell 1.png"),
//               },
//               { label: "Log out", icon: require("../../assets/logout 1.png") },
//             ].map((item) => (
//               <View key={item.label} style={styles.menuRow}>
//                 {item.icon ? (
//                   <Image source={item.icon} style={styles.menuIcon} />
//                 ) : null}
//                 <Text style={styles.menuItem}>{item.label}</Text>
//               </View>
//             ))}
//           </Pressable>
//         </Pressable>
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 22,
//     paddingTop: 16,
//   },
//   topBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 18,
//   },
//   burger: {
//     width: 24,
//     height: 24,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   topIcons: {
//     flexDirection: "row",
//     gap: 10,
//   },
//   iconImage: {
//     width: 22,
//     height: 22,
//     resizeMode: "contain",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: COLORS.black,
//   },
//   subtitle: {
//     color: COLORS.grayText,
//     fontSize: 12,
//     marginTop: 4,
//   },
//   progressCard: {
//     marginTop: 14,
//     backgroundColor: COLORS.lightGray,
//     borderRadius: 16,
//     padding: 14,
//   },
//   progressTitle: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: COLORS.black,
//     marginBottom: 8,
//   },
//   progressRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 6,
//   },
//   checkCircle: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.black,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkMark: {
//     fontSize: 10,
//     marginTop: -1,
//   },
//   progressText: {
//     fontSize: 11,
//     color: COLORS.grayText,
//   },
//   sectionHeader: {
//     marginTop: 18,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 12,
//     alignItems: "flex-end",
//   },
//   sectionTitle: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: COLORS.black,
//   },
//   sectionSubtitle: {
//     fontSize: 10,
//     color: COLORS.grayText,
//   },
//   viewAll: {
//     fontSize: 10,
//     color: COLORS.grayText,
//   },
//   trailList: {
//     paddingVertical: 12,
//     gap: 12,
//   },
//   trailCard: {
//     width: 120,
//   },
//   trailImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 14,
//     backgroundColor: COLORS.lightGray,
//   },
//   trailName: {
//     marginTop: 6,
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   trailMeta: {
//     fontSize: 9,
//     color: COLORS.grayText,
//   },
//   trailDot: {
//     color: "#d23c3c",
//   },
//   trailStar: {
//     color: COLORS.accent,
//   },
//   guidesRow: {
//     marginTop: 12,
//     flexDirection: "row",
//     gap: 12,
//   },
//   guideAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#3b0d0d",
//   },
//   menuOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.08)",
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//     paddingTop: 40,
//     paddingLeft: 12,
//   },
//   menuCard: {
//     width: 180,
//     backgroundColor: COLORS.white,
//     borderRadius: 22,
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     borderWidth: 1,
//     borderColor: COLORS.softBorder,
//   },
//   menuHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 10,
//   },
//   menuBack: {
//     fontSize: 18,
//   },
//   menuTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   menuItem: {
//     fontSize: 12,
//     color: COLORS.grayText,
//   },
//   menuRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 8,
//   },
//   menuIcon: {
//     width: 16,
//     height: 16,
//     resizeMode: "contain",
//   },
// });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topBar}>
            <Pressable style={styles.burger} onPress={() => setMenuOpen(true)}>
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
              <Pressable onPress={() => navigation.navigate("AddNewTrailBasic")}>
  <Image
    source={require("../../assets/icon-plus.png")}
    style={styles.iconImage}
  />
</Pressable>
              <Image
                source={require("../../assets/icon-search.png")}
                style={styles.iconImage}
              />
            </View>
          </View>

          <Text style={styles.title}>HEY NARA!</Text>
          <Text style={styles.subtitle}>
            Are you ready for your next adventure?
          </Text>

          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>YOUR PROGRESS</Text>
            {progressItems.map((item) => (
              <View key={item} style={styles.progressRow}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.progressText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTextWrap}>
              <Text style={styles.sectionTitle}>DISCOVER NEW TRAILS</Text>
              <Text style={styles.sectionSubtitle}>
                Recommended specially for you
              </Text>
            </View>

            <Pressable onPress={() => navigation.navigate("Maps")}>
              <Text style={styles.viewAll}>view all</Text>
            </Pressable>
          </View>

          {loadingTrails ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={discoverCards}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trailList}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.trailCard}
                  onPress={() =>
                    navigation.navigate("TrailDetail", { id: item.id })
                  }
                >
                  <Image
                    source={
                      trailImages[item.id] ??
                      require("../../assets/qaranohur.png")
                    }
                    style={styles.trailImage}
                  />
                  <Text style={styles.trailName}>{item.name}</Text>
                  <Text style={styles.trailMeta}>
                    <Text style={styles.trailDot}>● </Text>
                    {item.region} <Text style={styles.trailStar}>★</Text> 4.3
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No trails found in Firestore.
                </Text>
              }
            />
          )}

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTextWrap}>
              <Text style={styles.sectionTitle}>MEET PROFESSIONAL GUIDES</Text>
              <Text style={styles.sectionSubtitle}>
                Our partner tour agencies and local guides will make your hiking
                experience more comfortable and easy!
              </Text>
            </View>

            <Pressable onPress={() => navigation.navigate("AllTrails")}>
              <Text style={styles.viewAll}>view all</Text>
            </Pressable>
          </View>

          <View style={styles.guidesRow}>
            {[0, 1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.guideAvatar} />
            ))}
          </View>
        </ScrollView>

        {menuOpen ? (
          <Pressable
            style={styles.menuOverlay}
            onPress={() => setMenuOpen(false)}
          >
            <Pressable style={styles.menuCard} onPress={() => {}}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuBack}>←</Text>
                <Text style={styles.menuTitle}>MENU</Text>
              </View>

              {[
                { label: "Personal Profile" },
                { label: "History", icon: require("../../assets/history.png") },
                { label: "Settings", icon: require("../../assets/setting 1.png") },
                {
                  label: "Notifications",
                  icon: require("../../assets/notification-bell 1.png"),
                },
                { label: "Log out", icon: require("../../assets/logout 1.png") },
              ].map((item) => (
                <View key={item.label} style={styles.menuRow}>
                  {item.icon ? (
                    <Image source={item.icon} style={styles.menuIcon} />
                  ) : null}
                  <Text style={styles.menuItem}>{item.label}</Text>
                </View>
              ))}
            </Pressable>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
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
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.black,
  },
  subtitle: {
    color: COLORS.grayText,
    fontSize: 12,
    marginTop: 4,
  },
  progressCard: {
    marginTop: 14,
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 14,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    fontSize: 10,
    marginTop: -1,
  },
  progressText: {
    fontSize: 11,
    color: COLORS.grayText,
    flexShrink: 1,
  },
  sectionHeader: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  sectionTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.black,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: COLORS.grayText,
    marginTop: 2,
    lineHeight: 14,
  },
  viewAll: {
    fontSize: 10,
    color: COLORS.grayText,
    marginTop: 2,
  },
  loaderWrap: {
    paddingVertical: 16,
  },
  trailList: {
    paddingVertical: 12,
    gap: 12,
  },
  trailCard: {
    width: 120,
  },
  trailImage: {
    width: 120,
    height: 120,
    borderRadius: 14,
    backgroundColor: COLORS.lightGray,
  },
  trailName: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.black,
  },
  trailMeta: {
    fontSize: 9,
    color: COLORS.grayText,
  },
  trailDot: {
    color: "#d23c3c",
  },
  trailStar: {
    color: COLORS.accent,
  },
  emptyText: {
    color: COLORS.grayText,
    fontSize: 12,
    paddingVertical: 8,
  },
  guidesRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
    paddingBottom: 8,
  },
  guideAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b0d0d",
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 70,
    paddingLeft: 12,
  },
  menuCard: {
    width: 180,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  menuBack: {
    fontSize: 18,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  menuItem: {
    fontSize: 12,
    color: COLORS.grayText,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  menuIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});
