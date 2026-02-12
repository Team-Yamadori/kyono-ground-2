"use client";

import { useAppContext } from "@/lib/store";
import { ArrowLeft, Trophy, ChevronRight } from "lucide-react";

export function ScoreHistoryScreen() {
  const { state, navigate, setSelectedGameId } = useAppContext();
  const records = [...state.gameRecords].reverse();

  const handleViewDetail = (id: string) => {
    setSelectedGameId(id);
    navigate("game-detail");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)] pb-16">
      {/* Header */}
      <div className="flex items-center border-b border-[hsl(210,40%,18%)] bg-[hsl(210,60%,8%)] px-3 py-3">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="flex items-center gap-1 text-[hsl(210,20%,55%)] active:opacity-70"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">戻る</span>
        </button>
        <h2 className="flex-1 text-center text-sm font-black text-[hsl(38,100%,50%)]">
          試合結果
        </h2>
        <div className="w-12" />
      </div>

      {records.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(210,40%,14%)]">
            <Trophy size={28} className="text-[hsl(210,20%,35%)]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-black text-[hsl(48,100%,96%)]">まだ試合結果がありません</span>
            <span className="text-[10px] text-[hsl(210,20%,45%)]">試合を行うとここに結果が表示されます</span>
          </div>
          <button
            type="button"
            onClick={() => navigate("lineup")}
            className="mt-2 rounded-xl bg-[hsl(38,100%,45%)] px-8 py-3 text-sm font-black text-[hsl(210,80%,8%)] active:scale-[0.98]"
          >
            試合を始める
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 px-4 py-4">
          {records.map((record) => {
            const homeWin = record.homeScore > record.awayScore;
            const innings = Array.from({ length: Math.max(9, record.innings.away.length) }, (_, i) => i);

            return (
              <button
                key={record.id}
                type="button"
                onClick={() => handleViewDetail(record.id)}
                className="overflow-hidden rounded-xl border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)] text-left transition-all active:scale-[0.99]"
              >
                {/* Date + View detail */}
                <div className="flex items-center justify-between border-b border-[hsl(210,30%,15%)] bg-[hsl(210,45%,10%)] px-4 py-2">
                  <span className="text-[10px] text-[hsl(210,20%,45%)]">{record.date}</span>
                  <div className="flex items-center gap-0.5 text-[10px] text-[hsl(38,100%,50%)]">
                    <span className="font-bold">詳細</span>
                    <ChevronRight size={12} />
                  </div>
                </div>

                {/* Score display */}
                <div className="flex items-center justify-center gap-5 px-4 py-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-black text-[hsl(0,0%,100%)]"
                      style={{ backgroundColor: record.awayColor }}
                    >
                      {record.awayShort}
                    </div>
                    <span className="text-[10px] font-bold text-[hsl(210,20%,55%)]">{record.awayTeam}</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-3xl font-black tabular-nums ${!homeWin ? "text-[hsl(38,100%,50%)]" : "text-[hsl(48,100%,90%)]"}`}>
                      {record.awayScore}
                    </span>
                    <span className="text-lg font-bold text-[hsl(210,25%,30%)]">-</span>
                    <span className={`text-3xl font-black tabular-nums ${homeWin ? "text-[hsl(38,100%,50%)]" : "text-[hsl(48,100%,90%)]"}`}>
                      {record.homeScore}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-black text-[hsl(0,0%,100%)]"
                      style={{ backgroundColor: record.homeColor }}
                    >
                      {record.homeShort}
                    </div>
                    <span className="text-[10px] font-bold text-[hsl(210,20%,55%)]">{record.homeTeam}</span>
                  </div>
                </div>

                {/* Mini inning line */}
                <div className="border-t border-[hsl(210,30%,15%)]">
                  <table className="w-full border-collapse text-center">
                    <thead>
                      <tr>
                        <th className="w-7 border-b border-r border-[hsl(210,30%,15%)] py-1 text-[7px] text-[hsl(210,20%,40%)]" />
                        {innings.map((i) => (
                          <th key={i} className="border-b border-r border-[hsl(210,30%,15%)] py-1 text-[7px] text-[hsl(210,20%,40%)]">{i + 1}</th>
                        ))}
                        <th className="w-5 border-b border-r border-[hsl(210,30%,15%)] py-1 text-[7px] font-bold text-[hsl(38,100%,50%)]">R</th>
                        <th className="w-5 border-b border-r border-[hsl(210,30%,15%)] py-1 text-[7px] text-[hsl(210,20%,40%)]">H</th>
                        <th className="w-5 border-b border-[hsl(210,30%,15%)] py-1 text-[7px] text-[hsl(210,20%,40%)]">E</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-b border-r border-[hsl(210,30%,15%)] py-1 text-[7px] font-bold" style={{ color: record.awayColor }}>{record.awayShort}</td>
                        {innings.map((i) => (
                          <td key={i} className="border-b border-r border-[hsl(210,30%,15%)] py-1 text-[8px] tabular-nums text-[hsl(48,100%,90%)]">{record.innings.away[i] ?? ""}</td>
                        ))}
                        <td className="border-b border-r border-[hsl(210,30%,15%)] py-1 text-[9px] font-black tabular-nums text-[hsl(38,100%,50%)]">{record.awayScore}</td>
                        <td className="border-b border-r border-[hsl(210,30%,15%)] py-1 text-[8px] tabular-nums text-[hsl(48,100%,90%)]">{record.awayHits}</td>
                        <td className="border-b border-[hsl(210,30%,15%)] py-1 text-[8px] tabular-nums text-[hsl(0,60%,55%)]">{record.awayErrors}</td>
                      </tr>
                      <tr>
                        <td className="border-r border-[hsl(210,30%,15%)] py-1 text-[7px] font-bold" style={{ color: record.homeColor }}>{record.homeShort}</td>
                        {innings.map((i) => (
                          <td key={i} className="border-r border-[hsl(210,30%,15%)] py-1 text-[8px] tabular-nums text-[hsl(48,100%,90%)]">{record.innings.home[i] ?? ""}</td>
                        ))}
                        <td className="border-r border-[hsl(210,30%,15%)] py-1 text-[9px] font-black tabular-nums text-[hsl(38,100%,50%)]">{record.homeScore}</td>
                        <td className="border-r border-[hsl(210,30%,15%)] py-1 text-[8px] tabular-nums text-[hsl(48,100%,90%)]">{record.homeHits}</td>
                        <td className="py-1 text-[8px] tabular-nums text-[hsl(0,60%,55%)]">{record.homeErrors}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
