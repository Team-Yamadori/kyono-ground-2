"use client";

import { useAppContext } from "@/lib/store";
import { useGame } from "@/hooks/use-game";
import { BaseDiamond } from "@/components/scoreboard/base-diamond";
import { CountDisplay } from "@/components/scoreboard/count-display";
import { GameControls } from "@/components/scoreboard/game-controls";
import { InningBoard } from "@/components/scoreboard/inning-board";
import { PlayerInfo } from "@/components/scoreboard/player-info";
import { RunnerResolution } from "@/components/scoreboard/runner-resolution";
import { ArrowLeft, ArrowLeftRight, Users } from "lucide-react";
import { getPlayer, POSITION_SHORT, formatAvg, formatEra, type Team } from "@/lib/team-data";
import { useState, useCallback } from "react";

function SubstitutionPanel({
  team,
  teamLabel,
  onSubstitute,
  onClose,
}: {
  team: Team;
  teamLabel: string;
  onSubstitute: (lineupIndex: number, benchIndex: number) => void;
  onClose: () => void;
}) {
  const [selectedLineup, setSelectedLineup] = useState<number | null>(null);
  const [selectedBench, setSelectedBench] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedLineup !== null && selectedBench !== null) {
      onSubstitute(selectedLineup, selectedBench);
    }
  };

  const lineupPlayers = team.lineup.map((slot) => getPlayer(team, slot.playerId));
  const benchPlayers = team.benchPlayers.map((id) => getPlayer(team, id));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(210,80%,4%)]/80">
      <div className="w-full max-w-md animate-[slideUp_0.25s_ease-out] rounded-t-2xl border-t-2 border-[hsl(38,100%,40%)] bg-[hsl(210,50%,8%)]">
        <div className="flex items-center justify-between border-b border-[hsl(210,40%,18%)] px-4 py-3">
          <span className="text-sm font-black text-[hsl(38,100%,55%)]">選手交代</span>
          <span className="text-[10px] font-bold text-[hsl(210,20%,45%)]">{teamLabel}</span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="px-3 py-2">
            <div className="mb-1.5 text-[9px] font-bold tracking-wider text-[hsl(38,100%,50%)]">出場中</div>
            <div className="flex flex-col gap-1">
              {lineupPlayers.map((player, i) => (
                <button
                  key={team.lineup[i].playerId}
                  type="button"
                  onClick={() => setSelectedLineup(selectedLineup === i ? null : i)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    selectedLineup === i
                      ? "border-2 border-[hsl(0,80%,50%)] bg-[hsl(0,30%,14%)]"
                      : "border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,10%)]"
                  }`}
                >
                  <span className="w-4 text-[10px] font-black text-[hsl(38,100%,50%)]">{i + 1}</span>
                  <span className="w-5 text-[10px] font-bold text-[hsl(210,60%,65%)]">
                    {POSITION_SHORT[team.lineup[i].fieldPosition]}
                  </span>
                  <span className="flex-1 text-left text-[11px] font-bold text-[hsl(48,100%,96%)]">
                    {player?.name ?? "-"}
                  </span>
                  <span className="text-[10px] tabular-nums text-[hsl(210,20%,50%)]">
                    {player && player.era !== undefined ? formatEra(player.era) : player ? formatAvg(player.avg) : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedLineup !== null && (
            <div className="flex justify-center py-1">
              <ArrowLeftRight size={16} className="text-[hsl(38,100%,50%)]" />
            </div>
          )}

          <div className="px-3 py-2">
            <div className="mb-1.5 text-[9px] font-bold tracking-wider text-[hsl(210,20%,50%)]">控え</div>
            <div className="flex flex-col gap-1">
              {benchPlayers.map((player, i) => (
                <button
                  key={team.benchPlayers[i]}
                  type="button"
                  onClick={() => setSelectedBench(selectedBench === i ? null : i)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    selectedBench === i
                      ? "border-2 border-[hsl(120,50%,45%)] bg-[hsl(120,20%,12%)]"
                      : "border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,10%)]"
                  }`}
                >
                  <span className="w-4 text-[10px] font-black text-[hsl(210,20%,45%)]">控</span>
                  <span className="w-5 text-[10px] font-bold text-[hsl(210,60%,65%)]">
                    {player ? POSITION_SHORT[player.position] : "-"}
                  </span>
                  <span className="flex-1 text-left text-[11px] font-bold text-[hsl(48,100%,96%)]">
                    {player?.name ?? "-"}
                  </span>
                  <span className="text-[10px] tabular-nums text-[hsl(210,20%,50%)]">
                    {player && player.era !== undefined ? formatEra(player.era) : player ? formatAvg(player.avg) : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-[hsl(210,40%,18%)] px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[hsl(210,30%,15%)] py-3 text-sm font-black text-[hsl(210,20%,55%)] active:scale-95"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedLineup === null || selectedBench === null}
            className={`flex-[2] rounded-xl py-3 text-sm font-black active:scale-95 ${
              selectedLineup !== null && selectedBench !== null
                ? "bg-[hsl(38,100%,45%)] text-[hsl(210,80%,8%)]"
                : "bg-[hsl(210,25%,15%)] text-[hsl(210,15%,35%)]"
            }`}
          >
            交代する
          </button>
        </div>
      </div>
    </div>
  );
}

export function GameScreen() {
  const { state, navigate, updateMyTeam, addGameRecord } = useAppContext();
  const {
    gameState,
    message,
    pendingPlay,
    handleAction,
    updatePendingSlot,
    cancelPending,
    confirmPending,
  } = useGame();

  const [showSubPanel, setShowSubPanel] = useState(false);

  const handleSubstitute = useCallback(
    (lineupIndex: number, benchIndex: number) => {
      updateMyTeam((t) => {
        const newLineup = [...t.lineup];
        const newBench = [...t.benchPlayers];
        const oldSlot = newLineup[lineupIndex];
        const benchId = newBench[benchIndex];
        const benchPlayer = t.players.find((p) => p.id === benchId);
        newLineup[lineupIndex] = {
          playerId: benchId,
          fieldPosition: benchPlayer?.position === "投手" ? oldSlot.fieldPosition : oldSlot.fieldPosition,
        };
        newBench[benchIndex] = oldSlot.playerId;
        return { ...t, lineup: newLineup, benchPlayers: newBench };
      });
      setShowSubPanel(false);
    },
    [updateMyTeam]
  );

  const handleGameEnd = useCallback(() => {
    const record = {
      id: `game-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      homeTeam: state.myTeam.name,
      awayTeam: state.opponent.name,
      homeShort: state.myTeam.shortName,
      awayShort: state.opponent.shortName,
      homeColor: state.myTeam.color,
      awayColor: state.opponent.color,
      homeScore: gameState.home.runs,
      awayScore: gameState.away.runs,
      innings: { away: gameState.away.scores, home: gameState.home.scores },
      homeHits: Math.floor(Math.random() * 8 + 4),
      awayHits: Math.floor(Math.random() * 8 + 3),
      homeErrors: Math.floor(Math.random() * 3),
      awayErrors: Math.floor(Math.random() * 3),
      homeLineup: state.myTeam.lineup.map((slot) => {
        const p = getPlayer(state.myTeam, slot.playerId);
        return { name: p?.name ?? "-", pos: POSITION_SHORT[slot.fieldPosition], atBats: Math.floor(Math.random() * 3 + 2), hits: Math.floor(Math.random() * 3), rbi: Math.floor(Math.random() * 2), avg: p?.avg ?? 0 };
      }),
      awayLineup: state.opponent.lineup.map((slot) => {
        const p = getPlayer(state.opponent, slot.playerId);
        return { name: p?.name ?? "-", pos: POSITION_SHORT[slot.fieldPosition], atBats: Math.floor(Math.random() * 3 + 2), hits: Math.floor(Math.random() * 3), rbi: Math.floor(Math.random() * 2), avg: p?.avg ?? 0 };
      }),
      homePitchers: [{ name: getPlayer(state.myTeam, state.myTeam.lineup[8]?.playerId)?.name ?? "-", ip: 9, hits: Math.floor(Math.random() * 8 + 3), er: gameState.away.runs, so: Math.floor(Math.random() * 8 + 2), bb: Math.floor(Math.random() * 4), result: gameState.home.runs > gameState.away.runs ? "W" : "L" }],
      awayPitchers: [{ name: getPlayer(state.opponent, state.opponent.lineup[8]?.playerId)?.name ?? "-", ip: 9, hits: Math.floor(Math.random() * 8 + 4), er: gameState.home.runs, so: Math.floor(Math.random() * 8 + 2), bb: Math.floor(Math.random() * 4), result: gameState.away.runs > gameState.home.runs ? "W" : "L" }],
    };
    addGameRecord(record);
    navigate("score-history");
  }, [state, gameState, addGameRecord, navigate]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-[hsl(210,70%,8%)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[hsl(210,40%,18%)] bg-[hsl(210,60%,6%)] px-3 py-2">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="flex items-center gap-1 text-[hsl(210,20%,55%)] active:opacity-70"
        >
          <ArrowLeft size={16} />
          <span className="text-[10px] font-bold">メニュー</span>
        </button>
        <button
          type="button"
          onClick={() => setShowSubPanel(true)}
          className="flex items-center gap-1 rounded-lg bg-[hsl(210,40%,16%)] px-2.5 py-1.5 text-[10px] font-bold text-[hsl(210,50%,65%)] active:bg-[hsl(210,40%,22%)]"
        >
          <Users size={12} />
          選手交代
        </button>
      </div>

      <div className="flex w-full flex-1 flex-col">
        {/* Score HUD */}
        <div className="flex items-stretch border-b border-[hsl(210,50%,25%)] bg-[hsl(210,70%,8%)]">
          <div className="flex items-center gap-1 border-r border-[hsl(210,50%,25%)] px-3 py-2">
            <div className="flex flex-col items-center leading-none">
              <svg width="10" height="6" viewBox="0 0 10 6" className={gameState.isTop ? "opacity-100" : "opacity-20"} aria-hidden="true">
                <polygon points="5,0 10,6 0,6" fill={gameState.isTop ? "hsl(38, 100%, 50%)" : "hsl(210, 30%, 40%)"} />
              </svg>
              <svg width="10" height="6" viewBox="0 0 10 6" className={`mt-0.5 ${!gameState.isTop ? "opacity-100" : "opacity-20"}`} aria-hidden="true">
                <polygon points="5,6 10,0 0,0" fill={!gameState.isTop ? "hsl(38, 100%, 50%)" : "hsl(210, 30%, 40%)"} />
              </svg>
            </div>
            <span className="text-xl font-black text-[hsl(38,100%,50%)]">{gameState.inning}</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-4 px-3">
            <div className="flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-[hsl(0,0%,100%)] ${gameState.isTop ? "bg-[hsl(0,75%,45%)]" : "bg-[hsl(0,75%,45%)]/60"}`}>
                {gameState.away.shortName}
              </span>
              <span className="text-2xl font-black tabular-nums text-[hsl(48,100%,96%)]">{gameState.away.runs}</span>
            </div>
            <span className="text-sm font-bold text-[hsl(210,20%,40%)]">-</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tabular-nums text-[hsl(48,100%,96%)]">{gameState.home.runs}</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-[hsl(0,0%,100%)] ${!gameState.isTop ? "bg-[hsl(210,80%,40%)]" : "bg-[hsl(210,80%,40%)]/60"}`}>
                {gameState.home.shortName}
              </span>
            </div>
          </div>
          <div className="flex items-center border-l border-[hsl(210,50%,25%)] px-3">
            <BaseDiamond bases={gameState.bases} size="sm" />
          </div>
        </div>

        <CountDisplay balls={gameState.balls} strikes={gameState.strikes} outs={gameState.outs} />
        <PlayerInfo batter={gameState.currentBatter} pitcher={gameState.currentPitcher} />
        <InningBoard home={gameState.home} away={gameState.away} currentInning={gameState.inning} isTop={gameState.isTop} />

        <div className="flex items-center justify-center bg-[hsl(210,60%,7%)] py-4">
          <BaseDiamond bases={gameState.bases} size="lg" />
        </div>

        <GameControls gameState={gameState} onAction={handleAction} />
      </div>

      {pendingPlay && (
        <RunnerResolution play={pendingPlay} onUpdate={updatePendingSlot} onCancel={cancelPending} onConfirm={confirmPending} />
      )}

      {showSubPanel && (
        <SubstitutionPanel
          team={state.myTeam}
          teamLabel={state.myTeam.name}
          onSubstitute={handleSubstitute}
          onClose={() => setShowSubPanel(false)}
        />
      )}

      {message && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="animate-bounce rounded-2xl border-4 border-[hsl(38,100%,50%)] bg-[hsl(210,80%,8%)] px-8 py-4 shadow-[0_0_60px_hsl(38,100%,50%,0.5)]">
            <span className="text-2xl font-black text-[hsl(38,100%,50%)]">{message}</span>
          </div>
        </div>
      )}

      {gameState.isGameOver && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-[hsl(210,80%,4%)]/80">
          <div className="pointer-events-auto flex flex-col items-center gap-4">
            <span className="text-4xl font-black text-[hsl(38,100%,50%)]">GAME SET</span>
            <div className="flex items-center gap-4 text-xl font-black text-[hsl(48,100%,96%)]">
              <span>{gameState.away.shortName} {gameState.away.runs}</span>
              <span className="text-[hsl(210,20%,40%)]">-</span>
              <span>{gameState.home.runs} {gameState.home.shortName}</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleAction("reset")}
                className="rounded-xl bg-[hsl(210,30%,18%)] px-6 py-3 text-sm font-black text-[hsl(210,20%,60%)] active:scale-95"
              >
                もう一度
              </button>
              <button
                type="button"
                onClick={handleGameEnd}
                className="rounded-xl bg-[hsl(38,100%,50%)] px-8 py-3 text-sm font-black text-[hsl(210,80%,8%)] active:scale-95"
              >
                結果を保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
