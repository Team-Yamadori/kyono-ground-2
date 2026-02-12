"use client";

import { useAppContext } from "@/lib/store";
import { createRandomOpponent, POSITION_SHORT, getPlayer } from "@/lib/team-data";
import { Swords, Users, Trophy, ClipboardList } from "lucide-react";

const menuItems = [
  {
    id: "game",
    label: "試合開始",
    sub: "PLAY BALL",
    icon: Swords,
    screen: "lineup" as const,
    accent: "hsl(0, 85%, 55%)",
    bg: "hsl(0,40%,12%)",
  },
  {
    id: "roster",
    label: "選手一覧",
    sub: "ROSTER",
    icon: Users,
    screen: "roster" as const,
    accent: "hsl(210, 80%, 55%)",
    bg: "hsl(210,40%,12%)",
  },
  {
    id: "lineup",
    label: "オーダー・守備",
    sub: "LINEUP / DEFENSE",
    icon: ClipboardList,
    screen: "lineup" as const,
    accent: "hsl(38, 100%, 50%)",
    bg: "hsl(38,30%,10%)",
  },
{
    id: "scores",
    label: "試合結果",
    sub: "SCORE HISTORY",
    icon: Trophy,
    screen: "score-history" as const,
    accent: "hsl(25, 90%, 55%)",
    bg: "hsl(25,30%,10%)",
  },
];

export function HomeMenu() {
  const { state, navigate, setOpponent } = useAppContext();
  const { myTeam } = state;

  // Preview: first 4 starters
  const starterPreview = myTeam.lineup.slice(0, 4).map((slot, i) => {
    const p = getPlayer(myTeam, slot.playerId);
    return { order: i + 1, pos: POSITION_SHORT[slot.fieldPosition], name: p?.name ?? "-" };
  });

  const handleGameStart = () => {
    setOpponent(createRandomOpponent());
    navigate("game-setup");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)] pb-16">
      {/* Header */}
      <div className="relative flex flex-col items-center px-4 pb-3 pt-6">
        <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(38,100%,50%)] to-transparent" />
        <div className="mb-0.5 text-[9px] font-bold tracking-[0.3em] text-[hsl(38,100%,50%)]">
          KYONO GROUND
        </div>
        <h1 className="text-lg font-black text-[hsl(48,100%,96%)]">
          {"パワプロ風スコアボード"}
        </h1>
        <div className="mt-1 h-0.5 w-10 bg-[hsl(38,100%,50%)]" />
      </div>

      {/* My Team Card */}
      <div className="mx-4 mb-3 overflow-hidden rounded-xl border border-[hsl(210,30%,20%)] bg-[hsl(210,50%,9%)]">
        <div className="flex items-center gap-3 border-b border-[hsl(210,30%,16%)] px-4 py-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black text-[hsl(0,0%,100%)]"
            style={{ backgroundColor: myTeam.color }}
          >
            {myTeam.shortName}
          </div>
          <div className="flex-1">
            <span className="text-sm font-black text-[hsl(48,100%,96%)]">{myTeam.name}</span>
            <span className="ml-2 text-[10px] text-[hsl(210,20%,45%)]">{myTeam.players.length}名</span>
          </div>
          <button
            type="button"
            onClick={() => navigate("team-edit")}
            className="rounded-md bg-[hsl(210,40%,16%)] px-2.5 py-1 text-[10px] font-bold text-[hsl(210,40%,60%)] active:scale-95"
          >
            編集
          </button>
        </div>
        <div className="grid grid-cols-4 gap-0">
          {starterPreview.map((s) => (
            <div key={s.order} className="flex flex-col items-center border-r border-[hsl(210,30%,14%)] py-2 last:border-r-0">
              <span className="text-[8px] text-[hsl(38,100%,50%)]">{s.order}番 {s.pos}</span>
              <span className="text-[10px] font-bold text-[hsl(48,100%,96%)]">{s.name.split(" ").pop()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isGame = item.id === "game";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (isGame) {
                  handleGameStart();
                } else {
                  navigate(item.screen);
                }
              }}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all active:scale-[0.98] ${
                isGame
                  ? "border-[hsl(0,60%,30%)] bg-[hsl(0,50%,14%)]"
                  : "border-[hsl(210,30%,16%)] bg-[hsl(210,45%,9%)]"
              }`}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `color-mix(in srgb, ${item.accent} 15%, transparent)`,
                  border: `1.5px solid color-mix(in srgb, ${item.accent} 30%, transparent)`,
                }}
              >
                <Icon size={20} style={{ color: item.accent }} />
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-sm font-black ${isGame ? "text-[hsl(0,85%,65%)]" : "text-[hsl(48,100%,96%)]"}`}>
                  {item.label}
                </span>
                <span className="text-[9px] font-bold tracking-wider text-[hsl(210,20%,40%)]">
                  {item.sub}
                </span>
              </div>
              <svg
                className="ml-auto h-4 w-4 text-[hsl(210,20%,30%)] transition-transform group-active:translate-x-0.5"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center pb-3">
        <span className="text-[9px] text-[hsl(210,15%,30%)]">v3.0</span>
      </div>
    </div>
  );
}
