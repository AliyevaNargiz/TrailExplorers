import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../app/navigationTypes";
import { type ThemeColors, useAppTheme } from "../theme/colors";
import { useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

export default function EditProfileScreen({ navigation }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
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
        setHomeRegion(data.homeRegion || "");
        setBio(data.bio || "");
      } else {
        setName(user.displayName || "");
        setEmail(user.email || "");
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Not signed in", "Please sign in again.");
      return;
    }

    const ref = doc(db, "users", user.uid);

    await setDoc(
      ref,
      {
        name,
        email: user.email ?? email,
        photoURL: user.photoURL ?? "",
        homeRegion,
        bio,
      },
      { merge: true }
    );

    Alert.alert("Success", "Profile updated successfully.");
  } catch (error) {
    console.log("Save profile error:", error);
    Alert.alert("Error", "Failed to save profile.");
  }
};

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
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Your public hiking profile</Text>
          <Text style={styles.heroSubtitle}>
            Update how your account appears to guides, friends, and trail groups.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            style={styles.input}
            placeholderTextColor="#9a9a9a"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            style={styles.input}
            placeholderTextColor="#9a9a9a"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
          />

          <Text style={styles.label}>Home Region</Text>
          <TextInput
            value={homeRegion}
            onChangeText={setHomeRegion}
            placeholder="Preferred region"
            style={styles.input}
            placeholderTextColor="#9a9a9a"
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell other hikers a little about yourself"
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#9a9a9a"
            multiline
            textAlignVertical="top"
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleSave}>
  <Text style={styles.primaryButtonText}>Save Changes</Text>
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
    backgroundColor: "#eef4ef",
    borderRadius: 24,
    padding: 20,
  },
  heroTitle: {
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
  formCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 22,
    backgroundColor: COLORS.lightGray,
  },
  label: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
  },
  input: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.black,
  },
  textArea: {
    minHeight: 110,
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
    fontSize: 14,
    fontWeight: "800",
  },
  });