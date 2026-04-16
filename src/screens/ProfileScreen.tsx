import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppTheme, type ThemeColors } from "../theme/themeContext";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [homeRegion, setHomeRegion] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || user.displayName || "");
        setEmail(data.email || user.email || "");
        setPhotoURL(data.photoURL || user.photoURL || "");
        setHomeRegion(data.homeRegion || "");
        setBio(data.bio || "");
      } else {
        setName(user.displayName || "");
        setEmail(user.email || "");
        setPhotoURL(user.photoURL || "");
      }
    };

    loadProfile();
  }, []);

  const initials =
    name?.trim()?.length > 0
      ? name
          .trim()
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.profileCard}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}

          <Text style={styles.name}>{name || "No name"}</Text>
          <Text style={styles.email}>{email || "No email"}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Region</Text>
            <Text style={styles.infoValue}>{homeRegion || "Not set"}</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Bio</Text>
            <Text style={styles.bioText}>{bio || "No bio added yet."}</Text>
          </View>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const createStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    content: {
      paddingHorizontal: 22,
      paddingTop: 16,
      paddingBottom: 32,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.white,
    },
    backText: {
      fontSize: 18,
      color: COLORS.black,
      fontWeight: "700",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: COLORS.black,
    },
    topBarSpacer: {
      width: 36,
    },
    profileCard: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 24,
      paddingVertical: 24,
      paddingHorizontal: 20,
      alignItems: "center",
    },
    avatar: {
      width: 92,
      height: 92,
      borderRadius: 46,
      marginBottom: 14,
    },
    avatarFallback: {
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor: "#556873",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    avatarFallbackText: {
      color: "#fff",
      fontSize: 34,
      fontWeight: "800",
    },
    name: {
      fontSize: 22,
      fontWeight: "800",
      color: COLORS.black,
      textAlign: "center",
    },
    email: {
      marginTop: 6,
      fontSize: 14,
      color: COLORS.grayText,
      textAlign: "center",
    },
    sectionCard: {
      marginTop: 18,
      backgroundColor: COLORS.lightGray,
      borderRadius: 22,
      padding: 18,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.black,
      marginBottom: 14,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    infoLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.grayText,
    },
    infoValue: {
      fontSize: 15,
      fontWeight: "700",
      color: COLORS.black,
    },
    infoDivider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: 14,
    },
    infoBlock: {
      gap: 8,
    },
    bioText: {
      fontSize: 14,
      lineHeight: 20,
      color: COLORS.black,
    },
    primaryButton: {
      marginTop: 20,
      borderRadius: 18,
      backgroundColor: COLORS.darkGreen,
      paddingVertical: 16,
      alignItems: "center",
    },
    primaryButtonText: {
      color: COLORS.white,
      fontSize: 15,
      fontWeight: "800",
    },
  });