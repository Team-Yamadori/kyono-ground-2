"use client";

import { useAppContext } from "@/lib/store";
import { formatAvg } from "@/lib/team-data";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export function GameDetailScreen() {
  const { state, navigate, selectedGameId } = useAppContext();
  const record = state.gameRecords.find((r) => r.id === selectedGameId);
  const [activeTab, setActiveTab] = useState<"score" | "batting" | "pitching">("score");

  if (!record) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[hsl(210,70%,6%)]">
        <span className="text-sm text-[hsl(210,20%,50%)]">試合データが見つかりません</span>
        <button
          type="button"
          onClick={() => navigate("score-history")}
          className="mt-4 rounded-xl bg-[hsl(38,100%,45%)] px-6 py-2 text-sm font-bold text-[hsl(210,80%,8%)]"
        >
          戻る
        </button>
      </div>
    );
  }

  const homeWin = record.homeScore > record.awayScore;
  const innings = Array.from({ length: Math.max(9, record.innings.away.length) }, (_, i) => i);

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)]">
      {/* Header */}
      <div className="flex items-center border-b border-[hsl(210,40%,18%)] bg-[hsl(210,60%,8%)] px-3 py-3">
        <button
          type="button"
          onClick={() => navigate("score-history")}
          className="flex items-center gap-1 text-[hsl(210,20%,55%)] active:opacity-70"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">戻る</span>
        </button>
        <h2 className="flex-1 text-center text-sm font-black text-[hsl(38,100%,50%)]">
          試合詳細
        </h2>
        <span className="text-[10px] text-[hsl(210,20%,45%)]">{record.date}</span>
      </div>

      {/* Big Score Display */}
      <div className="border-b border-[hsl(210,35%,18%)] bg-[hsl(210,55%,8%)] px-4 py-5">
        <div className="flex items-center justify-center gap-6">
          {/* Away */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-black text-[hsl(0,0%,100%)]"
              style={{ backgroundColor: record.awayColor }}
            >
              {record.awayShort}
            </div>
            <span className="text-[10px] font-bold text-[hsl(210,20%,55%)]">{record.awayTeam}</span>
            {!homeWin && (
              <span className="rounded-md bg-[hsl(38,100%,50%)] px-2 py-0.5 text-[8px] font-black text-[hsl(210,80%,8%)]">WIN</span>
            )}
          </div>
          {/* Score */}
          <div className="flex items-baseline gap-4">
            <span className={`text-5xl font-black tabular-nums ${!homeWin ? "text-[hsl(38,100%,50%)]" : "text-[hsl(48,100%,90%)]"}`}>
              {record.awayScore}
            </span>
            <span className="text-2xl font-bold text-[hsl(210,25%,28%)]">-</span>
            <span className={`text-5xl font-black tabular-nums ${homeWin ? "text-[hsl(38,100%,50%)]" : "text-[hsl(48,100%,90%)]"}`}>
              {record.homeScore}
            </span>
          </div>
          {/* Home */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-black text-[hsl(0,0%,100%)]"
              style={{ backgroundColor: record.homeColor }}
            >
              {record.homeShort}
            </div>
            <span className="text-[10px] font-bold text-[hsl(210,20%,55%)]">{record.homeTeam}</span>
            {homeWin && (
              <span className="rounded-md bg-[hsl(38,100%,50%)] px-2 py-0.5 text-[8px] font-black text-[hsl(210,80%,8%)]">WIN</span>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[hsl(210,40%,18%)]">
        {([
          { key: "score" as const, label: "スコア" },
          { key: "batting" as const, label: "打撃成績" },
          { key: "pitching" as const, label: "投手成績" },
        ]).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-center text-xs font-black transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-[hsl(38,100%,50%)] text-[hsl(38,100%,50%)]"
                : "text-[hsl(210,20%,45%)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
        {activeTab === "score" && (
          <div className="flex flex-col gap-4">
            {/* Full inning table */}
            <div className="overflow-x-auto rounded-xl border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]">
              <table className="w-full min-w-[340px] border-collapse text-center">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 w-10 border-b border-r border-[hsl(210,30%,15%)] bg-[hsl(210,45%,10%)] py-2 text-[9px] text-[hsl(210,20%,40%)]">
                      チーム
                    </th>
                    {innings.map((i) => (
                      <th key={i} className="border-b border-r border-[hsl(210,30%,15%)] bg-[hsl(210,45%,10%)] py-2 text-[9px] text-[hsl(210,20%,40%)]">
                        {i + 1}
                      </th>
                    ))}
                    <th className="border-b border-r border-[hsl(210,30%,15%)] bg-[hsl(210,45%,10%)] py-2 text-[9px] font-bold text-[hsl(38,100%,50%)]">R</th>
                    <th className="border-b border-r border-[hsl(210,30%,15%)] bg-[hsl(210,45%,10%)] py-2 text-[9px] text-[hsl(210,20%,40%)]">H</th>
                    <th className="border-b border-[hsl(210,30%,15%)] bg-[hsl(210,45%,10%)] py-2 text-[9px] text-[hsl(210,20%,40%)]">E</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="sticky left-0 z-10 border-b border-r border-[hsl(210,30%,15%)] bg-[hsl(210,50%,8%)] py-2 text-[9px] font-black" style={{ color: record.awayColor }}>
                      {record.awayShort}
                    </td>
                    {innings.map((i) => (
                      <td key={i} className="border-b border-r border-[hsl(210,30%,15%)] py-2 text-[10px] tabular-nums text-[hsl(48,100%,90%)]">
                        {record.innings.away[i] ?? ""}
                      </td>
                    ))}
                    <td className="border-b border-r border-[hsl(210,30%,15%)] py-2 text-[11px] font-black tabular-nums text-[hsl(38,100%,50%)]">{record.awayScore}</td>
                    <td className="border-b border-r border-[hsl(210,30%,15%)] py-2 text-[10px] tabular-nums text-[hsl(48,100%,90%)]">{record.awayHits}</td>
                    <td className="border-b border-[hsl(210,30%,15%)] py-2 text-[10px] tabular-nums text-[hsl(0,60%,55%)]">{record.awayErrors}</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 z-10 border-r border-[hsl(210,30%,15%)] bg-[hsl(210,50%,8%)] py-2 text-[9px] font-black" style={{ color: record.homeColor }}>
                      {record.homeShort}
                    </td>
                    {innings.map((i) => (
                      <td key={i} className="border-r border-[hsl(210,30%,15%)] py-2 text-[10px] tabular-nums text-[hsl(48,100%,90%)]">
                        {record.innings.home[i] ?? ""}
                      </td>
                    ))}
                    <td className="border-r border-[hsl(210,30%,15%)] py-2 text-[11px] font-black tabular-nums text-[hsl(38,100%,50%)]">{record.homeScore}</td>
                    <td className="border-r border-[hsl(210,30%,15%)] py-2 text-[10px] tabular-nums text-[hsl(48,100%,90%)]">{record.homeHits}</td>
                    <td className="py-2 text-[10px] tabular-nums text-[hsl(0,60%,55%)]">{record.homeErrors}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "batting" && (
          <div className="flex flex-col gap-4">
            {/* Away batting */}
            <BattingTable label={record.awayTeam} color={record.awayColor} players={record.awayLineup} />
            {/* Home batting */}
            <BattingTable label={record.homeTeam} color={record.homeColor} players={record.homeLineup} />
          </div>
        )}

        {activeTab === "pitching" && (
          <div className="flex flex-col gap-4">
            <PitchingTable label={record.awayTeam} color={record.awayColor} pitchers={record.awayPitchers} />
            <PitchingTable label={record.homeTeam} color={record.homeColor} pitchers={record.homePitchers} />
          </div>
        )}
      </div>
    </div>
  );
}

function BattingTable({
  label,
  color,
  players,
}: {
  label: string;
  color: string;
  players: { name: string; pos: string; atBats: number; hits: number; rbi: number; avg: number }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]">
      <div className="border-b border-[hsl(210,30%,15%)] bg-[hsl(210,45%,10%)] px-3 py-2">
        <span className="text-xs font-black" style={{ color }}>{label}</span>
      </div>
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-left pl-3 text-[8px] text-[hsl(210,20%,40%)]">打順</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">守</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-left text-[8px] text-[hsl(210,20%,40%)]">選手名</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">打数</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">安打</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">打点</th>
            <th className="border-b border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">打率</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={`${p.name}-${i}`}>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 pl-3 text-left text-[10px] font-bold text-[hsl(38,100%,50%)] ${i < players.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {i + 1}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] font-bold text-[hsl(210,60%,65%)] ${i < players.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.pos}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-left pl-2 text-[10px] font-bold text-[hsl(48,100%,96%)] ${i < players.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.name}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] tabular-nums text-[hsl(48,100%,90%)] ${i < players.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.atBats}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] tabular-nums font-bold ${p.hits > 0 ? "text-[hsl(120,50%,55%)]" : "text-[hsl(48,100%,90%)]"} ${i < players.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.hits}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] tabular-nums font-bold ${p.rbi > 0 ? "text-[hsl(38,100%,55%)]" : "text-[hsl(48,100%,90%)]"} ${i < players.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.rbi}
              </td>
              <td className={`py-1.5 text-[10px] tabular-nums text-[hsl(210,30%,55%)] ${i < players.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {formatAvg(p.avg)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PitchingTable({
  label,
  color,
  pitchers,
}: {
  label: string;
  color: string;
  pitchers: { name: string; ip: number; hits: number; er: number; so: number; bb: number; result: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]">
      <div className="border-b border-[hsl(210,30%,15%)] bg-[hsl(210,45%,10%)] px-3 py-2">
        <span className="text-xs font-black" style={{ color }}>{label}</span>
      </div>
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-left pl-3 text-[8px] text-[hsl(210,20%,40%)]">投手名</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">結果</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">投球回</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">被安</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">自責</th>
            <th className="border-b border-r border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">奪三</th>
            <th className="border-b border-[hsl(210,30%,15%)] py-1.5 text-[8px] text-[hsl(210,20%,40%)]">四球</th>
          </tr>
        </thead>
        <tbody>
          {pitchers.map((p, i) => (
            <tr key={`${p.name}-${i}`}>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 pl-3 text-left text-[10px] font-bold text-[hsl(48,100%,96%)] ${i < pitchers.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.name}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] font-black ${
                p.result === "W" ? "text-[hsl(120,50%,55%)]" : p.result === "L" ? "text-[hsl(0,70%,55%)]" : "text-[hsl(210,20%,50%)]"
              } ${i < pitchers.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.result}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] tabular-nums text-[hsl(48,100%,90%)] ${i < pitchers.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.ip}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] tabular-nums text-[hsl(48,100%,90%)] ${i < pitchers.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.hits}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] tabular-nums ${p.er > 0 ? "text-[hsl(0,70%,55%)]" : "text-[hsl(48,100%,90%)]"} ${i < pitchers.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.er}
              </td>
              <td className={`border-r border-[hsl(210,30%,15%)] py-1.5 text-[10px] tabular-nums font-bold text-[hsl(38,100%,55%)] ${i < pitchers.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.so}
              </td>
              <td className={`py-1.5 text-[10px] tabular-nums text-[hsl(48,100%,90%)] ${i < pitchers.length - 1 ? "border-b border-b-[hsl(210,30%,13%)]" : ""}`}>
                {p.bb}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
