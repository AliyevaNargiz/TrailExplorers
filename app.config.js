export default {
  expo: {
    name: "EcoTrail",
    slug: "TrailExplorers",
    owner: "gunelllll",
    scheme: "trailexplorers",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.gunelllll.trailexplorers",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.gunelllll.trailexplorers",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        "foregroundImage": "./assets/logo.png",
        "backgroundColor": "#EAF5EE"
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "FOREGROUND_SERVICE_LOCATION",
      ],
      config: {
        googleMaps: {
          apiKey: "AIzaSyD9qxgBobrzyLmly557bIGzDyKgXswVVLU",
        },
      },
    },
    web: {
      favicon: "./assets/logo.png",
    },
    extra: {
      eas: {
        projectId: "987d5279-5830-45be-8a44-5adc0e6a49a0",
      },
    },
    plugins: [
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.286057375578-76liluki67a516ic4up3ftmov10f4087",
        },
      ],
      "expo-web-browser",
    ],
  },
};