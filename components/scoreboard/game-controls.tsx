"use client";

import { useState } from "react";
import type { GameAction, GameState } from "@/lib/game-state";

interface GameControlsProps {
  gameState: GameState;
  onAction: (action: GameAction) => void;
}

interface ActionButton {
  action: GameAction;
  label: string;
  sub?: string;
  color: string;
  bgColor: string;
  activeBg: string;
  disabled?: (state: GameState) => boolean;
  border?: boolean;
}

const tabs = [
  { id: "count", label: "投球" },
  { id: "hit", label: "安打" },
  { id: "out", label: "アウト" },
  { id: "run", label: "走塁" },
  { id: "other", label: "その他" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const tabActions: Record<TabId, ActionButton[]> = {
  count: [
    { action: "ball", label: "B", sub: "ボール", color: "text-[hsl(120,60%,55%)]", bgColor: "bg-[hsl(120,40%,15%)]", activeBg: "active:bg-[hsl(120,40%,22%)]" },
    { action: "strike", label: "S", sub: "ストライク", color: "text-[hsl(38,100%,55%)]", bgColor: "bg-[hsl(38,50%,14%)]", activeBg: "active:bg-[hsl(38,50%,22%)]" },
    { action: "foul", label: "F", sub: "ファウル", color: "text-[hsl(270,60%,65%)]", bgColor: "bg-[hsl(270,30%,15%)]", activeBg: "active:bg-[hsl(270,30%,22%)]" },
  ],
  hit: [
    { action: "single", label: "1B", sub: "シングル", color: "text-[hsl(210,80%,65%)]", bgColor: "bg-[hsl(210,50%,14%)]", activeBg: "active:bg-[hsl(210,50%,22%)]" },
    { action: "double", label: "2B", sub: "二塁打", color: "text-[hsl(180,70%,55%)]", bgColor: "bg-[hsl(180,40%,13%)]", activeBg: "active:bg-[hsl(180,40%,22%)]" },
    { action: "triple", label: "3B", sub: "三塁打", color: "text-[hsl(45,90%,55%)]", bgColor: "bg-[hsl(45,40%,13%)]", activeBg: "active:bg-[hsl(45,40%,22%)]" },
    { action: "homerun", label: "HR", sub: "ホームラン", color: "text-[hsl(38,100%,55%)]", bgColor: "bg-[hsl(38,60%,13%)]", activeBg: "active:bg-[hsl(38,60%,22%)]", border: true },
  ],
  out: [
    { action: "out", label: "OUT", sub: "アウト", color: "text-[hsl(0,80%,60%)]", bgColor: "bg-[hsl(0,40%,14%)]", activeBg: "active:bg-[hsl(0,40%,22%)]" },
    { action: "sacrifice-fly", label: "犠飛", sub: "犠牲フライ", color: "text-[hsl(200,60%,60%)]", bgColor: "bg-[hsl(200,30%,14%)]", activeBg: "active:bg-[hsl(200,30%,22%)]", disabled: (s) => !s.bases[2] },
    { action: "sacrifice-bunt", label: "犠打", sub: "犠牲バント", color: "text-[hsl(160,50%,55%)]", bgColor: "bg-[hsl(160,30%,14%)]", activeBg: "active:bg-[hsl(160,30%,22%)]", disabled: (s) => !s.bases[0] && !s.bases[1] && !s.bases[2] },
    { action: "double-play", label: "併殺", sub: "ゲッツー", color: "text-[hsl(0,70%,55%)]", bgColor: "bg-[hsl(0,35%,13%)]", activeBg: "active:bg-[hsl(0,35%,22%)]", disabled: (s) => s.outs >= 2 || (!s.bases[0] && !s.bases[1] && !s.bases[2]) },
    { action: "fielders-choice", label: "野選", sub: "FC", color: "text-[hsl(30,60%,55%)]", bgColor: "bg-[hsl(30,30%,13%)]", activeBg: "active:bg-[hsl(30,30%,22%)]", disabled: (s) => !s.bases[0] && !s.bases[1] && !s.bases[2] },
  ],
  run: [
    { action: "stolen-base", label: "盗塁", sub: "成功", color: "text-[hsl(120,60%,55%)]", bgColor: "bg-[hsl(120,30%,14%)]", activeBg: "active:bg-[hsl(120,30%,22%)]", disabled: (s) => !s.bases[0] && !s.bases[1] && !s.bases[2] },
    { action: "caught-stealing", label: "盗塁", sub: "失敗", color: "text-[hsl(0,70%,55%)]", bgColor: "bg-[hsl(0,30%,14%)]", activeBg: "active:bg-[hsl(0,30%,22%)]", disabled: (s) => !s.bases[0] && !s.bases[1] && !s.bases[2] },
    { action: "wild-pitch", label: "暴投", sub: "WP", color: "text-[hsl(25,70%,55%)]", bgColor: "bg-[hsl(25,35%,13%)]", activeBg: "active:bg-[hsl(25,35%,22%)]", disabled: (s) => !s.bases[0] && !s.bases[1] && !s.bases[2] },
    { action: "balk", label: "ボーク", sub: "BK", color: "text-[hsl(50,70%,55%)]", bgColor: "bg-[hsl(50,35%,13%)]", activeBg: "active:bg-[hsl(50,35%,22%)]", disabled: (s) => !s.bases[0] && !s.bases[1] && !s.bases[2] },
  ],
  other: [
    { action: "walk", label: "四球", sub: "BB", color: "text-[hsl(120,50%,55%)]", bgColor: "bg-[hsl(120,25%,14%)]", activeBg: "active:bg-[hsl(120,25%,22%)]" },
    { action: "hit-by-pitch", label: "死球", sub: "HBP", color: "text-[hsl(0,60%,60%)]", bgColor: "bg-[hsl(0,30%,14%)]", activeBg: "active:bg-[hsl(0,30%,22%)]" },
    { action: "intentional-walk", label: "敬遠", sub: "IBB", color: "text-[hsl(210,50%,60%)]", bgColor: "bg-[hsl(210,30%,14%)]", activeBg: "active:bg-[hsl(210,30%,22%)]" },
    { action: "error", label: "E", sub: "エラー", color: "text-[hsl(38,80%,55%)]", bgColor: "bg-[hsl(38,30%,13%)]", activeBg: "active:bg-[hsl(38,30%,22%)]" },
    { action: "reset", label: "RST", sub: "リセット", color: "text-[hsl(210,20%,55%)]", bgColor: "bg-[hsl(210,20%,12%)]", activeBg: "active:bg-[hsl(210,20%,20%)]" },
  ],
};

export function GameControls({ gameState, onAction }: GameControlsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("count");
  const actions = tabActions[activeTab];

  return (
    <div className="flex flex-1 flex-col bg-[hsl(210,50%,6%)]">
      {/* Tab Bar */}
      <div className="flex border-b border-[hsl(210,40%,18%)] bg-[hsl(210,45%,8%)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-center text-[11px] font-black transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-[hsl(38,100%,50%)] text-[hsl(38,100%,50%)]"
                : "text-[hsl(210,20%,45%)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Buttons Grid */}
      <div className="flex-1 px-3 py-3">
        <div
          className={`grid gap-2 ${
            actions.length <= 3 ? "grid-cols-3" : actions.length <= 4 ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          {actions.map((btn) => {
            const isDisabled = btn.disabled?.(gameState);
            return (
              <button
                key={btn.action}
                type="button"
                onClick={() => onAction(btn.action)}
                disabled={isDisabled}
                className={`flex flex-col items-center justify-center rounded-xl py-4 transition-all active:scale-95 ${btn.bgColor} ${btn.activeBg} ${
                  btn.border ? "border-2 border-[hsl(38,100%,40%)]" : "border border-[hsl(210,30%,18%)]"
                } ${isDisabled ? "opacity-30" : ""}`}
              >
                <span className={`text-lg font-black ${btn.color}`}>{btn.label}</span>
                {btn.sub && (
                  <span className="mt-0.5 text-[9px] font-bold text-[hsl(210,15%,42%)]">{btn.sub}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
