import React from "react";
import { TopIconRow } from "./components/TopIconRow";
import { ProgressCard } from "./components/ProgressCard";
import { SectionHeader } from "./components/SectionHeader";
import { TrailCard } from "./components/TrailCard";
import { GuidesRow } from "./components/GuidesRow";
import { BottomTabBar, TabId } from "./components/BottomTabBar";
import qaranohurImage from "./assets/trails/qaranohur.jpg";
import shamakhiImage from "./assets/trails/shamakhi.jpeg";
import gurgurImage from "./assets/trails/gurgur-waterfall.jpeg";

type HomeScreenProps = {
  onOpenFindTrail: () => void;
  onSelectTab: (id: TabId) => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenFindTrail,
  onSelectTab,
}) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white text-black">
      {/* Phone safe-area container */}
      <div className="flex w-full max-w-[420px] flex-col px-6 pt-4 pb-6">
        {/* Top nav row */}
        <TopIconRow onSearchClick={onOpenFindTrail} />

        {/* Greeting */}
        <header className="mb-5">
          <h1 className="text-2xl font-bold tracking-wide text-black">
            HEY NARA!
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Are you ready for your next adventure?
          </p>
        </header>

        {/* Progress card */}
        <ProgressCard />

        {/* Discover new trails header */}
        <div className="mb-3">
          <SectionHeader
            title="DISCOVER NEW TRAILS"
            subtitle="Recommended specially for you"
            actionText="view all"
            onActionClick={onOpenFindTrail}
          />
        </div>

        {/* Trail cards row */}
        <div className="mb-6 flex gap-3">
          <TrailCard
            name="Qaranohur"
            distance="2.5 km away"
            rating="4.3"
            imageSrc={qaranohurImage}
            imageAlt="Aerial view of a dark green lake surrounded by trees"
          />
          <TrailCard
            name="Shamakhi"
            distance="6.5 km away"
            rating="4.2"
            imageSrc={shamakhiImage}
            imageAlt="Mountain landscape with clouds"
          />
          <TrailCard
            name="Gurgur Waterfall"
            distance="3.5 km away"
            rating="4.4"
            imageSrc={gurgurImage}
            imageAlt="Icy waterfall / frozen cascade"
          />
        </div>

        {/* Guides section */}
        <section aria-labelledby="guides-heading">
          <div className="mb-1">
            <SectionHeader
              title="MEET PROFESSIONAL GUIDES"
              actionText="view all"
              actionAlignBottom={false}
            />
          </div>
          <p
            id="guides-heading"
            className="mt-1 text-xs text-gray-400"
          >
            Our partner tour agencies and local guides will make your hiking
            experience more comfortable and easy!
          </p>
          <GuidesRow />
        </section>

        {/* Spacer to push bottom bar to bottom when tall screens */}
        <div className="flex-1" />

        {/* Bottom tab bar */}
        <BottomTabBar activeTabId="main" onSelectTab={onSelectTab} />
      </div>
    </div>
  );
};


