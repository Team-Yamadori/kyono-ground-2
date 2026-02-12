"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/store";

const TEAM_COLORS = [
  { name: "レッド", value: "hsl(0,70%,50%)" },
  { name: "ブルー", value: "hsl(210,70%,50%)" },
  { name: "グリーン", value: "hsl(140,60%,40%)" },
  { name: "オレンジ", value: "hsl(30,90%,50%)" },
  { name: "パープル", value: "hsl(270,60%,50%)" },
  { name: "イエロー", value: "hsl(50,90%,50%)" },
  { name: "ピンク", value: "hsl(340,70%,55%)" },
  { name: "ネイビー", value: "hsl(220,60%,30%)" },
];

export function TeamCreateScreen() {
  const { updateMyTeam, setTeamCreated } = useAppContext();
  const [teamName, setTeamName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TEAM_COLORS[0].value);
  const [step, setStep] = useState<1 | 2>(1);

  const handleNext = () => {
    if (teamName.trim().length === 0) return;
    setStep(2);
  };

  const handleCreate = () => {
    updateMyTeam((team) => ({
      ...team,
      name: teamName.trim(),
      color: selectedColor,
    }));
    setTeamCreated();
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)]">
      {/* Header */}
      <div className="relative flex flex-col items-center px-4 pb-4 pt-8">
        <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(38,100%,50%)] to-transparent" />
        <div className="mb-1 text-[10px] font-bold tracking-[0.2em] text-[hsl(38,100%,50%)]">
          {"STEP"} {step} / 2
        </div>
        <h1 className="text-lg font-black text-[hsl(48,100%,96%)]">
          {step === 1 ? "チーム名を入力" : "チームカラーを選択"}
        </h1>
        <div className="mt-1.5 h-0.5 w-10 bg-[hsl(38,100%,50%)]" />
      </div>

      {/* Progress bar */}
      <div className="mx-6 mb-6 h-1 overflow-hidden rounded-full bg-[hsl(210,30%,15%)]">
        <div
          className="h-full rounded-full bg-[hsl(38,100%,50%)] transition-all duration-300"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      {step === 1 ? (
        /* Step 1: Team Name */
        <div className="flex flex-1 flex-col items-center px-6">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(210,50%,12%)] ring-1 ring-[hsl(210,30%,20%)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(38,100%,50%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p className="mb-6 text-center text-xs text-[hsl(210,15%,50%)]">
            {"あなたのチーム名を入力してください"}
          </p>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="例: あかつき大附属"
            maxLength={20}
            className="w-full rounded-xl border border-[hsl(210,30%,20%)] bg-[hsl(210,50%,10%)] px-4 py-3 text-center text-base font-bold text-[hsl(48,100%,96%)] placeholder-[hsl(210,15%,35%)] outline-none transition-colors focus:border-[hsl(38,100%,50%)] focus:ring-1 focus:ring-[hsl(38,100%,50%)]"
            autoFocus
          />
          <p className="mt-2 text-[10px] text-[hsl(210,15%,35%)]">
            {teamName.length}/20
          </p>

          <button
            onClick={handleNext}
            disabled={teamName.trim().length === 0}
            className="mt-8 w-full rounded-xl bg-[hsl(38,100%,50%)] px-6 py-3 text-sm font-bold text-[hsl(210,70%,6%)] transition-all active:scale-95 disabled:opacity-30 disabled:active:scale-100"
          >
            {"次へ"}
          </button>
        </div>
      ) : (
        /* Step 2: Team Color */
        <div className="flex flex-1 flex-col items-center px-6">
          {/* Preview */}
          <div
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg ring-2 ring-white/10"
            style={{ backgroundColor: selectedColor }}
          >
            <span className="text-2xl font-black text-white/90">
              {teamName.charAt(0)}
            </span>
          </div>
          <p className="mb-1 text-base font-bold text-[hsl(48,100%,96%)]">
            {teamName}
          </p>
          <p className="mb-6 text-xs text-[hsl(210,15%,50%)]">
            {"チームカラーを選んでください"}
          </p>

          {/* Color Grid */}
          <div className="grid w-full grid-cols-4 gap-3">
            {TEAM_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedColor(c.value)}
                className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all"
                style={{
                  backgroundColor:
                    selectedColor === c.value
                      ? "hsl(210,50%,12%)"
                      : "transparent",
                  outline:
                    selectedColor === c.value
                      ? `2px solid ${c.value}`
                      : "none",
                }}
              >
                <div
                  className="h-10 w-10 rounded-full shadow-md"
                  style={{ backgroundColor: c.value }}
                />
                <span className="text-[9px] text-[hsl(210,15%,55%)]">
                  {c.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex w-full gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-[hsl(210,30%,20%)] px-4 py-3 text-sm font-bold text-[hsl(210,15%,60%)] transition-all active:scale-95"
            >
              {"戻る"}
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
              style={{ backgroundColor: selectedColor }}
            >
              {"チームを作成"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
