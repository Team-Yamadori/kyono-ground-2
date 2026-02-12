"use client";

import { useAppContext } from "@/lib/store";
import { useState } from "react";

export function TeamSelectScreen() {
  const { navigate } = useAppContext();
  const [teamCode, setTeamCode] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleJoin = () => {
    // Mock join: just go to home with default team
    if (teamCode.trim().length > 0) {
      // In a real app, this would fetch the team from a server
      navigate("home");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)]">
      {/* Header */}
      <div className="relative flex flex-col items-center px-4 pb-4 pt-10">
        <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(38,100%,50%)] to-transparent" />
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(210,50%,12%)] shadow-lg ring-1 ring-[hsl(210,30%,20%)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(38,100%,50%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h1 className="text-lg font-black text-[hsl(48,100%,96%)]">
          {"チームを選択"}
        </h1>
        <p className="mt-1.5 text-center text-xs text-[hsl(210,15%,50%)]">
          {"新しくチームを作るか、既存チームに参加しましょう"}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-4">
        {/* Create Team */}
        <button
          type="button"
          onClick={() => navigate("team-create")}
          className="flex items-center gap-4 rounded-2xl border-2 border-[hsl(38,80%,35%)] bg-[hsl(38,25%,10%)] px-5 py-5 text-left transition-all active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(38,40%,18%)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(38,100%,50%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-[hsl(38,100%,55%)]">
              {"チームを作成"}
            </p>
            <p className="mt-0.5 text-[10px] text-[hsl(210,15%,50%)]">
              {"新しいチームを作って選手を登録"}
            </p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(38,100%,50%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Join Team */}
        <button
          type="button"
          onClick={() => setShowJoinInput(!showJoinInput)}
          className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-5 text-left transition-all active:scale-[0.98] ${
            showJoinInput
              ? "border-[hsl(210,60%,40%)] bg-[hsl(210,40%,10%)]"
              : "border-[hsl(210,30%,22%)] bg-[hsl(210,50%,9%)]"
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(210,40%,15%)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(210,60%,60%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-[hsl(210,60%,70%)]">
              {"チームに参加"}
            </p>
            <p className="mt-0.5 text-[10px] text-[hsl(210,15%,50%)]">
              {"チームコードで既存チームに参加"}
            </p>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="hsl(210,30%,45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform ${showJoinInput ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Join input */}
        {showJoinInput && (
          <div className="animate-[slideUp_0.15s_ease-out] rounded-2xl border border-[hsl(210,30%,20%)] bg-[hsl(210,50%,9%)] px-4 py-4">
            <label className="mb-2 block text-[10px] font-bold text-[hsl(210,20%,50%)]" htmlFor="team-code">
              {"チームコード"}
            </label>
            <input
              id="team-code"
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              placeholder="例: ABC123"
              maxLength={8}
              className="mb-3 w-full rounded-xl border border-[hsl(210,30%,22%)] bg-[hsl(210,50%,12%)] px-4 py-3 text-center text-base font-bold tracking-widest text-[hsl(48,100%,96%)] placeholder-[hsl(210,15%,30%)] outline-none transition-colors focus:border-[hsl(210,60%,50%)] focus:ring-1 focus:ring-[hsl(210,60%,50%)]"
              autoFocus
            />
            <button
              type="button"
              onClick={handleJoin}
              disabled={teamCode.trim().length === 0}
              className="w-full rounded-xl bg-[hsl(210,60%,45%)] px-4 py-3 text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-30"
            >
              {"参加する"}
            </button>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="px-5 pb-6 pt-4">
        <p className="text-center text-[10px] text-[hsl(210,15%,35%)]">
          {"チーム作成後、メンバーを招待できます"}
        </p>
      </div>
    </div>
  );
}
