"use client";

import { useAppContext } from "@/lib/store";
import {
  POSITION_SHORT,
  formatAvg,
  formatEra,
  type Player,
} from "@/lib/team-data";
import { ArrowLeft, TrendingUp, Shield } from "lucide-react";
import { useState } from "react";

function PlayerDetailCard({ player, onClose }: { player: Player; onClose: () => void }) {
  const isPitcher = player.position === "投手";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(210,80%,4%)]/80 px-4">
      <div className="w-full max-w-md animate-[slideUp_0.2s_ease-out] rounded-2xl border border-[hsl(210,30%,20%)] bg-[hsl(210,50%,8%)] shadow-[0_0_40px_hsl(38,100%,50%,0.1)]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[hsl(210,30%,18%)] px-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(210,60%,25%)]">
            <span className="text-lg font-black text-[hsl(48,100%,96%)]">
              {POSITION_SHORT[player.position]}
            </span>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold tabular-nums text-[hsl(38,100%,50%)]">#{player.number}</span>
              <span className="text-lg font-black text-[hsl(48,100%,96%)]">{player.name}</span>
            </div>
            <span className="text-[10px] text-[hsl(210,20%,50%)]">{player.position}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[hsl(210,30%,15%)] px-3 py-1.5 text-[10px] font-bold text-[hsl(210,20%,55%)] active:scale-95"
          >
            閉じる
          </button>
        </div>

        {/* Stats */}
        <div className="px-4 py-3">
          <div className="mb-2 text-[10px] font-black tracking-wider text-[hsl(38,100%,50%)]">STATS</div>
          {isPitcher ? (
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="ERA" value={formatEra(player.era ?? 0)} color="hsl(38,100%,55%)" />
              <StatBox label="勝" value={String(player.wins ?? 0)} color="hsl(120,50%,55%)" />
              <StatBox label="敗" value={String(player.losses ?? 0)} color="hsl(0,70%,55%)" />
              <StatBox label="奪三振" value={String(player.strikeouts ?? 0)} color="hsl(210,70%,65%)" />
              <StatBox label="与四球" value={String(player.walks ?? 0)} color="hsl(210,30%,55%)" />
              <StatBox label="投球回" value={String(player.inningsPitched ?? 0)} color="hsl(210,20%,55%)" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="打率" value={formatAvg(player.avg)} color="hsl(120,50%,55%)" />
              <StatBox label="本塁打" value={String(player.hr)} color="hsl(38,100%,55%)" />
              <StatBox label="打点" value={String(player.rbi)} color="hsl(0,70%,55%)" />
              <StatBox label="安打" value={String(player.hits)} color="hsl(210,70%,65%)" />
              <StatBox label="盗塁" value={String(player.stolenBases)} color="hsl(180,60%,50%)" />
              <StatBox label="出塁率" value={player.obp.toFixed(3).replace(/^0/, "")} color="hsl(210,50%,65%)" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-[hsl(210,30%,18%)] bg-[hsl(210,45%,10%)] py-2">
      <span className="text-[9px] font-bold text-[hsl(210,20%,45%)]">{label}</span>
      <span className="text-base font-black tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export function PlayerStatsScreen() {
  const { state, navigate } = useAppContext();
  const [activeTab, setActiveTab] = useState<"home" | "away">("home");
  const [viewMode, setViewMode] = useState<"batter" | "pitcher">("batter");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const team = activeTab === "home" ? state.myTeam : state.opponent;
  const players = team.players.filter((p) =>
    viewMode === "pitcher" ? p.position === "投手" : p.position !== "投手"
  );

  // Sort batters by AVG, pitchers by ERA
  const sorted = [...players].sort((a, b) =>
    viewMode === "pitcher"
      ? (a.era ?? 99) - (b.era ?? 99)
      : b.avg - a.avg
  );

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)]">
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
          個人成績
        </h2>
        <div className="w-12" />
      </div>

      {/* Team tabs */}
      <div className="flex border-b border-[hsl(210,40%,18%)]">
        {(["away", "home"] as const).map((side) => {
          const t = side === "home" ? state.myTeam : state.opponent;
          return (
            <button
              key={side}
              type="button"
              onClick={() => setActiveTab(side)}
              className={`flex-1 py-2.5 text-center text-xs font-black transition-colors ${
                activeTab === side
                  ? "border-b-2 border-[hsl(38,100%,50%)] text-[hsl(38,100%,50%)]"
                  : "text-[hsl(210,20%,45%)]"
              }`}
            >
              {t.shortName}
            </button>
          );
        })}
      </div>

      {/* Batter/Pitcher toggle */}
      <div className="flex gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setViewMode("batter")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition-all ${
            viewMode === "batter"
              ? "bg-[hsl(38,100%,45%)] text-[hsl(210,80%,8%)]"
              : "bg-[hsl(210,40%,14%)] text-[hsl(210,20%,50%)]"
          }`}
        >
          <TrendingUp size={14} />
          野手
        </button>
        <button
          type="button"
          onClick={() => setViewMode("pitcher")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition-all ${
            viewMode === "pitcher"
              ? "bg-[hsl(38,100%,45%)] text-[hsl(210,80%,8%)]"
              : "bg-[hsl(210,40%,14%)] text-[hsl(210,20%,50%)]"
          }`}
        >
          <Shield size={14} />
          投手
        </button>
      </div>

      {/* Stats table header */}
      <div className="flex items-center gap-2 bg-[hsl(210,50%,10%)] px-4 py-2">
        <span className="w-5 text-[8px] font-bold text-[hsl(210,20%,40%)]">#</span>
        <span className="w-5 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">守</span>
        <span className="flex-1 text-[8px] font-bold text-[hsl(210,20%,40%)]">選手名</span>
        {viewMode === "batter" ? (
          <>
            <span className="w-10 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">打率</span>
            <span className="w-8 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">HR</span>
            <span className="w-8 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">打点</span>
            <span className="w-8 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">安打</span>
          </>
        ) : (
          <>
            <span className="w-10 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">ERA</span>
            <span className="w-8 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">勝</span>
            <span className="w-8 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">敗</span>
            <span className="w-8 text-center text-[8px] font-bold text-[hsl(210,20%,40%)]">奪三</span>
          </>
        )}
      </div>

      {/* Player rows */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {sorted.map((player, i) => (
          <button
            key={player.id}
            type="button"
            onClick={() => setSelectedPlayer(player)}
            className={`flex items-center gap-2 px-4 py-2.5 active:bg-[hsl(210,40%,14%)] ${
              i < sorted.length - 1 ? "border-b border-[hsl(210,30%,14%)]" : ""
            }`}
          >
            <span className="w-5 text-[10px] font-bold tabular-nums text-[hsl(38,100%,50%)]">
              #{player.number}
            </span>
            <span className="w-5 text-center text-[10px] font-bold text-[hsl(210,60%,65%)]">
              {POSITION_SHORT[player.position]}
            </span>
            <span className="flex-1 text-left text-[11px] font-bold text-[hsl(48,100%,96%)]">
              {player.name}
            </span>
            {viewMode === "batter" ? (
              <>
                <span className="w-10 text-center text-[11px] font-bold tabular-nums text-[hsl(120,50%,55%)]">
                  {formatAvg(player.avg)}
                </span>
                <span className="w-8 text-center text-[11px] font-bold tabular-nums text-[hsl(38,100%,55%)]">
                  {player.hr}
                </span>
                <span className="w-8 text-center text-[11px] font-bold tabular-nums text-[hsl(0,70%,55%)]">
                  {player.rbi}
                </span>
                <span className="w-8 text-center text-[11px] font-bold tabular-nums text-[hsl(210,50%,60%)]">
                  {player.hits}
                </span>
              </>
            ) : (
              <>
                <span className="w-10 text-center text-[11px] font-bold tabular-nums text-[hsl(38,100%,55%)]">
                  {formatEra(player.era ?? 0)}
                </span>
                <span className="w-8 text-center text-[11px] font-bold tabular-nums text-[hsl(120,50%,55%)]">
                  {player.wins ?? 0}
                </span>
                <span className="w-8 text-center text-[11px] font-bold tabular-nums text-[hsl(0,70%,55%)]">
                  {player.losses ?? 0}
                </span>
                <span className="w-8 text-center text-[11px] font-bold tabular-nums text-[hsl(210,50%,60%)]">
                  {player.strikeouts ?? 0}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Player detail modal */}
      {selectedPlayer && (
        <PlayerDetailCard
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
