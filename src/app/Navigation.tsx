import {
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from "@react-navigation/native";
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
import EditProfileScreen from "../screens/EditProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import AboutScreen from "../screens/AboutScreen";
import ManageAccountScreen from "../screens/ManageAccountScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import TermsOfUseScreen from "../screens/TermsOfUseScreen";
// import TrailMap from "../screens/TrailMap";
import AddNewTrailBasicScreen from "../screens/AddNewTrailBasicScreen";
import AddNewTrailMediaScreen from "../screens/AddNewTrailMediaScreen";
import TrailSubmissionScreen from "../screens/TrailSubmissionScreen";
import { ThemeProvider, useAppTheme } from "../theme/colors";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.softBorder,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.grayText,
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
        component={FindTrailScreen}
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
  const { colors } = useAppTheme();

  const navigationTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.green,
      background: colors.white,
      card: colors.white,
      text: colors.black,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="ManageAccount" component={ManageAccountScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
        <Stack.Screen name="AllTrails" component={AllTrailsScreen} />
        <Stack.Screen name="TrailDetail" component={TrailDetailScreen} />
        <Stack.Screen name="OfflineMap" component={OfflineMapScreen} />
        
        <Stack.Screen name="AddNewTrailBasic" component={AddNewTrailBasicScreen} />
        <Stack.Screen name="AddNewTrailMedia" component={AddNewTrailMediaScreen} />
        <Stack.Screen name="TrailSubmission" component={TrailSubmissionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function Navigation() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
