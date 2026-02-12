"use client";

import { useAppContext, type Screen } from "@/lib/store";
import { Home, Users, Trophy, ClipboardList } from "lucide-react";

const tabs = [
  { id: "home", label: "ホーム", icon: Home, screen: "home" as Screen },
  { id: "roster", label: "選手", icon: Users, screen: "roster" as Screen },
  { id: "lineup", label: "オーダー", icon: ClipboardList, screen: "lineup" as Screen },
  { id: "scores", label: "試合", icon: Trophy, screen: "score-history" as Screen },
];

export function BottomTabs() {
  const { state, navigate } = useAppContext();
  const currentScreen = state.currentScreen;

  // Hide bottom tabs on certain screens
  const hideTabsScreens: Screen[] = ["game", "game-setup", "team-edit", "game-detail"];
  if (hideTabsScreens.includes(currentScreen)) {
    return null;
  }

  // Determine active tab based on current screen
  const getActiveTab = () => {
    if (currentScreen === "home") return "home";
    if (currentScreen === "roster") return "roster";
    if (currentScreen === "lineup" || currentScreen === "defense") return "lineup";
    if (currentScreen === "score-history") return "scores";
    return null;
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[hsl(210,40%,18%)] bg-[hsl(210,60%,7%)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.screen)}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 active:scale-95"
            >
              <Icon
                size={20}
                className={`transition-colors ${
                  isActive ? "text-[hsl(38,100%,50%)]" : "text-[hsl(210,20%,45%)]"
                }`}
              />
              <span
                className={`text-[9px] font-bold transition-colors ${
                  isActive ? "text-[hsl(38,100%,50%)]" : "text-[hsl(210,20%,45%)]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
