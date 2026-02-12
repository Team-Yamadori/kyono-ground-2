"use client";

import { useAppContext } from "@/lib/store";
import { POSITION_SHORT, formatAvg, getPlayer, type Team } from "@/lib/team-data";
import { ArrowLeft, Edit3 } from "lucide-react";
import { useState } from "react";

function TeamCard({ team, side, isSelected, onSelect }: {
  team: Team;
  side: "home" | "away";
  isSelected: boolean;
  onSelect: () => void;
}) {
  const starters = team.lineup.map((id) => getPlayer(team, id)).filter(Boolean);
  const topBatter = starters.reduce((best, p) => {
    if (!p) return best;
    if (!best || p.avg > best.avg) return p;
    return best;
  }, starters[0]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col rounded-xl border-2 transition-all active:scale-[0.98] ${
        isSelected
          ? "border-[hsl(38,100%,50%)] bg-[hsl(210,50%,12%)] shadow-[0_0_20px_hsl(38,100%,50%,0.15)]"
          : "border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]"
      }`}
    >
      {/* Team header */}
      <div className="flex items-center gap-3 border-b border-[hsl(210,30%,18%)] px-4 py-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-black text-[hsl(0,0%,100%)]"
          style={{ backgroundColor: team.color }}
        >
          {team.shortName}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-black text-[hsl(48,100%,96%)]">{team.name}</span>
          <span className="text-[10px] text-[hsl(210,20%,50%)]">
            {side === "home" ? "ホーム" : "ビジター"} / {team.players.length}人
          </span>
        </div>
        {isSelected && (
          <div className="ml-auto rounded-md bg-[hsl(38,100%,50%)] px-2 py-0.5 text-[10px] font-black text-[hsl(210,80%,8%)]">
            選択中
          </div>
        )}
      </div>

      {/* Starting lineup preview */}
      <div className="px-3 py-2">
        <div className="mb-1 text-[9px] font-bold text-[hsl(38,100%,50%)]">スタメン</div>
        <div className="flex flex-col gap-0.5">
          {starters.slice(0, 5).map((player, i) => (
            <div key={player?.id ?? i} className="flex items-center gap-2 text-[10px]">
              <span className="w-3 text-right tabular-nums font-bold text-[hsl(38,100%,50%)]">{i + 1}</span>
              <span className="w-5 text-center font-bold text-[hsl(210,60%,65%)]">
                {player ? POSITION_SHORT[player.position] : "-"}
              </span>
              <span className="flex-1 text-left font-bold text-[hsl(48,100%,90%)]">
                {player?.name ?? "-"}
              </span>
              <span className="tabular-nums text-[hsl(120,50%,55%)]">
                {player ? formatAvg(player.avg) : "-"}
              </span>
            </div>
          ))}
          {starters.length > 5 && (
            <div className="text-[9px] text-[hsl(210,20%,40%)]">...他{starters.length - 5}名</div>
          )}
        </div>
      </div>
    </button>
  );
}

export function TeamSelect() {
  const { state, navigate, setSelectedTeamSide } = useAppContext();
  const [selectedSide, setSelectedSide] = useState<"home" | "away">("home");

  const handleEditTeam = (side: "home" | "away") => {
    setSelectedTeamSide(side);
    navigate("team-create");
  };

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
          チーム編成
        </h2>
        <div className="w-12" />
      </div>

      {/* Side tabs */}
      <div className="flex border-b border-[hsl(210,40%,18%)]">
        {(["away", "home"] as const).map((side) => {
          const team = side === "home" ? state.homeTeam : state.awayTeam;
          return (
            <button
              key={side}
              type="button"
              onClick={() => setSelectedSide(side)}
              className={`flex-1 py-3 text-center text-xs font-black transition-colors ${
                selectedSide === side
                  ? "border-b-2 border-[hsl(38,100%,50%)] text-[hsl(38,100%,50%)]"
                  : "text-[hsl(210,20%,45%)]"
              }`}
            >
              {side === "away" ? "ビジター" : "ホーム"} - {team.shortName}
            </button>
          );
        })}
      </div>

      {/* Team Card */}
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <TeamCard
          team={selectedSide === "home" ? state.homeTeam : state.awayTeam}
          side={selectedSide}
          isSelected={true}
          onSelect={() => {}}
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleEditTeam(selectedSide)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[hsl(210,50%,30%)] bg-[hsl(210,50%,14%)] py-3.5 text-sm font-black text-[hsl(210,70%,70%)] active:scale-[0.98]"
          >
            <Edit3 size={16} />
            チーム名/カラー編集
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTeamSide(selectedSide);
              navigate("lineup");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[hsl(38,100%,45%)] py-3.5 text-sm font-black text-[hsl(210,80%,8%)] active:scale-[0.98]"
          >
            オーダー設定
          </button>
        </div>

        {/* Player Roster */}
        <div className="rounded-xl border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,8%)]">
          <div className="border-b border-[hsl(210,30%,18%)] px-4 py-2">
            <span className="text-xs font-black text-[hsl(38,100%,50%)]">
              選手一覧
            </span>
          </div>
          <div className="flex flex-col">
            {(selectedSide === "home" ? state.homeTeam : state.awayTeam).players.map((player, i) => {
              const team = selectedSide === "home" ? state.homeTeam : state.awayTeam;
              const isStarter = team.lineup.includes(player.id);
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => {
                    navigate("player-detail");
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 active:bg-[hsl(210,40%,14%)] ${
                    i < (selectedSide === "home" ? state.homeTeam : state.awayTeam).players.length - 1
                      ? "border-b border-[hsl(210,30%,15%)]"
                      : ""
                  }`}
                >
                  <span className="w-6 text-right text-[11px] font-bold tabular-nums text-[hsl(38,100%,50%)]">
                    #{player.number}
                  </span>
                  <span className="w-6 text-center text-[10px] font-bold text-[hsl(210,60%,65%)]">
                    {POSITION_SHORT[player.position]}
                  </span>
                  <span className="flex-1 text-left text-sm font-bold text-[hsl(48,100%,96%)]">
                    {player.name}
                  </span>
                  {isStarter && (
                    <span className="rounded bg-[hsl(120,40%,20%)] px-1.5 py-0.5 text-[9px] font-bold text-[hsl(120,60%,55%)]">
                      先発
                    </span>
                  )}
                  <span className="text-[11px] tabular-nums font-bold text-[hsl(210,20%,50%)]">
                    {player.era !== undefined ? `ERA ${player.era.toFixed(2)}` : formatAvg(player.avg)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
