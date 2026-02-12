"use client";

import { useAppContext } from "@/lib/store";
import {
  POSITION_SHORT,
  getPlayer,
} from "@/lib/team-data";
import { ArrowLeft, Swords } from "lucide-react";
import { useState, useCallback } from "react";

type SwapMode = "defense" | "player";

type SwapState =
  | { mode: "none" }
  | { mode: "selected"; slotIndex: number; slotType: "lineup" | "bench"; swapMode: SwapMode };

export function LineupScreen() {
  const { state, navigate, updateMyTeam } = useAppContext();
  const team = state.myTeam;
  const [swapState, setSwapState] = useState<SwapState>({ mode: "none" });

  const cancel = () => setSwapState({ mode: "none" });

  const handleSelect = useCallback(
    (slotType: "lineup" | "bench", index: number, swapMode: SwapMode) => {
      if (swapState.mode === "none") {
        setSwapState({ mode: "selected", slotIndex: index, slotType, swapMode });
        return;
      }

      const from = swapState;
      if (from.slotType === slotType && from.slotIndex === index) {
        cancel();
        return;
      }

      if (swapMode !== from.swapMode) {
        setSwapState({ mode: "selected", slotIndex: index, slotType, swapMode });
        return;
      }

      updateMyTeam((t) => {
        const newLineup = [...t.lineup];
        const newBench = [...t.benchPlayers];

        if (from.swapMode === "defense" && from.slotType === "lineup" && slotType === "lineup") {
          const fromPos = newLineup[from.slotIndex].fieldPosition;
          const toPos = newLineup[index].fieldPosition;
          newLineup[from.slotIndex] = { ...newLineup[from.slotIndex], fieldPosition: toPos };
          newLineup[index] = { ...newLineup[index], fieldPosition: fromPos };
        } else if (from.swapMode === "player") {
          if (from.slotType === "lineup" && slotType === "lineup") {
            const temp = newLineup[from.slotIndex];
            newLineup[from.slotIndex] = newLineup[index];
            newLineup[index] = temp;
          } else if (from.slotType === "lineup" && slotType === "bench") {
            const lineupSlot = newLineup[from.slotIndex];
            const benchId = newBench[index];
            newLineup[from.slotIndex] = { playerId: benchId, fieldPosition: lineupSlot.fieldPosition };
            newBench[index] = lineupSlot.playerId;
          } else if (from.slotType === "bench" && slotType === "lineup") {
            const lineupSlot = newLineup[index];
            const benchId = newBench[from.slotIndex];
            newLineup[index] = { playerId: benchId, fieldPosition: lineupSlot.fieldPosition };
            newBench[from.slotIndex] = lineupSlot.playerId;
          } else if (from.slotType === "bench" && slotType === "bench") {
            const temp = newBench[from.slotIndex];
            newBench[from.slotIndex] = newBench[index];
            newBench[index] = temp;
          }
        }

        return { ...t, lineup: newLineup, benchPlayers: newBench };
      });
      cancel();
    },
    [swapState, updateMyTeam]
  );

  const lineupPlayers = team.lineup.map((slot) => getPlayer(team, slot.playerId));
  const benchPlayers = team.benchPlayers.map((id) => getPlayer(team, id));

  const isSelected = (slotType: "lineup" | "bench", index: number) =>
    swapState.mode === "selected" && swapState.slotType === slotType && swapState.slotIndex === index;

  const hintText = (() => {
    if (swapState.mode !== "selected") return "タップで選手入替　守備マークで守備入替";
    if (swapState.swapMode === "defense") return "守備を入れ替える選手の守備をタップ";
    return "入れ替える選手をタップ";
  })();

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)]">
      {/* Header */}
      <div className="flex items-center border-b border-[hsl(210,40%,18%)] bg-[hsl(210,60%,8%)] px-3 py-2.5">
        <button
          type="button"
          onClick={() => { cancel(); navigate("home"); }}
          className="flex items-center gap-1 text-[hsl(210,20%,55%)] active:opacity-70"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">戻る</span>
        </button>
        <h2 className="flex-1 text-center text-sm font-black text-[hsl(38,100%,50%)]">
          オーダー・守備設定
        </h2>
        <div className="w-12" />
      </div>

      {/* Hint bar */}
      <div className={`flex items-center justify-center px-4 py-1.5 ${
        swapState.mode === "selected" ? "bg-[hsl(38,25%,11%)]" : "bg-[hsl(210,40%,9%)]"
      }`}>
        <span className={`text-[10px] font-bold ${
          swapState.mode === "selected" ? "text-[hsl(38,100%,50%)]" : "text-[hsl(210,20%,40%)]"
        }`}>
          {hintText}
        </span>
      </div>

      {/* Main content: Starting lineup left, Bench right */}
      <div className="flex flex-1 gap-1.5 overflow-hidden px-1.5 py-2">
        {/* Starting Lineup (left) */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="mb-1.5 flex items-center gap-1.5 px-1">
            <div className="h-px flex-1 bg-[hsl(38,100%,50%,0.4)]" />
            <span className="text-[8px] font-black tracking-wider text-[hsl(38,100%,50%)]">
              STARTING
            </span>
            <div className="h-px flex-1 bg-[hsl(38,100%,50%,0.4)]" />
          </div>
          <div className="flex flex-col gap-1">
            {lineupPlayers.map((player, i) => {
              if (!player) return null;
              const sel = isSelected("lineup", i);
              const defActive = sel && swapState.mode === "selected" && swapState.swapMode === "defense";

              return (
                <button
                  key={team.lineup[i].playerId}
                  type="button"
                  onClick={() => handleSelect("lineup", i, "player")}
                  className={`flex items-center gap-1.5 rounded-lg px-2 py-2 ${
                    sel
                      ? "border border-[hsl(38,100%,50%)] bg-[hsl(38,30%,12%)]"
                      : "border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]"
                  }`}
                >
                  {/* Order number */}
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[hsl(210,40%,18%)]">
                    <span className="text-[10px] font-black text-[hsl(38,100%,50%)]">
                      {i + 1}
                    </span>
                  </div>

                  {/* Player info: number + name + position on right */}
                  <div className="flex flex-1 items-center gap-1 overflow-hidden">
                    <span className="text-[9px] font-bold tabular-nums text-[hsl(210,20%,50%)]">
                      #{player.number}
                    </span>
                    <span className="truncate text-[11px] font-black text-[hsl(48,100%,96%)]">
                      {player.name}
                    </span>
                  </div>

                  {/* Field position - tap for defense swap */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); handleSelect("lineup", i, "defense"); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); handleSelect("lineup", i, "defense"); } }}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                      defActive ? "bg-[hsl(145,55%,35%)]" : "bg-[hsl(210,60%,25%)]"
                    }`}
                  >
                    <span className="text-[10px] font-black text-[hsl(48,100%,96%)]">
                      {POSITION_SHORT[team.lineup[i].fieldPosition]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bench (right) */}
        <div className="flex w-[120px] shrink-0 flex-col overflow-y-auto">
          <div className="mb-1.5 flex items-center gap-1 px-1">
            <div className="h-px flex-1 bg-[hsl(210,30%,25%)]" />
            <span className="text-[8px] font-black tracking-wider text-[hsl(210,20%,45%)]">
              BENCH
            </span>
            <div className="h-px flex-1 bg-[hsl(210,30%,25%)]" />
          </div>
          <div className="flex flex-col gap-1">
            {benchPlayers.map((player, i) => {
              if (!player) return null;
              const sel = isSelected("bench", i);

              return (
                <button
                  key={team.benchPlayers[i]}
                  type="button"
                  onClick={() => handleSelect("bench", i, "player")}
                  className={`flex items-center gap-1 rounded-lg px-1.5 py-2 ${
                    sel
                      ? "border border-[hsl(38,100%,50%)] bg-[hsl(38,30%,12%)]"
                      : "border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]"
                  }`}
                >
                  <div className="flex flex-1 flex-col items-start overflow-hidden">
                    <span className="w-full truncate text-[10px] font-black text-[hsl(48,100%,96%)]">
                      {player.name}
                    </span>
                    <span className="text-[8px] text-[hsl(210,20%,42%)]">
                      #{player.number}
                    </span>
                  </div>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[hsl(210,60%,25%)]">
                    <span className="text-[9px] font-black text-[hsl(48,100%,96%)]">
                      {POSITION_SHORT[player.position]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="border-t border-[hsl(210,40%,18%)] bg-[hsl(210,60%,7%)] px-4 py-3">
        <button
          type="button"
          onClick={() => navigate("game")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(0,85%,50%)] py-3 text-sm font-black text-[hsl(0,0%,100%)] active:scale-[0.98]"
        >
          <Swords size={16} />
          プレイボール!
        </button>
      </div>
    </div>
  );
}
