"use client";

import type { TeamData } from "@/lib/game-state";

interface InningBoardProps {
  home: TeamData;
  away: TeamData;
  currentInning: number;
  isTop: boolean;
}

export function InningBoard({ home, away, currentInning, isTop }: InningBoardProps) {
  const innings = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="border-b border-[hsl(210,50%,25%)] bg-[hsl(210,70%,8%)]">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="w-10 border-b border-r border-[hsl(210,40%,20%)] py-1.5 text-[9px] font-bold tracking-widest text-[hsl(38,100%,50%)]">
              {""}
            </th>
            {innings.map((i) => (
              <th
                key={i}
                className={`border-b border-r border-[hsl(210,40%,20%)] py-1.5 text-[11px] font-bold ${
                  i === currentInning
                    ? "bg-[hsl(38,100%,50%)] text-[hsl(210,80%,8%)]"
                    : "text-[hsl(210,20%,55%)]"
                }`}
              >
                {i}
              </th>
            ))}
            <th className="border-b border-r border-[hsl(210,40%,20%)] px-1 py-1.5 text-[10px] font-bold text-[hsl(38,100%,50%)]">R</th>
            <th className="border-b border-r border-[hsl(210,40%,20%)] px-1 py-1.5 text-[10px] font-bold text-[hsl(210,20%,55%)]">H</th>
            <th className="border-b border-[hsl(210,40%,20%)] px-1 py-1.5 text-[10px] font-bold text-[hsl(210,20%,55%)]">E</th>
          </tr>
        </thead>
        <tbody>
          {/* Away */}
          <tr>
            <td className="border-b border-r border-[hsl(210,40%,20%)] py-1.5">
              <div className="flex items-center justify-center gap-0.5">
                {isTop && <span className="inline-block h-0 w-0 border-b-[5px] border-l-[4px] border-r-[4px] border-b-[hsl(38,100%,50%)] border-l-transparent border-r-transparent" />}
                <span className="text-[10px] font-bold text-[hsl(0,75%,65%)]">{away.shortName}</span>
              </div>
            </td>
            {innings.map((i) => (
              <td
                key={i}
                className={`border-b border-r border-[hsl(210,40%,20%)] py-1.5 text-[12px] font-bold tabular-nums ${
                  i === currentInning && isTop
                    ? "bg-[hsl(38,70%,18%)] text-[hsl(48,100%,96%)]"
                    : "text-[hsl(48,100%,90%)]"
                }`}
              >
                {away.scores[i - 1] !== null ? away.scores[i - 1] : ""}
              </td>
            ))}
            <td className="border-b border-r border-[hsl(210,40%,20%)] py-1.5 text-[12px] font-black tabular-nums text-[hsl(38,100%,50%)]">
              {away.runs}
            </td>
            <td className="border-b border-r border-[hsl(210,40%,20%)] py-1.5 text-[12px] font-bold tabular-nums text-[hsl(48,100%,90%)]">
              {away.hits}
            </td>
            <td className="border-b border-[hsl(210,40%,20%)] py-1.5 text-[12px] font-bold tabular-nums text-[hsl(48,100%,90%)]">
              {away.errors}
            </td>
          </tr>
          {/* Home */}
          <tr>
            <td className="border-r border-[hsl(210,40%,20%)] py-1.5">
              <div className="flex items-center justify-center gap-0.5">
                {!isTop && <span className="inline-block h-0 w-0 border-b-[5px] border-l-[4px] border-r-[4px] border-b-[hsl(38,100%,50%)] border-l-transparent border-r-transparent" />}
                <span className="text-[10px] font-bold text-[hsl(210,70%,65%)]">{home.shortName}</span>
              </div>
            </td>
            {innings.map((i) => (
              <td
                key={i}
                className={`border-r border-[hsl(210,40%,20%)] py-1.5 text-[12px] font-bold tabular-nums ${
                  i === currentInning && !isTop
                    ? "bg-[hsl(38,70%,18%)] text-[hsl(48,100%,96%)]"
                    : "text-[hsl(48,100%,90%)]"
                }`}
              >
                {home.scores[i - 1] !== null ? home.scores[i - 1] : ""}
              </td>
            ))}
            <td className="border-r border-[hsl(210,40%,20%)] py-1.5 text-[12px] font-black tabular-nums text-[hsl(38,100%,50%)]">
              {home.runs}
            </td>
            <td className="border-r border-[hsl(210,40%,20%)] py-1.5 text-[12px] font-bold tabular-nums text-[hsl(48,100%,90%)]">
              {home.hits}
            </td>
            <td className="py-1.5 text-[12px] font-bold tabular-nums text-[hsl(48,100%,90%)]">
              {home.errors}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
