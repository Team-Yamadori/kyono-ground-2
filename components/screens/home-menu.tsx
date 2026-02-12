"use client";

import { useAppContext } from "@/lib/store";
import { createRandomOpponent, POSITION_SHORT, getPlayer } from "@/lib/team-data";
import { Swords, Play } from "lucide-react";

export function HomeMenu() {
  const { state, navigate, setOpponent } = useAppContext();
  const { myTeam, activeGameState } = state;

  const starterPreview = myTeam.lineup.slice(0, 4).map((slot, i) => {
    const p = getPlayer(myTeam, slot.playerId);
    return { order: i + 1, pos: POSITION_SHORT[slot.fieldPosition], name: p?.name ?? "-" };
  });

  const handleNewGame = () => {
    setOpponent(createRandomOpponent());
    navigate("game-setup");
  };

  const handleResumeGame = () => {
    navigate("game");
  };

  const hasLiveGame = activeGameState && !activeGameState.isGameOver;

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

      {/* Active Game Card */}
      {hasLiveGame ? (
        <div className="mx-4 mb-3">
          <button
            type="button"
            onClick={handleResumeGame}
            className="w-full overflow-hidden rounded-xl border-2 border-[hsl(0,70%,40%)] bg-[hsl(0,40%,10%)] transition-all active:scale-[0.98]"
          >
            {/* Live badge */}
            <div className="flex items-center justify-between border-b border-[hsl(0,50%,20%)] px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(0,85%,55%)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(0,85%,55%)]" />
                </span>
                <span className="text-[10px] font-black text-[hsl(0,85%,65%)]">LIVE</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-[hsl(210,20%,50%)]">
                  {activeGameState!.isTop ? "表" : "裏"} {activeGameState!.inning}{"回"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[hsl(0,85%,65%)]">
                <Play size={10} fill="currentColor" />
                <span className="text-[10px] font-black">{"続きから"}</span>
              </div>
            </div>

            {/* Score display */}
            <div className="flex items-center justify-center gap-4 px-4 py-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded text-[9px] font-black text-white"
                  style={{ backgroundColor: activeGameState!.away.color }}
                >
                  {activeGameState!.away.shortName}
                </div>
                <span className="text-2xl font-black tabular-nums text-[hsl(48,100%,96%)]">
                  {activeGameState!.away.runs}
                </span>
              </div>
              <span className="text-sm font-bold text-[hsl(210,20%,40%)]">-</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tabular-nums text-[hsl(48,100%,96%)]">
                  {activeGameState!.home.runs}
                </span>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded text-[9px] font-black text-white"
                  style={{ backgroundColor: activeGameState!.home.color }}
                >
                  {activeGameState!.home.shortName}
                </div>
              </div>
            </div>

            {/* Count/Outs mini display */}
            <div className="flex items-center justify-center gap-4 border-t border-[hsl(0,50%,20%)] px-3 py-1.5">
              <span className="text-[9px] text-[hsl(210,20%,50%)]">
                B{activeGameState!.balls} S{activeGameState!.strikes} O{activeGameState!.outs}
              </span>
              <span className="text-[9px] text-[hsl(210,20%,50%)]">
                {"塁:"}{" "}
                {[
                  activeGameState!.bases[0] ? "1" : "",
                  activeGameState!.bases[1] ? "2" : "",
                  activeGameState!.bases[2] ? "3" : "",
                ]
                  .filter(Boolean)
                  .join(",") || "なし"}
              </span>
            </div>
          </button>
        </div>
      ) : null}

      {/* My Team Card */}
      <div className="mx-4 mb-3 overflow-hidden rounded-xl border border-[hsl(210,30%,20%)] bg-[hsl(210,50%,9%)]">
        <div className="flex items-center gap-3 border-b border-[hsl(210,30%,16%)] px-4 py-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
            style={{ backgroundColor: myTeam.color }}
          >
            {myTeam.shortName}
          </div>
          <div className="flex-1">
            <span className="text-sm font-black text-[hsl(48,100%,96%)]">{myTeam.name}</span>
            <span className="ml-2 text-[10px] text-[hsl(210,20%,45%)]">
              {myTeam.players.length}{"名"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-0">
          {starterPreview.map((s) => (
            <div key={s.order} className="flex flex-col items-center border-r border-[hsl(210,30%,14%)] py-2 last:border-r-0">
              <span className="text-[8px] text-[hsl(38,100%,50%)]">
                {s.order}{"番"} {s.pos}
              </span>
              <span className="text-[10px] font-bold text-[hsl(48,100%,96%)]">
                {s.name.split(" ").pop()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Game Button */}
      <div className="px-4">
        <button
          type="button"
          onClick={handleNewGame}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[hsl(0,60%,30%)] bg-[hsl(0,50%,14%)] py-3.5 transition-all active:scale-[0.98]"
        >
          <Swords size={18} className="text-[hsl(0,85%,65%)]" />
          <span className="text-sm font-black text-[hsl(0,85%,65%)]">{"新しい試合を始める"}</span>
        </button>
      </div>

      <div className="mt-auto flex items-center justify-center pb-3">
        <span className="text-[9px] text-[hsl(210,15%,30%)]">v4.0</span>
      </div>
    </div>
  );
}
