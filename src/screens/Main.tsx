import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "../app/navigationTypes";

// Import your tab screens (adjust paths if yours are different)
import HomeScreen from "../screens/HomeScreen";
import EcoScreen from "../screens/EcoChallengesScreen";
import FriendsScreen from "../screens/FriendsScreen";
import MapsScreen from "../screens/MapsScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Eco" component={EcoScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Maps" component={MapsScreen} />
    </Tab.Navigator>
  );
}