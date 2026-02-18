import React from "react";
import gridIcon from "../assets/icons/grid-main.png";
import recycleIcon from "../assets/icons/recycle.png";
import friendsIcon from "../assets/icons/friends.png";
import mapIcon from "../assets/icons/map.png";

const tabs = [
  { id: "main", label: "Main", icon: gridIcon },
  { id: "eco", label: "Eco-challenges", icon: recycleIcon },
  { id: "friends", label: "Friends", icon: friendsIcon },
  { id: "maps", label: "Maps", icon: mapIcon },
] as const;

type TabId = (typeof tabs)[number]["id"];

type BottomTabBarProps = {
  onSelectTab?: (id: TabId) => void;
  activeTabId?: TabId;
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  onSelectTab,
  activeTabId,
}) => {
  return (
    <nav
      aria-label="Bottom navigation"
      className="mt-6 border-t border-gray-200 pt-2"
    >
      <div className="flex items-center justify-center gap-10">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab?.(tab.id)}
              className={`flex flex-col items-center gap-1 text-[11px] ${
                isActive ? "text-black" : "text-gray-600"
              }`}
            >
              <img
                src={tab.icon}
                alt={tab.label}
                className="h-5 w-5 object-contain"
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export type { TabId };

