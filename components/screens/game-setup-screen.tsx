"use client";

import { useAppContext } from "@/lib/store";
import { ArrowLeft, Swords } from "lucide-react";
import { useState } from "react";

export function GameSetupScreen() {
  const { state, navigate, setOpponent, setGameConfig } = useAppContext();
  const { myTeam, opponent } = state;

  const [isTopOfInning, setIsTopOfInning] = useState(true); // true=先攻, false=後攻
  const [totalInnings, setTotalInnings] = useState(9);

  const handleStart = () => {
    setGameConfig({ isTopOfInning, totalInnings });
    navigate("lineup");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)]">
      {/* Header */}
      <div className="flex items-center border-b border-[hsl(210,40%,18%)] bg-[hsl(210,60%,8%)] px-3 py-2.5">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="flex items-center gap-1 text-[hsl(210,20%,55%)] active:opacity-70"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">戻る</span>
        </button>
        <h2 className="flex-1 text-center text-sm font-black text-[hsl(38,100%,50%)]">
          試合設定
        </h2>
        <div className="w-12" />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {/* Teams */}
        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-[hsl(38,100%,50%,0.4)]" />
            <span className="text-[10px] font-black tracking-wider text-[hsl(38,100%,50%)]">
              対戦カード
            </span>
            <div className="h-px flex-1 bg-[hsl(38,100%,50%,0.4)]" />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[hsl(210,30%,20%)] bg-[hsl(210,50%,9%)] p-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
              style={{ backgroundColor: myTeam.color }}
            >
              {myTeam.shortName}
            </div>
            <div className="flex-1">
              <span className="text-sm font-black text-[hsl(48,100%,96%)]">{myTeam.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-center py-1">
            <span className="text-xs font-bold text-[hsl(210,20%,45%)]">VS</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[hsl(210,30%,20%)] bg-[hsl(210,50%,9%)] p-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
              style={{ backgroundColor: opponent.color }}
            >
              {opponent.shortName}
            </div>
            <div className="flex-1">
              <span className="text-sm font-black text-[hsl(48,100%,96%)]">{opponent.name}</span>
            </div>
          </div>
        </div>

        {/* Offense/Defense */}
        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-[hsl(38,100%,50%,0.4)]" />
            <span className="text-[10px] font-black tracking-wider text-[hsl(38,100%,50%)]">
              攻守
            </span>
            <div className="h-px flex-1 bg-[hsl(38,100%,50%,0.4)]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsTopOfInning(true)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 py-4 transition-all active:scale-[0.98] ${
                isTopOfInning
                  ? "border-[hsl(38,100%,50%)] bg-[hsl(38,30%,12%)]"
                  : "border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]"
              }`}
            >
              <span className={`text-xs font-black ${
                isTopOfInning ? "text-[hsl(38,100%,50%)]" : "text-[hsl(210,20%,50%)]"
              }`}>
                先攻
              </span>
              <span className="text-[9px] font-bold text-[hsl(210,20%,40%)]">TOP</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTopOfInning(false)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 py-4 transition-all active:scale-[0.98] ${
                !isTopOfInning
                  ? "border-[hsl(38,100%,50%)] bg-[hsl(38,30%,12%)]"
                  : "border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]"
              }`}
            >
              <span className={`text-xs font-black ${
                !isTopOfInning ? "text-[hsl(38,100%,50%)]" : "text-[hsl(210,20%,50%)]"
              }`}>
                後攻
              </span>
              <span className="text-[9px] font-bold text-[hsl(210,20%,40%)]">BOTTOM</span>
            </button>
          </div>
        </div>

        {/* Innings */}
        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-[hsl(38,100%,50%,0.4)]" />
            <span className="text-[10px] font-black tracking-wider text-[hsl(38,100%,50%)]">
              イニング数
            </span>
            <div className="h-px flex-1 bg-[hsl(38,100%,50%,0.4)]" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[7, 9, 12].map((innings) => (
              <button
                key={innings}
                type="button"
                onClick={() => setTotalInnings(innings)}
                className={`flex flex-col items-center gap-0.5 rounded-xl border-2 py-3 transition-all active:scale-[0.98] ${
                  totalInnings === innings
                    ? "border-[hsl(38,100%,50%)] bg-[hsl(38,30%,12%)]"
                    : "border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]"
                }`}
              >
                <span className={`text-xl font-black tabular-nums ${
                  totalInnings === innings ? "text-[hsl(38,100%,50%)]" : "text-[hsl(210,20%,50%)]"
                }`}>
                  {innings}
                </span>
                <span className="text-[9px] font-bold text-[hsl(210,20%,40%)]">回</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="border-t border-[hsl(210,40%,18%)] bg-[hsl(210,60%,7%)] px-4 py-3">
        <button
          type="button"
          onClick={handleStart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(0,85%,50%)] py-3 text-sm font-black text-white active:scale-[0.98]"
        >
          <Swords size={16} />
          オーダー設定へ
        </button>
      </div>
    </div>
  );
}
