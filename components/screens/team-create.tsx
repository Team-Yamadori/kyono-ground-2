"use client";

import { useAppContext } from "@/lib/store";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

const TEAM_COLORS = [
  { label: "赤", color: "hsl(0, 85%, 55%)", sub: "hsl(0, 70%, 35%)" },
  { label: "青", color: "hsl(210, 80%, 45%)", sub: "hsl(210, 60%, 30%)" },
  { label: "緑", color: "hsl(145, 60%, 40%)", sub: "hsl(145, 50%, 25%)" },
  { label: "橙", color: "hsl(25, 90%, 50%)", sub: "hsl(25, 70%, 30%)" },
  { label: "紫", color: "hsl(270, 60%, 50%)", sub: "hsl(270, 45%, 30%)" },
  { label: "黒", color: "hsl(0, 0%, 25%)", sub: "hsl(0, 0%, 15%)" },
  { label: "金", color: "hsl(38, 100%, 50%)", sub: "hsl(38, 80%, 30%)" },
  { label: "水", color: "hsl(180, 60%, 45%)", sub: "hsl(180, 50%, 28%)" },
];

export function TeamCreate() {
  const { state, navigate, updateHomeTeam, updateAwayTeam, selectedTeamSide } = useAppContext();
  const team = selectedTeamSide === "home" ? state.homeTeam : state.awayTeam;

  const [name, setName] = useState(team.name);
  const [shortName, setShortName] = useState(team.shortName);
  const [colorIndex, setColorIndex] = useState(
    TEAM_COLORS.findIndex((c) => c.color === team.color) ?? 0
  );

  const handleSave = () => {
    const updater = (t: typeof team) => ({
      ...t,
      name: name || t.name,
      shortName: shortName || t.shortName,
      color: TEAM_COLORS[colorIndex].color,
      subColor: TEAM_COLORS[colorIndex].sub,
    });
    if (selectedTeamSide === "home") {
      updateHomeTeam(updater);
    } else {
      updateAwayTeam(updater);
    }
    navigate("team-select");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)]">
      {/* Header */}
      <div className="flex items-center border-b border-[hsl(210,40%,18%)] bg-[hsl(210,60%,8%)] px-3 py-3">
        <button
          type="button"
          onClick={() => navigate("team-select")}
          className="flex items-center gap-1 text-[hsl(210,20%,55%)] active:opacity-70"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">戻る</span>
        </button>
        <h2 className="flex-1 text-center text-sm font-black text-[hsl(38,100%,50%)]">
          チーム編集
        </h2>
        <div className="w-12" />
      </div>

      <div className="flex flex-1 flex-col gap-6 px-4 py-5">
        {/* Team preview */}
        <div className="flex items-center justify-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-xl text-xl font-black text-[hsl(0,0%,100%)]"
            style={{ backgroundColor: TEAM_COLORS[colorIndex].color }}
          >
            {shortName || team.shortName}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-[hsl(48,100%,96%)]">{name || team.name}</span>
            <span className="text-[10px] text-[hsl(210,20%,50%)]">
              {selectedTeamSide === "home" ? "ホーム" : "ビジター"}
            </span>
          </div>
        </div>

        {/* Name inputs */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[hsl(38,100%,50%)]" htmlFor="team-name">
              チーム名
            </label>
            <input
              id="team-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={10}
              className="rounded-lg border border-[hsl(210,40%,22%)] bg-[hsl(210,50%,10%)] px-4 py-3 text-sm font-bold text-[hsl(48,100%,96%)] outline-none focus:border-[hsl(38,100%,50%)]"
              placeholder="チーム名を入力"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[hsl(38,100%,50%)]" htmlFor="team-short">
              略称 (2文字)
            </label>
            <input
              id="team-short"
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value.slice(0, 2))}
              maxLength={2}
              className="w-24 rounded-lg border border-[hsl(210,40%,22%)] bg-[hsl(210,50%,10%)] px-4 py-3 text-sm font-bold text-[hsl(48,100%,96%)] outline-none focus:border-[hsl(38,100%,50%)]"
              placeholder="略称"
            />
          </div>
        </div>

        {/* Color selection */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-[hsl(38,100%,50%)]">チームカラー</span>
          <div className="grid grid-cols-4 gap-3">
            {TEAM_COLORS.map((c, i) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setColorIndex(i)}
                className={`flex flex-col items-center gap-1.5 rounded-lg py-3 transition-all active:scale-95 ${
                  colorIndex === i
                    ? "border-2 border-[hsl(38,100%,50%)] bg-[hsl(210,40%,14%)]"
                    : "border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]"
                }`}
              >
                <div
                  className="relative h-8 w-8 rounded-full"
                  style={{ backgroundColor: c.color }}
                >
                  {colorIndex === i && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check size={14} className="text-[hsl(0,0%,100%)]" />
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-bold text-[hsl(210,20%,55%)]">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className="mt-auto rounded-xl bg-[hsl(38,100%,45%)] py-4 text-sm font-black text-[hsl(210,80%,8%)] active:scale-[0.98]"
        >
          保存する
        </button>
      </div>
    </div>
  );
}
