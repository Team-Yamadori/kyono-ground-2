"use client";

import { useAppContext } from "@/lib/store";
import { ArrowLeft, Swords } from "lucide-react";
import { useState } from "react";

export function GameSetupScreen() {
  const { state, navigate, goBack, setGameConfig, setOpponent } = useAppContext();
  const { myTeam, opponent } = state;

  const [isTopOfInning, setIsTopOfInning] = useState(true);
  const [totalInnings, setTotalInnings] = useState(9);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(opponent.name);

  const handleStart = () => {
    setGameConfig({ isTopOfInning, totalInnings });
    navigate("lineup");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#F8F9FB]">
      {/* Header */}
      <div className="flex items-center border-b border-[#E5E7EB] bg-white px-3 py-2.5">
        <button type="button" onClick={goBack} className="flex items-center gap-1 text-[#6B7280] active:opacity-70">
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">{"戻る"}</span>
        </button>
        <h2 className="flex-1 text-center text-sm font-black text-[#1A1D23]">{"試合設定"}</h2>
        <div className="w-12" />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {/* Teams */}
        <div className="space-y-2">
          <p className="text-center text-[10px] font-black tracking-wider text-[#2563EB]">{"対戦カード"}</p>
          <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white" style={{ backgroundColor: myTeam.color }}>
              {myTeam.shortName}
            </div>
            <span className="text-sm font-black text-[#1A1D23]">{myTeam.name}</span>
            <span className="ml-auto rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-black text-[#2563EB]">{isTopOfInning ? "先攻" : "後攻"}</span>
          </div>
          <p className="text-center text-xs font-bold text-[#D1D5DB]">VS</p>
          <button type="button" onClick={() => setEditingName(true)}
            className="flex w-full items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm active:bg-[#F9FAFB]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white" style={{ backgroundColor: opponent.color }}>
              {opponent.shortName}
            </div>
            <span className="text-sm font-black text-[#1A1D23]">{opponent.name}</span>
            <span className="ml-auto rounded-md bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-black text-[#DC2626]">{isTopOfInning ? "後攻" : "先攻"}</span>
          </button>
        </div>

        {/* Offense/Defense */}
        <div className="space-y-2">
          <p className="text-center text-[10px] font-black tracking-wider text-[#2563EB]">{"攻守"}</p>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: "先攻", sub: "TOP", value: true }, { label: "後攻", sub: "BOTTOM", value: false }].map((opt) => (
              <button key={opt.label} type="button" onClick={() => setIsTopOfInning(opt.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 bg-white py-4 transition-all active:scale-[0.98] ${
                  isTopOfInning === opt.value ? "border-[#2563EB] shadow-md" : "border-[#E5E7EB]"
                }`}>
                <span className={`text-xs font-black ${isTopOfInning === opt.value ? "text-[#2563EB]" : "text-[#9CA3AF]"}`}>{opt.label}</span>
                <span className="text-[9px] font-bold text-[#D1D5DB]">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Innings */}
        <div className="space-y-2">
          <p className="text-center text-[10px] font-black tracking-wider text-[#2563EB]">{"イニング数"}</p>
          <div className="grid grid-cols-3 gap-2">
            {[7, 9, 12].map((innings) => (
              <button key={innings} type="button" onClick={() => setTotalInnings(innings)}
                className={`flex flex-col items-center gap-0.5 rounded-xl border-2 bg-white py-3 transition-all active:scale-[0.98] ${
                  totalInnings === innings ? "border-[#2563EB] shadow-md" : "border-[#E5E7EB]"
                }`}>
                <span className={`text-xl font-black tabular-nums ${totalInnings === innings ? "text-[#2563EB]" : "text-[#9CA3AF]"}`}>{innings}</span>
                <span className="text-[9px] font-bold text-[#D1D5DB]">{"回"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="border-t border-[#E5E7EB] bg-white px-4 py-3">
        <button type="button" onClick={handleStart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-sm font-black text-white shadow-md active:scale-[0.98]">
          <Swords size={16} />
          {"オーダー設定へ"}
        </button>
      </div>
      {editingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-6 w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <p className="mb-3 text-sm font-black text-[#1A1D23]">{"相手チーム名"}</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm font-bold text-[#1A1D23] outline-none focus:border-[#2563EB]"
              autoFocus
            />
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => { setEditingName(false); setNameInput(opponent.name); }}
                className="flex-1 rounded-xl bg-[#F3F4F6] py-2.5 text-sm font-black text-[#6B7280] active:scale-95">
                {"キャンセル"}
              </button>
              <button type="button" onClick={() => {
                const trimmed = nameInput.trim();
                if (trimmed) {
                  setOpponent({ ...opponent, name: trimmed, shortName: trimmed.slice(0, 2) });
                }
                setEditingName(false);
              }}
                className="flex-1 rounded-xl bg-[#2563EB] py-2.5 text-sm font-black text-white active:scale-95">
                {"変更"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
