// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Pressable,
//   ScrollView,
//   Alert,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../app/navigationTypes";
// // import { COLORS } from "../theme/colors";
// import { type ThemeColors, useAppTheme } from "../theme/themeContext";
// import { SafeAreaView } from "react-native-safe-area-context";

// type Props = NativeStackScreenProps<RootStackParamList, "AddNewTrailBasic">;

// export default function AddNewTrailBasicScreen({ navigation }: Props) {
//   const { colors: COLORS } = useAppTheme();
//   const styles = createStyles(COLORS);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [region, setRegion] = useState("");
//   const [village, setVillage] = useState("");
//   const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "">("");
//   const [features, setFeatures] = useState("");

//   const handleNext = () => {
//     if (!name.trim() || !description.trim() || !region.trim() || !village.trim() || !difficulty) {
//       Alert.alert("Missing information", "Please fill in all required fields.");
//       return;
//     }

//     navigation.navigate("AddNewTrailMedia", {
//       draft: {
//         name: name.trim(),
//         description: description.trim(),
//         region: region.trim(),
//         village: village.trim(),
//         difficulty,
//         features: features
//           .split(",")
//           .map((item) => item.trim())
//           .filter(Boolean),
//       },
//     });
//   };

//  return (
//   <SafeAreaView style={styles.safeArea}>
//     <KeyboardAvoidingView
//       style={styles.keyboard}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <ScrollView
//         style={styles.container}
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.title}>Add New Trail</Text>
//         <Text style={styles.subtitle}>Basic trail information</Text>

//         <Text style={styles.label}>Trail name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter trail name"
//           value={name}
//           onChangeText={setName}
//           placeholderTextColor={COLORS.grayText}
//         />

//         <Text style={styles.label}>Description</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Describe the trail"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//           placeholderTextColor={COLORS.grayText}
//         />

//         <Text style={styles.label}>Region</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter region"
//           value={region}
//           onChangeText={setRegion}
//           placeholderTextColor={COLORS.grayText}
//         />

//         <Text style={styles.label}>Village</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter village"
//           value={village}
//           onChangeText={setVillage}
//           placeholderTextColor={COLORS.grayText}
//         />

//         <Text style={styles.label}>Difficulty</Text>
//         <View style={styles.row}>
//           {["Easy", "Medium", "Hard"].map((item) => {
//             const selected = difficulty === item;
//             return (
//               <Pressable
//                 key={item}
//                 style={[styles.pill, selected && styles.pillSelected]}
//                 onPress={() => setDifficulty(item as "Easy" | "Medium" | "Hard")}
//               >
//                 <Text
//                   style={[styles.pillText, selected && styles.pillTextSelected]}
//                 >
//                   {item}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </View>

//         <Text style={styles.label}>Features</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="forest, lake, picnic area"
//           value={features}
//           onChangeText={setFeatures}
//           placeholderTextColor={COLORS.grayText}
//         />

//         <Pressable style={styles.button} onPress={handleNext}>
//           <Text style={styles.buttonText}>Next</Text>
//         </Pressable>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   </SafeAreaView>
// );
// }

// const createStyles = (COLORS: ThemeColors) =>
// StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   keyboard: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   content: {
//     paddingHorizontal: 24,
//     paddingTop: 8,
//     paddingBottom: 40,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: COLORS.black,
//   },
//   subtitle: {
//     marginTop: 6,
//     fontSize: 14,
//     color: COLORS.grayText,
//   },
//   label: {
//     marginTop: 16,
//     marginBottom: 8,
//     fontSize: 13,
//     fontWeight: "700",
//     color: COLORS.black,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 14,
//     backgroundColor: COLORS.white,
//   },
//   textArea: {
//     minHeight: 110,
//     textAlignVertical: "top",
//   },
//   row: {
//     flexDirection: "row",
//     gap: 10,
//     flexWrap: "wrap",
//   },
//   pill: {
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 20,
//     backgroundColor: COLORS.lightGray,
//   },
//   pillSelected: {
//     backgroundColor: COLORS.green,
//   },
//   pillText: {
//     color: COLORS.black,
//     fontWeight: "600",
//   },
//   pillTextSelected: {
//     color: COLORS.white,
//   },
//   button: {
//     marginTop: 28,
//     marginBottom: 8,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: COLORS.green,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontWeight: "700",
//     fontSize: 14,
//   },
// });

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Pressable,
//   ScrollView,
//   Alert,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../app/navigationTypes";
// import { type ThemeColors, useAppTheme } from "../theme/themeContext";
// import { SafeAreaView } from "react-native-safe-area-context";

