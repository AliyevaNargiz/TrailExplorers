import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import EcoChallengesScreen from "../screens/EcoChallengesScreen";
import FriendsScreen from "../screens/FriendsScreen";
import Main from "../screens/Main";
import FindTrailScreen from "../screens/FindTrailScreen";
import TrailDetailScreen from "../screens/TrailDetailScreen";
import { MainTabParamList, RootStackParamList } from "./navigationTypes";
import AllTrailsScreen from "../screens/AllTrailsScreen";
import OfflineMapScreen from "../screens/OfflineMapScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import AboutScreen from "../screens/AboutScreen";
import ManageAccountScreen from "../screens/ManageAccountScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import TermsOfUseScreen from "../screens/TermsOfUseScreen";
// import TrailMap from "../screens/TrailMap";
import AddNewTrailBasicScreen from "../screens/AddNewTrailBasicScreen";
import AddNewTrailMediaScreen from "../screens/AddNewTrailMediaScreen";
import RecordTrailScreen from "../screens/RecordTrailScreen";
import TrailSubmissionScreen from "../screens/TrailSubmissionScreen";
import OfflineMapsScreen from "../screens/OfflineMapsScreen";
import MyAddedTrailScreen from "../screens/MyAddedTrailScreen";
import FriendsProfileScreen from "../screens/FriendsProfileScreen";
import GuidesScreen from "../screens/GuidesScreen";
import GuideProfileScreen from "../screens/GuideProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e6e6e6",
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarActiveTintColor: "#111111",
        tabBarInactiveTintColor: "#8b8b8b",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icon-main.png")}
              style={{
                width: 22,
                height: 22,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Eco"
        component={EcoChallengesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icon-eco.png")}
              style={{
                width: 22,
                height: 22,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icon-friends.png")}
              style={{
                width: 22,
                height: 22,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Maps"
        component={OfflineMapsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icon-maps.png")}
              style={{
                width: 22,
                height: 22,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="ManageAccount" component={ManageAccountScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
        <Stack.Screen name="AllTrails" component={AllTrailsScreen} />
        <Stack.Screen name="TrailDetail" component={TrailDetailScreen} />
        <Stack.Screen name="OfflineMap" component={OfflineMapScreen} />
        <Stack.Screen name="OfflineMaps" component={OfflineMapsScreen} />

        <Stack.Screen name="AddNewTrailBasic" component={AddNewTrailBasicScreen} />
        <Stack.Screen name="AddNewTrailMedia" component={AddNewTrailMediaScreen} />
        <Stack.Screen name="RecordTrail" component={RecordTrailScreen} />
        <Stack.Screen name="TrailSubmission" component={TrailSubmissionScreen} />
        <Stack.Screen name="MyAddedTrail" component={MyAddedTrailScreen} />
        <Stack.Screen name="FriendProfile" component={FriendsProfileScreen} />
        <Stack.Screen name="Guides" component={GuidesScreen} />
        <Stack.Screen name="GuideProfile" component={GuideProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { ThemeProvider } from "../theme/themeContext";

export default function Navigation() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
