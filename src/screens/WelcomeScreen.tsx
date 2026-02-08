import React from "react";
import { View, Text, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 16 }}>
      <Text style={{ fontSize: 34, fontWeight: "800" }}>TrailExplorers</Text>
      <Text style={{ fontSize: 16, opacity: 0.7 }}>
        Find hiking trails, save favorites, and explore nature.
      </Text>

      <Pressable
        onPress={() => navigation.navigate("Login")}
        style={{
          height: 52,
          borderRadius: 14,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Continue</Text>
      </Pressable>

      {/* Temporary shortcut for testing */}
      <Pressable
        onPress={() => navigation.replace("Main")}
        style={{ height: 52, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Explain later, go to app</Text>
      </Pressable>
    </View>
  );
}