// type Props = NativeStackScreenProps<RootStackParamList, "AddNewTrailBasic">;
// type Difficulty = "Easy" | "Medium" | "Hard" | "";

// export default function AddNewTrailBasicScreen({ navigation }: Props) {
//   const { colors: COLORS } = useAppTheme();
//   const styles = createStyles(COLORS);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [region, setRegion] = useState("");
//   const [village, setVillage] = useState("");
//   const [difficulty, setDifficulty] = useState<Difficulty>("");
//   const [features, setFeatures] = useState("");

//   const handleNext = () => {
//     if (
//       !name.trim() ||
//       !description.trim() ||
//       !region.trim() ||
//       !village.trim() ||
//       !difficulty
//     ) {
//       Alert.alert("Missing information", "Please fill in all required fields.");
//       return;
//     }

//     navigation.navigate("AddNewTrailMedia", {
//       draft: {
//         name: name.trim(),
//         description: description.trim(),
//         region: region.trim(),
//         village: village.trim(),
//         difficulty,
//         features: features
//           .split(",")
//           .map((item) => item.trim())
//           .filter(Boolean),
//       },
//     });
//   };

//   const difficulties: Exclude<Difficulty, "">[] = ["Easy", "Medium", "Hard"];

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         style={styles.keyboard}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           style={styles.container}
//           contentContainerStyle={styles.content}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <Text style={styles.title}>ADD NEW TRAIL</Text>
//           <Text style={styles.subtitle}>Basic trail information</Text>

//           <Text style={styles.label}>Trail name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter trail name"
//             value={name}
//             onChangeText={setName}
//             placeholderTextColor={COLORS.grayText}
//           />

//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Describe the trail"
//             value={description}
//             onChangeText={setDescription}
//             multiline
//             placeholderTextColor={COLORS.grayText}
//           />

//           <Text style={styles.label}>Region</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter region"
//             value={region}
//             onChangeText={setRegion}
//             placeholderTextColor={COLORS.grayText}
//           />

//           <Text style={styles.label}>Village</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter village"
//             value={village}
//             onChangeText={setVillage}
//             placeholderTextColor={COLORS.grayText}
//           />

//           <Text style={styles.label}>Difficulty</Text>
//           <View style={styles.chipsRow}>
//             {difficulties.map((item) => {
//               const selected = difficulty === item;
//               return (
//                 <Pressable
//                   key={item}
//                   onPress={() => setDifficulty(item)}
//                   style={[styles.chip, selected && styles.chipSelected]}
//                 >
//                   <Text
//                     style={[styles.chipText, selected && styles.chipTextSelected]}
//                   >
//                     {item}
//                   </Text>
//                 </Pressable>
//               );
//             })}
//           </View>

//           <Text style={styles.label}>Features</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="forest, lake, picnic area"
//             value={features}
//             onChangeText={setFeatures}
//             placeholderTextColor={COLORS.grayText}
//           />

