import React from "react";
import { TopIconRow } from "./components/TopIconRow";
import { Title } from "./components/Title";
import { FiltersRow } from "./components/FiltersRow";
import { TrailCard } from "./components/TrailCard";
import { BottomTabBar, TabId } from "./components/BottomTabBar";
import qaranohurImage from "./assets/trails/qaranohur.jpg";
import gurgurImage from "./assets/trails/gurgur-waterfall.jpeg";
import shamakhiImage from "./assets/trails/shamakhi.jpeg";

type FindTrailScreenProps = {
  onSearchPress?: () => void;
  onSelectTab: (id: TabId) => void;
};

const DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const FindTrailScreen: React.FC<FindTrailScreenProps> = ({
  onSearchPress,
  onSelectTab,
}) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white text-black">
      <div className="flex w-full max-w-[420px] flex-col px-6 pt-4 pb-6">
        <TopIconRow onSearchClick={onSearchPress} />

        <Title text="FIND YOUR TRAIL" />

        <FiltersRow />

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black">
              OUR TOP TRAILS
            </p>
            <span className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              Trail hits
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            Crowd‑favorite routes that hikers are loving right now.
          </p>
        </div>

        <div className="space-y-4">
          <TrailCard
            variant="detailed"
            name="Qaranohur"
            rating="4.3"
            likes="52"
            distance="7 km"
            location="Ismayilli, Talistan village"
            description={DESCRIPTION}
            imageSrc={qaranohurImage}
            imageAlt="Aerial view of a dark green lake surrounded by forest"
          />

          <TrailCard
            variant="detailed"
            name="Gurgur waterfall"
            rating="4.3"
            likes="52"
            distance="7 km"
            location="Quba, Griz"
            description={DESCRIPTION}
            imageSrc={gurgurImage}
            imageAlt="Gurgur waterfall in winter"
          />

          <TrailCard
            variant="detailed"
            name="Shamakhi"
            rating="4.3"
            likes="52"
            distance="7 km"
            location="Shamakhi, Demirchi village"
            description={DESCRIPTION}
            imageSrc={shamakhiImage}
            imageAlt="Shamakhi mountain landscape"
          />
        </div>

        <div className="flex-1" />

        <BottomTabBar activeTabId="main" onSelectTab={onSelectTab} />
      </div>
    </div>
  );
};


