// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Switch,
//   ScrollView,
// } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";

// import { RootStackParamList } from "../app/navigationTypes";
// import { type ThemeColors, useAppTheme } from "../theme/colors";

// type Props = NativeStackScreenProps<RootStackParamList, "Settings">;
// type ThemeMode = "Light" | "Dark";

// const preferenceItems = [
//   {
//     label: "Push Notifications",
//     description: "Get updates about trail activity and hiking reminders.",
//     initialValue: true,
//   },
//   {
//     label: "Offline Trail Sync",
//     description: "Keep saved trails ready even when you lose signal.",
//     initialValue: false,
//   },
//   {
//     label: "Location Access",
//     description: "Use your location to suggest nearby routes.",
//     initialValue: true,
//   },
// ];

// const accountItems = [
//   {
//     label: "Edit Profile",
//     description: "Update your name, photo, and hiking preferences.",
//     route: "EditProfile" as const,
//   },
//   {
//     label: "Change Password",
//     description: "Keep your account secure with a new password.",
//     route: "ChangePassword" as const,
//   },
//   {
//     label: "Manage Account",
//     description: "Review connected sign-in methods and account details.",
//     route: "ManageAccount" as const,
//   },
// ];

// const appInfoItems = [
//   {
//     label: "About Trail Explorers",
//     description: "Learn more about the app and what we are building.",
//     route: "About" as const,
//   },
//   {
//     label: "Privacy Policy",
//     description: "See how your data and trail activity are handled.",
//     route: "PrivacyPolicy" as const,
//   },
//   {
//     label: "Terms of Use",
//     description: "Review the rules and guidelines for using the app.",
//     route: "TermsOfUse" as const,
//   },
// ];

// import { SafeAreaView } from "react-native-safe-area-context";

// export default function SettingsScreen({ navigation }: Props) {
//   const { colors: COLORS, mode: themeMode, setMode } = useAppTheme();
//   const styles = createStyles(COLORS);
//   const [preferences, setPreferences] = useState(
//     preferenceItems.map((item) => ({
//       label: item.label,
//       description: item.description,
//       value: item.initialValue,
//     }))
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.content}
//       >
//         <View style={styles.topBar}>
//           <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
//             <Text style={styles.backText}>←</Text>
//           </Pressable>
//           <Text style={styles.headerTitle}>Settings</Text>
//           <View style={styles.topBarSpacer} />
//         </View>

//         <View style={styles.heroCard}>
//           <Text style={styles.heroEyebrow}>Personalization</Text>
//           <Text style={styles.heroTitle}>Customize your hiking experience</Text>
//           <Text style={styles.heroSubtitle}>
//             Manage appearance, account tools, and app details from one place.
//           </Text>
//         </View>

//         <Text style={styles.sectionTitle}>Appearance</Text>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Theme Preference</Text>
//           <Text style={styles.cardSubtitle}>
//             Choose how Trail Explorers should look while you browse.
//           </Text>

//           <View style={styles.themeSwitcher}>
//             {(["Light", "Dark"] as ThemeMode[]).map((mode) => {
//               const isActive = themeMode === mode;

//               return (
//                 <Pressable
//                   key={mode}
//                   style={[
//                     styles.themeButton,
//                     isActive && styles.themeButtonActive,
//                   ]}
//                   onPress={() => setMode(mode)}
//                 >
//                   <Text
//                     style={[
//                       styles.themeButtonText,
//                       isActive && styles.themeButtonTextActive,
//                     ]}
//                   >
//                     {mode} Mode
//                   </Text>
//                 </Pressable>
//               );
//             })}
//           </View>
//         </View>

//         <Text style={styles.sectionTitle}>Preferences</Text>
//         <View style={styles.card}>
//           {preferences.map((item, index) => (
//             <View
//               key={item.label}
//               style={[
//                 styles.settingRow,
//                 index < preferences.length - 1 && styles.settingRowBorder,
//               ]}
//             >
//               <View style={styles.rowTextWrap}>
//                 <Text style={styles.rowLabel}>{item.label}</Text>
//                 <Text style={styles.rowDescription}>{item.description}</Text>
//               </View>
//               <Switch
//                 value={item.value}
//                 onValueChange={(nextValue) =>
//                   setPreferences((current) =>
//                     current.map((entry) =>
//                       entry.label === item.label
//                         ? { ...entry, value: nextValue }
//                         : entry
//                     )
//                   )
//                 }
//                 trackColor={{ false: "#d7d7d7", true: "#8fba9b" }}
//                 thumbColor={COLORS.white}
//               />
//             </View>
//           ))}
//         </View>

