"use client";

import type { PlayerData } from "@/lib/game-state";

interface PlayerInfoProps {
  batter: PlayerData;
  pitcher: PlayerData;
}

export function PlayerInfo({ batter, pitcher }: PlayerInfoProps) {
  return (
    <div className="flex flex-col border-b border-[hsl(210,50%,25%)]">
      {/* Batter Row */}
      <div className="flex items-center bg-[hsl(210,60%,10%)]">
        <div className="flex w-10 items-center justify-center bg-[hsl(0,75%,42%)] py-2 self-stretch">
          <span className="text-[10px] font-black text-[hsl(0,0%,100%)]">打</span>
        </div>
        <div className="flex flex-1 items-center justify-between px-3 py-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-bold tabular-nums text-[hsl(38,100%,50%)]">
              #{batter.number}
            </span>
            <span className="text-sm font-black text-[hsl(48,100%,96%)]">
              {batter.name}
            </span>
            <span className="text-[10px] text-[hsl(210,20%,55%)]">
              {batter.position}
            </span>
          </div>
          {batter.avg && (
            <span className="rounded bg-[hsl(210,50%,16%)] px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-[hsl(120,60%,55%)]">
              {batter.avg}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[hsl(210,50%,20%)]" />

      {/* Pitcher Row */}
      <div className="flex items-center bg-[hsl(210,60%,10%)]">
        <div className="flex w-10 items-center justify-center bg-[hsl(210,80%,35%)] py-2 self-stretch">
          <span className="text-[10px] font-black text-[hsl(0,0%,100%)]">投</span>
        </div>
        <div className="flex flex-1 items-center justify-between px-3 py-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-bold tabular-nums text-[hsl(38,100%,50%)]">
              #{pitcher.number}
            </span>
            <span className="text-sm font-black text-[hsl(48,100%,96%)]">
              {pitcher.name}
            </span>
          </div>
          {pitcher.era && (
            <span className="rounded bg-[hsl(210,50%,16%)] px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-[hsl(38,100%,55%)]">
              ERA {pitcher.era}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
