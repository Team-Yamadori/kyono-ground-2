"use client";

import { useAppContext } from "@/lib/store";
import { useState } from "react";

const RELATIONS = ["父", "母", "その他"] as const;

export function UserProfileScreen() {
  const { state, setUserProfile } = useAppContext();
  const [name, setName] = useState(state.userName || "");
  const [relation, setRelation] = useState("");

  const canSubmit = name.trim().length > 0 && relation.length > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-[#F8F9FB]">
      {/* Header */}
      <div className="flex flex-col items-center px-4 pb-4 pt-10">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB] shadow-md">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1 className="text-lg font-black text-[#1A1D23]">{"プロフィール登録"}</h1>
        <p className="mt-1.5 text-center text-xs text-[#6B7280]">{"お名前とお子さんとの関係を教えてください"}</p>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5 pt-4">
        {/* Name */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 shadow-sm">
          <label className="mb-2 block text-[10px] font-bold text-[#9CA3AF]" htmlFor="user-name">
            {"お名前"}
          </label>
          <input
            id="user-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 早川 太郎"
            maxLength={20}
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] px-4 py-3 text-sm font-bold text-[#1A1D23] placeholder-[#D1D5DB] outline-none transition-colors focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            autoFocus
          />
        </div>

        {/* Relation */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 shadow-sm">
          <label className="mb-3 block text-[10px] font-bold text-[#9CA3AF]">
            {"お子さんとの関係"}
          </label>
          <div className="flex flex-wrap gap-2">
            {RELATIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRelation(r)}
                className={`rounded-xl border px-5 py-2.5 text-xs font-bold transition-all active:scale-95 ${
                  relation === r
                    ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                    : "border-[#E5E7EB] bg-white text-[#6B7280]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={() => { if (canSubmit) setUserProfile(name.trim(), relation); }}
          disabled={!canSubmit}
          className={`w-full rounded-xl px-4 py-3.5 text-sm font-bold transition-all active:scale-95 ${
            canSubmit
              ? "bg-[#2563EB] text-white shadow-md"
              : "bg-[#E5E7EB] text-[#D1D5DB]"
          }`}
        >
          {"次へ"}
        </button>
      </div>
    </div>
  );
}