//           <Pressable style={styles.nextButton} onPress={handleNext}>
//             <Text style={styles.nextButtonText}>Next</Text>
//           </Pressable>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const createStyles = (COLORS: ThemeColors) =>
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor: "#F6F6F3",
//     },
//     keyboard: {
//       flex: 1,
//     },
//     container: {
//       flex: 1,
//       backgroundColor: "#F6F6F3",
//     },
//     content: {
//       paddingHorizontal: 22,
//       paddingTop: 10,
//       paddingBottom: 40,
//     },
//     title: {
//       fontSize: 30,
//       fontWeight: "800",
//       color: "#111111",
//       marginTop: 8,
//       letterSpacing: 0.3,
//     },
//     subtitle: {
//       marginTop: 4,
//       marginBottom: 18,
//       fontSize: 13,
//       color: "#8D8D8D",
//     },
//     label: {
//       marginTop: 14,
//       marginBottom: 7,
//       fontSize: 12,
//       fontWeight: "700",
//       color: "#111111",
//     },
//     input: {
//       minHeight: 46,
//       borderWidth: 1,
//       borderColor: "#DDDDDD",
//       borderRadius: 12,
//       paddingHorizontal: 14,
//       paddingVertical: 12,
//       fontSize: 13,
//       color: "#111111",
//       backgroundColor: "#FAFAF8",
//     },
//     textArea: {
//       minHeight: 104,
//       textAlignVertical: "top",
//     },
//     chipsRow: {
//       flexDirection: "row",
//       alignItems: "center",
//       gap: 10,
//       marginTop: 2,
//     },
//     chip: {
//       paddingHorizontal: 13,
//       paddingVertical: 8,
//       borderRadius: 18,
//       backgroundColor: "#ECECE8",
//       borderWidth: 1,
//       borderColor: "#ECECE8",
//     },
//     chipSelected: {
//       backgroundColor: "#DDEBD8",
//       borderColor: "#5B9564",
//     },
//     chipText: {
//       fontSize: 12,
//       fontWeight: "500",
//       color: "#222222",
//     },
//     chipTextSelected: {
//       color: "#2E6B3C",
//       fontWeight: "700",
//     },
//     nextButton: {
//       marginTop: 26,
//       height: 50,
//       borderRadius: 25,
//       backgroundColor: "#5B9564",
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     nextButtonText: {
//       color: "#FFFFFF",
//       fontWeight: "700",
//       fontSize: 14,
//     },
//   });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";

type Props = NativeStackScreenProps<RootStackParamList, "AddNewTrailBasic">;
type Difficulty = "Extra Easy" | "Easy" | "Medium" | "Medium Hard" | "Hard" | "Extra Hard" | "";

export default function AddNewTrailBasicScreen({ navigation }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [village, setVillage] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("");
  const [features, setFeatures] = useState("");

  const [showCities, setShowCities] = useState(false);

const cities = ["Quba", "Qəbələ", "Gəncə", "İsmayıllı"];

  const difficulties: Exclude<Difficulty, "">[] = [
    "Extra Easy",
    "Easy",
    "Medium",
    "Medium Hard",
    "Hard",
    "Extra Hard",
  ];

  const handleNext = () => {
    if (
      !name.trim() ||
      !description.trim() ||
      !region.trim() ||
      !village.trim() ||
      !difficulty
    ) {
      Alert.alert("Missing information", "Please fill in all required fields.");
      return;
    }

    navigation.navigate("AddNewTrailMedia", {
      draft: {
        name: name.trim(),
        description: description.trim(),
        region: region.trim(),
        village: village.trim(),
        difficulty: difficulty === "Extra Easy" ? "Easy" : difficulty === "Medium Hard" ? "Medium" : difficulty === "Extra Hard" ? "Hard" : difficulty,
        features: features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screen}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topBar}>
              <Pressable style={styles.iconButton}>
                <Text style={styles.topIcon}>☰</Text>
              </Pressable>
            </View>

            <Text style={styles.title}>ADD NEW TRAIL</Text>

            <Text style={styles.descriptionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>

            <Text style={styles.sectionTitle}>BASIC TRAIL INFO</Text>

            <View style={styles.twoColumnRow}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Add Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name of the trail"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#B8B8B8"
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Add Description*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Describe the trail"
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor="#B8B8B8"
                />
              </View>
            </View>

            <View style={styles.fieldHalf}>
  <Text style={styles.label}>Add Location*</Text>

  <Pressable
    style={styles.selectInput}
    onPress={() => setShowCities(!showCities)}
  >
    <Text style={styles.selectChevron}>⌄</Text>
    <Text style={region ? styles.selectValue : styles.selectPlaceholder}>
      {region || "Choose the city"}
    </Text>
  </Pressable>

  {showCities && (
    <View style={styles.dropdown}>
      {cities.map((city) => (
        <Pressable
          key={city}
          style={styles.dropdownItem}
          onPress={() => {
            setRegion(city);
            setShowCities(false);
          }}
        >
          <Text style={styles.dropdownText}>{city}</Text>
        </Pressable>
      ))}
    </View>
  )}

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Add Village*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name of the village"
                  value={village}
                  onChangeText={setVillage}
                  placeholderTextColor="#B8B8B8"
                />
              </View>
            </View>

            <Text style={styles.difficultyTitle}>Choose Difficulty Level*</Text>

            <View style={styles.difficultyGrid}>
              {difficulties.map((item) => {
                const selected = difficulty === item;
                return (
                  <Pressable
                    key={item}
                    style={styles.difficultyItem}
                    onPress={() => setDifficulty(item)}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text style={styles.difficultyText}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Add Features & Amenities*</Text>
            <View style={styles.selectInputFull}>
              <Text style={styles.selectChevron}>⌄</Text>
              <TextInput
                style={styles.selectTextInput}
                placeholder="Select all that apply"
                value={features}
                onChangeText={setFeatures}
                placeholderTextColor="#B8B8B8"
              />
            </View>

            <Pressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </ScrollView>

          
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (_COLORS: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#F7F7F4",
    },
    keyboard: {
      flex: 1,
    },
    screen: {
      flex: 1,
      backgroundColor: "#F7F7F4",
    },
    container: {
      flex: 1,
      backgroundColor: "#F7F7F4",
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 2,
      marginBottom: 12,
    },
    iconButton: {
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    topIcon: {
      fontSize: 20,
      color: "#222222",
      fontWeight: "500",
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: "#101010",
      marginBottom: 8,
    },
    descriptionText: {
      fontSize: 11,
      lineHeight: 16,
      color: "#8A8A8A",
      maxWidth: "92%",
      marginBottom: 22,
    },
    sectionTitle: {
      textAlign: "center",
      fontSize: 13,
      fontWeight: "700",
      color: "#2B2B2B",
      marginBottom: 18,
      letterSpacing: 0.2,
    },
    twoColumnRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
      gap: 12,
    },
    fieldHalf: {
      flex: 1,
    },
    label: {
      fontSize: 11,
      fontWeight: "700",
      color: "#232323",
      marginBottom: 6,
    },
    input: {
      height: 44,
      borderWidth: 1,
      borderColor: "#D9D9D9",
      borderRadius: 8,
      backgroundColor: "#F0F0EC",
      paddingHorizontal: 12,
      fontSize: 11,
      color: "#222222",
    },
    selectInput: {
      height: 44,
      borderWidth: 1,
      borderColor: "#D9D9D9",
      borderRadius: 8,
      backgroundColor: "#F0F0EC",
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    selectInputFull: {
      height: 44,
      borderWidth: 1,
      borderColor: "#D9D9D9",
      borderRadius: 8,
      backgroundColor: "#F0F0EC",
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    selectChevron: {
      fontSize: 14,
      color: "#777777",
      marginRight: 6,
      marginTop: -2,
    },
    selectPlaceholder: {
      fontSize: 11,
      color: "#B8B8B8",
    },
    selectTextInput: {
      flex: 1,
      fontSize: 11,
      color: "#222222",
      paddingVertical: 0,
    },
    difficultyTitle: {
      textAlign: "center",
      fontSize: 11,
      fontWeight: "700",
      color: "#2F2F2F",
      marginTop: 10,
      marginBottom: 12,
    },
    difficultyGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      rowGap: 12,
      columnGap: 20,
      marginBottom: 18,
    },
    difficultyItem: {
      width: "28%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuter: {
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "#C6C6C6",
      backgroundColor: "#F7F7F4",
      marginRight: 6,
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: {
      borderColor: "#5C995F",
    },
    radioInner: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: "#5C995F",
    },
    difficultyText: {
      fontSize: 10.5,
      color: "#3A3A3A",
    },
    nextButton: {
      alignSelf: "center",
      marginTop: 20,
      width: 120,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#58A06A",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    nextButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },
    bottomTabBar: {
      borderTopWidth: 1,
      borderTopColor: "#D9D9D9",
      backgroundColor: "#F7F7F4",
      paddingTop: 10,
      paddingBottom: 12,
      paddingHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-end",
    },
    tabItem: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 62,
    },
    tabIcon: {
      fontSize: 24,
      color: "#111111",
      marginBottom: 2,
    },
    tabLabel: {
      fontSize: 9,
      color: "#2F2F2F",
      textAlign: "center",
    },

    selectValue: {
  fontSize: 11,
  color: "#222222",
},

dropdown: {
  marginTop: 6,
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#D9D9D9",
  overflow: "hidden",
},

dropdownItem: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#EEEEEE",
},

dropdownText: {
  fontSize: 12,
  color: "#222222",
},
  });