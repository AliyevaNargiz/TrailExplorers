import React, { useState } from "react";
import { HomeScreen } from "./HomeScreen";
import { FindTrailScreen } from "./FindTrailScreen";
import type { TabId } from "./components/BottomTabBar";

type Screen = "home" | "find";

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("home");

  const handleSelectTab = (id: TabId) => {
    if (id === "main") {
      setScreen("home");
    }
    // Other tabs could navigate to their own screens in the future.
  };

  if (screen === "find") {
    return (
      <FindTrailScreen
        onSearchPress={() => {
          // Filtering can be added later; for now, stay on this screen.
        }}
        onSelectTab={handleSelectTab}
      />
    );
  }

  return (
    <HomeScreen
      onOpenFindTrail={() => setScreen("find")}
      onSelectTab={handleSelectTab}
    />
  );
};

export default App;