//         <Text style={styles.sectionTitle}>Account</Text>
//         <View style={styles.card}>
//           {accountItems.map((item) => (
//             <Pressable
//               key={item.label}
//               style={styles.actionRow}
//               onPress={() => navigation.navigate(item.route)}
//             >
//               <View style={styles.rowTextWrap}>
//                 <Text style={styles.rowLabel}>{item.label}</Text>
//                 <Text style={styles.rowDescription}>{item.description}</Text>
//               </View>
//               <Text style={styles.rowArrow}>›</Text>
//             </Pressable>
//           ))}
//         </View>

//         <Text style={styles.sectionTitle}>App Info</Text>
//         <View style={styles.card}>
//           {appInfoItems.map((item) => (
//             <Pressable
//               key={item.label}
//               style={styles.actionRow}
//               onPress={() => navigation.navigate(item.route)}
//             >
//               <View style={styles.rowTextWrap}>
//                 <Text style={styles.rowLabel}>{item.label}</Text>
//                 <Text style={styles.rowDescription}>{item.description}</Text>
//               </View>
//               <Text style={styles.rowArrow}>›</Text>
//             </Pressable>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const createStyles = (COLORS: ThemeColors) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//     },
//     content: {
//       paddingHorizontal: 22,
//       paddingTop: 16,
//       paddingBottom: 28,
//     },
//     topBar: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: 20,
//     },
//     backBtn: {
//       width: 32,
//       height: 32,
//       borderRadius: 16,
//       borderWidth: 1,
//       borderColor: COLORS.border,
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     backText: {
//       fontSize: 16,
//       color: COLORS.black,
//     },
//     headerTitle: {
//       fontSize: 18,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     topBarSpacer: {
//       width: 32,
//     },
//     heroCard: {
//       backgroundColor: COLORS.lightGray,
//       borderRadius: 24,
//       padding: 20,
//     },
//     heroEyebrow: {
//       fontSize: 11,
//       fontWeight: "700",
//       letterSpacing: 1,
//       textTransform: "uppercase",
//       color: COLORS.darkGreen,
//     },
//     heroTitle: {
//       marginTop: 8,
//       fontSize: 20,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     heroSubtitle: {
//       marginTop: 8,
//       fontSize: 13,
//       lineHeight: 19,
//       color: COLORS.grayText,
//     },
//     sectionTitle: {
//       marginTop: 22,
//       marginBottom: 10,
//       fontSize: 13,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     card: {
//       backgroundColor: COLORS.lightGray,
//       borderRadius: 22,
//       padding: 16,
//     },
//     cardTitle: {
//       fontSize: 15,
//       fontWeight: "700",
//       color: COLORS.black,
//     },
//     cardSubtitle: {
//       marginTop: 6,
//       fontSize: 12,
//       lineHeight: 18,
//       color: COLORS.grayText,
//     },
//     themeSwitcher: {
//       flexDirection: "row",
//       gap: 10,
//       marginTop: 16,
//     },
//     themeButton: {
//       flex: 1,
//       paddingVertical: 14,
//       borderRadius: 16,
//       borderWidth: 1,
//       borderColor: COLORS.border,
//       backgroundColor: COLORS.white,
//       alignItems: "center",
//     },
//     themeButtonActive: {
//       backgroundColor: COLORS.darkGreen,
//       borderColor: COLORS.darkGreen,
//     },
//     themeButtonText: {
//       fontSize: 13,
//       fontWeight: "700",
//       color: COLORS.black,
//     },
//     themeButtonTextActive: {
//       color: COLORS.white,
//     },
//     settingRow: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       gap: 12,
//       paddingVertical: 12,
//     },
//     settingRowBorder: {
//       borderBottomWidth: 1,
//       borderBottomColor: COLORS.border,
//     },
//     rowTextWrap: {
//       flex: 1,
//       paddingRight: 10,
//     },
//     rowLabel: {
//       fontSize: 15,
//       fontWeight: "700",
//       color: COLORS.black,
//     },
//     rowDescription: {
//       marginTop: 4,
//       fontSize: 12,
//       lineHeight: 18,
//       color: COLORS.grayText,
//     },
//     actionRow: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       gap: 12,
//       paddingVertical: 12,
//     },
//     rowArrow: {
//       fontSize: 24,
//       lineHeight: 24,
//       color: COLORS.grayText,
//     },
//   });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;
type ThemeMode = "Light" | "Dark";

const preferenceItems = [
  {
    label: "Push Notifications",
    description: "Get updates about trail activity and hiking reminders.",
    initialValue: true,
  },
  {
    label: "Offline Trail Sync",
    description: "Keep saved trails ready even when you lose signal.",
    initialValue: false,
  },
  {
    label: "Location Access",
    description: "Use your location to suggest nearby routes.",
    initialValue: true,
  },
];

const accountItems = [
  {
    label: "Edit Profile",
    description: "Update your name, photo, and hiking preferences.",
    route: "Profile" as const,
  },
  {
    label: "Change Password",
    description: "Keep your account secure with a new password.",
    route: "ChangePassword" as const,
  },
  {
    label: "Manage Account",
    description: "Review connected sign-in methods and account details.",
    route: "ManageAccount" as const,
  },
];

const appInfoItems = [
  {
    label: "About Trail Explorers",
    description: "Learn more about the app and what we are building.",
    route: "About" as const,
  },
  {
    label: "Privacy Policy",
    description: "See how your data and trail activity are handled.",
    route: "PrivacyPolicy" as const,
  },
  {
    label: "Terms of Use",
    description: "Review the rules and guidelines for using the app.",
    route: "TermsOfUse" as const,
  },
];

export default function SettingsScreen({ navigation }: Props) {
  const { colors: COLORS, mode: themeMode, setMode } = useAppTheme();
  const styles = createStyles(COLORS);

  const [preferences, setPreferences] = useState(
    preferenceItems.map((item) => ({
      label: item.label,
      description: item.description,
      value: item.initialValue,
    }))
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Personalization</Text>
          <Text style={styles.heroTitle}>Customize your hiking experience</Text>
          <Text style={styles.heroSubtitle}>
            Manage appearance, account tools, and app details from one place.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Theme Preference</Text>
          <Text style={styles.cardSubtitle}>
            Choose how Trail Explorers should look while you browse.
          </Text>

          <View style={styles.themeSwitcher}>
            {(["Light", "Dark"] as ThemeMode[]).map((mode) => {
              const isActive = themeMode === mode;

              return (
                <Pressable
                  key={mode}
                  style={[
                    styles.themeButton,
                    isActive && styles.themeButtonActive,
                  ]}
                  onPress={() => setMode(mode)}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      isActive && styles.themeButtonTextActive,
                    ]}
                  >
                    {mode} Mode
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          {preferences.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.settingRow,
                index < preferences.length - 1 && styles.settingRowBorder,
              ]}
            >
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowDescription}>{item.description}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={(nextValue) =>
                  setPreferences((current) =>
                    current.map((entry) =>
                      entry.label === item.label
                        ? { ...entry, value: nextValue }
                        : entry
                    )
                  )
                }
                trackColor={{ false: "#d7d7d7", true: "#8fba9b" }}
                thumbColor={COLORS.white}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {accountItems.map((item) => (
            <Pressable
              key={item.label}
              style={styles.actionRow}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowDescription}>{item.description}</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.card}>
          {appInfoItems.map((item) => (
            <Pressable
              key={item.label}
              style={styles.actionRow}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowDescription}>{item.description}</Text>
              </View>
              <Text style={styles.rowArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    scrollView: {
      flex: 1,
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
      backgroundColor: COLORS.lightGray,
      borderRadius: 24,
      padding: 20,
    },
    heroEyebrow: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1,
      textTransform: "uppercase",
      color: COLORS.darkGreen,
    },
    heroTitle: {
      marginTop: 8,
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
    sectionTitle: {
      marginTop: 22,
      marginBottom: 10,
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.black,
    },
    card: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 22,
      padding: 16,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: COLORS.black,
    },
    cardSubtitle: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.grayText,
    },
    themeSwitcher: {
      flexDirection: "row",
      gap: 10,
      marginTop: 16,
    },
    themeButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.white,
      alignItems: "center",
    },
    themeButtonActive: {
      backgroundColor: COLORS.darkGreen,
      borderColor: COLORS.darkGreen,
    },
    themeButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.black,
    },
    themeButtonTextActive: {
      color: COLORS.white,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingVertical: 12,
    },
    settingRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    rowTextWrap: {
      flex: 1,
      paddingRight: 10,
    },
    rowLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: COLORS.black,
    },
    rowDescription: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.grayText,
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingVertical: 12,
    },
    rowArrow: {
      fontSize: 24,
      lineHeight: 24,
      color: COLORS.grayText,
    },
  });