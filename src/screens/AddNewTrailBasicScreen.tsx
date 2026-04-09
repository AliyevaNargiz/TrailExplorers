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
import { RootStackParamList } from "../app/navigationTypes";
import { COLORS } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "AddNewTrailBasic">;

export default function AddNewTrailBasicScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [village, setVillage] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "">("");
  const [features, setFeatures] = useState("");

  const handleNext = () => {
    if (!name.trim() || !description.trim() || !region.trim() || !village.trim() || !difficulty) {
      Alert.alert("Missing information", "Please fill in all required fields.");
      return;
    }

    navigation.navigate("AddNewTrailMedia", {
      draft: {
        name: name.trim(),
        description: description.trim(),
        region: region.trim(),
        village: village.trim(),
        difficulty,
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add New Trail</Text>
        <Text style={styles.subtitle}>Basic trail information</Text>

        <Text style={styles.label}>Trail name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter trail name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.grayText}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the trail"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor={COLORS.grayText}
        />

        <Text style={styles.label}>Region</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter region"
          value={region}
          onChangeText={setRegion}
          placeholderTextColor={COLORS.grayText}
        />

        <Text style={styles.label}>Village</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter village"
          value={village}
          onChangeText={setVillage}
          placeholderTextColor={COLORS.grayText}
        />

        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.row}>
          {["Easy", "Medium", "Hard"].map((item) => {
            const selected = difficulty === item;
            return (
              <Pressable
                key={item}
                style={[styles.pill, selected && styles.pillSelected]}
                onPress={() => setDifficulty(item as "Easy" | "Medium" | "Hard")}
              >
                <Text
                  style={[styles.pillText, selected && styles.pillTextSelected]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Features</Text>
        <TextInput
          style={styles.input}
          placeholder="forest, lake, picnic area"
          value={features}
          onChangeText={setFeatures}
          placeholderTextColor={COLORS.grayText}
        />

        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.black,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.grayText,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  pillSelected: {
    backgroundColor: COLORS.green,
  },
  pillText: {
    color: COLORS.black,
    fontWeight: "600",
  },
  pillTextSelected: {
    color: COLORS.white,
  },
  button: {
    marginTop: 28,
    marginBottom: 8,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});