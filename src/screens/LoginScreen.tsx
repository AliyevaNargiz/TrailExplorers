import React from "react";
import { View, Text, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Sign in</Text>
      <Text style={{ opacity: 0.7 }}>
        For now this is a placeholder. Next we’ll add Google Sign-In.
      </Text>

      <Pressable
        onPress={() => navigation.replace("Main")}
        style={{
          height: 52,
          borderRadius: 14,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
          Continue to App
        </Text>
      </Pressable>
    </View>
  );
}
