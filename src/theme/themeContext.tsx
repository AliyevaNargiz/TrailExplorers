import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppThemeMode = "Light" | "Dark";

export const lightColors = {
  white: "#ffffff",
  black: "#111111",
  grayText: "#6f6f6f",
  lightGray: "#f3f3f3",
  border: "#d9d9d9",
  softBorder: "#e6e6e6",
  green: "#4d8b60",
  darkGreen: "#3f744f",
  accent: "#f5b400",
};

export const darkColors = {
  white: "#11161a",
  black: "#f4f5f6",
  grayText: "#adb6bd",
  lightGray: "#1b2329",
  border: "#2b353d",
  softBorder: "#39444d",
  green: "#6aa67d",
  darkGreen: "#88c199",
  accent: "#f5c24d",
};

export type ThemeColors = typeof lightColors;

type ThemeContextValue = {
  colors: ThemeColors;
  mode: AppThemeMode;
  isDark: boolean;
  setMode: (mode: AppThemeMode) => void;
  ready: boolean;
};

const STORAGE_KEY = "trail-explorers-theme-mode";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const COLORS = lightColors;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppThemeMode>("Light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadStoredTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted && (savedMode === "Light" || savedMode === "Dark")) {
          setModeState(savedMode);
        }
      } catch (error) {
        console.log("Failed to load theme mode", error);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    loadStoredTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const setMode = useCallback((nextMode: AppThemeMode) => {
    setModeState(nextMode);
    AsyncStorage.setItem(STORAGE_KEY, nextMode).catch((error) => {
      console.log("Failed to save theme mode", error);
    });
  }, []);

  const value = useMemo(
    () => ({
      colors: mode === "Dark" ? darkColors : lightColors,
      mode,
      isDark: mode === "Dark",
      setMode,
      ready,
    }),
    [mode, ready, setMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider.");
  }

  return context;
}
