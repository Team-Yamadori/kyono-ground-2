"use client";

import { useAppContext } from "@/lib/store";
import { useGame } from "@/hooks/use-game";
import { BaseDiamond } from "@/components/scoreboard/base-diamond";
import { CountDisplay } from "@/components/scoreboard/count-display";
import { GameControls } from "@/components/scoreboard/game-controls";
import { InningBoard } from "@/components/scoreboard/inning-board";
import { PlayerInfo } from "@/components/scoreboard/player-info";
import { RunnerResolution } from "@/components/scoreboard/runner-resolution";
import { ArrowLeft, Clock, X, UserRoundPlus, Footprints, Shield, ArrowLeftRight } from "lucide-react";
import { getPlayer, POSITION_SHORT, type Team, type Position, ALL_POSITIONS } from "@/lib/team-data";
import { useState, useCallback, useEffect, useRef } from "react";

// ===== Timeout Menu (Power Pro style) =====
type TimeoutAction = "pinch-hit" | "pinch-run" | "defense-change" | "player-swap" | null;

function TimeoutMenu({ onSelect, onClose }: {
  onSelect: (action: TimeoutAction) => void;
  onClose: () => void;
}) {
  const items = [
    { id: "pinch-hit" as const, label: "代打", sub: "PINCH HIT", icon: UserRoundPlus, color: "hsl(0,85%,55%)" },
    { id: "pinch-run" as const, label: "代走", sub: "PINCH RUN", icon: Footprints, color: "hsl(120,60%,45%)" },
    { id: "defense-change" as const, label: "守備交代", sub: "DEFENSE", icon: Shield, color: "hsl(210,80%,55%)" },
    { id: "player-swap" as const, label: "選手交代", sub: "SUBSTITUTION", icon: ArrowLeftRight, color: "hsl(38,100%,50%)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(210,80%,4%)]/80">
      <div className="w-full max-w-md animate-[slideUp_0.2s_ease-out] rounded-t-2xl border-t-2 border-[hsl(38,100%,40%)] bg-[hsl(210,50%,8%)]">
        <div className="flex items-center justify-between border-b border-[hsl(210,40%,18%)] px-4 py-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[hsl(38,100%,50%)]" />
            <span className="text-sm font-black text-[hsl(38,100%,55%)]">タイム</span>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[hsl(210,20%,50%)] active:bg-[hsl(210,30%,15%)]">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-[hsl(210,30%,18%)] bg-[hsl(210,45%,9%)] py-4 active:scale-95 active:bg-[hsl(210,45%,12%)]"
              >
                <Icon size={22} style={{ color: item.color }} />
                <span className="text-xs font-black text-[hsl(48,100%,96%)]">{item.label}</span>
                <span className="text-[8px] font-bold tracking-wider text-[hsl(210,20%,40%)]">{item.sub}</span>
              </button>
            );
          })}
        </div>
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[hsl(210,30%,15%)] py-3 text-sm font-black text-[hsl(210,20%,55%)] active:scale-95"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Long-press drag substitution panel =====
type SubMode = "pinch-hit" | "pinch-run" | "player-swap";

function SubstitutionDragPanel({
  team,
  mode,
  onSubstitute,
  onClose,
}: {
  team: Team;
  mode: SubMode;
  onSubstitute: (lineupIndex: number, benchIndex: number) => void;
  onClose: () => void;
}) {
  const [selectedLineup, setSelectedLineup] = useState<number | null>(null);
  const [selectedBench, setSelectedBench] = useState<number | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [dragging, setDragging] = useState<{ source: "lineup" | "bench"; index: number; x: number; y: number } | null>(null);
  const [hoverTarget, setHoverTarget] = useState<{ source: "lineup" | "bench"; index: number } | null>(null);

  const modeLabel = mode === "pinch-hit" ? "代打" : mode === "pinch-run" ? "代走" : "選手交代";
  const modeColor = mode === "pinch-hit" ? "hsl(0,85%,55%)" : mode === "pinch-run" ? "hsl(120,60%,45%)" : "hsl(38,100%,50%)";

  const lineupPlayers = team.lineup.map((slot) => getPlayer(team, slot.playerId));
  const benchPlayers = team.benchPlayers.map((id) => getPlayer(team, id));

  const clearLP = useCallback(() => {
    if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, source: "lineup" | "bench", index: number) => {
    e.preventDefault();
    const x = e.clientX, y = e.clientY;
    longPressTimerRef.current = setTimeout(() => {
      setDragging({ source, index, x, y });
    }, 300);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging) {
      setDragging((d) => d ? { ...d, x: e.clientX, y: e.clientY } : null);
    }
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    clearLP();
    if (dragging && hoverTarget) {
      const from = dragging;
      const to = hoverTarget;
      if (from.source === "lineup" && to.source === "bench") {
        onSubstitute(from.index, to.index);
      } else if (from.source === "bench" && to.source === "lineup") {
        onSubstitute(to.index, from.index);
      } else if (from.source === "lineup" && to.source === "lineup") {
        // swap lineup order
        setSelectedLineup(from.index);
        setSelectedBench(null);
      }
    }
    setDragging(null);
    setHoverTarget(null);
  }, [dragging, hoverTarget, clearLP, onSubstitute]);

  const handleTap = useCallback((source: "lineup" | "bench", index: number) => {
    if (source === "lineup") {
      setSelectedLineup((prev) => prev === index ? null : index);
    } else {
      setSelectedBench((prev) => prev === index ? null : index);
    }
  }, []);

  const handleConfirm = () => {
    if (selectedLineup !== null && selectedBench !== null) {
      onSubstitute(selectedLineup, selectedBench);
    }
  };

  useEffect(() => { return () => clearLP(); }, [clearLP]);

  const isDragging = dragging !== null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(210,80%,4%)]/80"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="flex max-h-[85vh] w-full max-w-md animate-[slideUp_0.25s_ease-out] flex-col rounded-t-2xl border-t-2 bg-[hsl(210,50%,8%)]" style={{ borderColor: modeColor }}>
        <div className="flex items-center justify-between border-b border-[hsl(210,40%,18%)] px-4 py-2.5">
          <span className="text-sm font-black" style={{ color: modeColor }}>{modeLabel}</span>
          <span className="text-[10px] font-bold text-[hsl(210,20%,45%)]">
            {isDragging ? "入れ替える位置で離す" : "長押しでドラッグ / タップで選択"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Lineup */}
          <div className="px-3 py-2">
            <div className="mb-1 text-[9px] font-bold tracking-wider" style={{ color: modeColor }}>出場中</div>
            <div className="flex flex-col gap-1">
              {lineupPlayers.map((player, i) => {
                const isDragged = dragging?.source === "lineup" && dragging.index === i;
                const isHovered = hoverTarget?.source === "lineup" && hoverTarget.index === i;
                const isSelected = selectedLineup === i;
                return (
                  <div
                    key={team.lineup[i].playerId}
                    onPointerDown={(e) => handlePointerDown(e, "lineup", i)}
                    onPointerEnter={() => isDragging && setHoverTarget({ source: "lineup", index: i })}
                    onClick={() => !isDragging && handleTap("lineup", i)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                      isDragged ? "scale-95 opacity-40"
                      : isHovered ? "border-2 border-dashed border-[hsl(120,50%,40%)] bg-[hsl(120,15%,10%)]"
                      : isSelected ? "border-2 border-[hsl(0,80%,50%)] bg-[hsl(0,30%,14%)]"
                      : "border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,10%)]"
                    }`}
                    style={{ touchAction: "none" }}
                  >
                    <span className="w-4 text-[10px] font-black text-[hsl(38,100%,50%)]">{i + 1}</span>
                    <span className="flex-1 text-left text-[11px] font-bold text-[hsl(48,100%,96%)]">
                      {player?.name ?? "-"}
                    </span>
                    <span className="text-[10px] font-bold text-[hsl(210,60%,65%)]">
                      {POSITION_SHORT[team.lineup[i].fieldPosition]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {(selectedLineup !== null || isDragging) && (
            <div className="flex justify-center py-1">
              <ArrowLeftRight size={14} style={{ color: modeColor }} />
            </div>
          )}

          {/* Bench */}
          <div className="px-3 py-2">
            <div className="mb-1 text-[9px] font-bold tracking-wider text-[hsl(210,20%,50%)]">控え</div>
            <div className="flex flex-col gap-1">
              {benchPlayers.map((player, i) => {
                const isDragged = dragging?.source === "bench" && dragging.index === i;
                const isHovered = hoverTarget?.source === "bench" && hoverTarget.index === i;
                const isSelected = selectedBench === i;
                return (
                  <div
                    key={team.benchPlayers[i]}
                    onPointerDown={(e) => handlePointerDown(e, "bench", i)}
                    onPointerEnter={() => isDragging && setHoverTarget({ source: "bench", index: i })}
                    onClick={() => !isDragging && handleTap("bench", i)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                      isDragged ? "scale-95 opacity-40"
                      : isHovered ? "border-2 border-dashed border-[hsl(120,50%,40%)] bg-[hsl(120,15%,10%)]"
                      : isSelected ? "border-2 border-[hsl(120,50%,45%)] bg-[hsl(120,20%,12%)]"
                      : "border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,10%)]"
                    }`}
                    style={{ touchAction: "none" }}
                  >
                    <span className="w-4 text-[10px] font-black text-[hsl(210,20%,45%)]">控</span>
                    <span className="flex-1 text-left text-[11px] font-bold text-[hsl(48,100%,96%)]">
                      {player?.name ?? "-"}
                    </span>
                    <span className="text-[10px] font-bold text-[hsl(210,60%,65%)]">
                      {player ? POSITION_SHORT[player.position] : "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating drag ghost */}
        {dragging && (
          <div
            className="pointer-events-none fixed z-[60] rounded-lg border-2 bg-[hsl(38,30%,12%)] px-3 py-2 shadow-2xl opacity-90"
            style={{ left: dragging.x - 60, top: dragging.y - 20, borderColor: modeColor }}
          >
            <span className="text-[11px] font-black text-[hsl(48,100%,96%)]">
              {dragging.source === "lineup"
                ? lineupPlayers[dragging.index]?.name
                : benchPlayers[dragging.index]?.name}
            </span>
          </div>
        )}

        <div className="flex gap-3 border-t border-[hsl(210,40%,18%)] px-4 py-3">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-xl bg-[hsl(210,30%,15%)] py-3 text-sm font-black text-[hsl(210,20%,55%)] active:scale-95">
            キャンセル
          </button>
          <button type="button" onClick={handleConfirm}
            disabled={selectedLineup === null || selectedBench === null}
            className={`flex-[2] rounded-xl py-3 text-sm font-black active:scale-95 ${
              selectedLineup !== null && selectedBench !== null
                ? "bg-[hsl(38,100%,45%)] text-[hsl(210,80%,8%)]"
                : "bg-[hsl(210,25%,15%)] text-[hsl(210,15%,35%)]"
            }`}>
            交代する
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Defense Position Swap Panel =====
function DefenseSwapPanel({
  team,
  onSwap,
  onClose,
}: {
  team: Team;
  onSwap: (indexA: number, indexB: number) => void;
  onClose: () => void;
}) {
  const [selectedA, setSelectedA] = useState<number | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [dragging, setDragging] = useState<{ index: number; x: number; y: number } | null>(null);
  const [hoverTarget, setHoverTarget] = useState<number | null>(null);

  const lineupPlayers = team.lineup.map((slot) => getPlayer(team, slot.playerId));

  const clearLP = useCallback(() => {
    if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, index: number) => {
    e.preventDefault();
    const x = e.clientX, y = e.clientY;
    longPressTimerRef.current = setTimeout(() => {
      setDragging({ index, x, y });
    }, 300);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging) setDragging((d) => d ? { ...d, x: e.clientX, y: e.clientY } : null);
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    clearLP();
    if (dragging && hoverTarget !== null && dragging.index !== hoverTarget) {
      onSwap(dragging.index, hoverTarget);
    }
    setDragging(null);
    setHoverTarget(null);
  }, [dragging, hoverTarget, clearLP, onSwap]);

  const handleTap = useCallback((index: number) => {
    if (selectedA === null) {
      setSelectedA(index);
    } else if (selectedA === index) {
      setSelectedA(null);
    } else {
      onSwap(selectedA, index);
      setSelectedA(null);
    }
  }, [selectedA, onSwap]);

  useEffect(() => { return () => clearLP(); }, [clearLP]);

  const isDragging = dragging !== null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(210,80%,4%)]/80"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="flex max-h-[80vh] w-full max-w-md animate-[slideUp_0.25s_ease-out] flex-col rounded-t-2xl border-t-2 border-[hsl(210,80%,55%)] bg-[hsl(210,50%,8%)]">
        <div className="flex items-center justify-between border-b border-[hsl(210,40%,18%)] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-[hsl(210,80%,55%)]" />
            <span className="text-sm font-black text-[hsl(210,80%,65%)]">守備交代</span>
          </div>
          <span className="text-[10px] font-bold text-[hsl(210,20%,45%)]">
            {isDragging ? "入替先で離す" : selectedA !== null ? "交代相手を選択" : "長押しで守備位置を入替"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="flex flex-col gap-1">
            {lineupPlayers.map((player, i) => {
              const isDragged = dragging?.index === i;
              const isHovered = hoverTarget === i;
              const isSelected = selectedA === i;
              return (
                <div
                  key={team.lineup[i].playerId}
                  onPointerDown={(e) => handlePointerDown(e, i)}
                  onPointerEnter={() => isDragging && setHoverTarget(i)}
                  onClick={() => !isDragging && handleTap(i)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all ${
                    isDragged ? "scale-95 opacity-40"
                    : isHovered ? "border-2 border-dashed border-[hsl(210,70%,50%)] bg-[hsl(210,30%,14%)]"
                    : isSelected ? "border-2 border-[hsl(210,80%,55%)] bg-[hsl(210,40%,14%)]"
                    : "border border-[hsl(210,30%,18%)] bg-[hsl(210,50%,10%)]"
                  }`}
                  style={{ touchAction: "none" }}
                >
                  <span className="w-4 text-[10px] font-black text-[hsl(38,100%,50%)]">{i + 1}</span>
                  <span className="flex-1 text-[11px] font-bold text-[hsl(48,100%,96%)]">
                    {player?.name ?? "-"}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[hsl(210,60%,25%)]">
                    <span className="text-[11px] font-black text-[hsl(48,100%,96%)]">
                      {POSITION_SHORT[team.lineup[i].fieldPosition]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {dragging && (
          <div
            className="pointer-events-none fixed z-[60] rounded-lg border-2 border-[hsl(210,80%,55%)] bg-[hsl(210,40%,12%)] px-3 py-2 shadow-2xl opacity-90"
            style={{ left: dragging.x - 60, top: dragging.y - 20 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-[hsl(48,100%,96%)]">
                {lineupPlayers[dragging.index]?.name}
              </span>
              <span className="text-[10px] font-bold text-[hsl(210,60%,65%)]">
                {POSITION_SHORT[team.lineup[dragging.index].fieldPosition]}
              </span>
            </div>
          </div>
        )}

        <div className="border-t border-[hsl(210,40%,18%)] px-4 py-3">
          <button type="button" onClick={onClose}
            className="w-full rounded-xl bg-[hsl(210,30%,15%)] py-3 text-sm font-black text-[hsl(210,20%,55%)] active:scale-95">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Main Game Screen =====
export function GameScreen() {
  const { state, navigate, updateMyTeam, addGameRecord, setActiveGameState } = useAppContext();
  const {
    gameState,
    message,
    pendingPlay,
    handleAction,
    updatePendingSlot,
    cancelPending,
    confirmPending,
  } = useGame();

  const [timeoutMenu, setTimeoutMenu] = useState(false);
  const [subMode, setSubMode] = useState<SubMode | null>(null);
  const [defenseSwap, setDefenseSwap] = useState(false);

  // Sync game state to app provider for resume
  useEffect(() => {
    setActiveGameState(gameState);
  }, [gameState, setActiveGameState]);

  const handleTimeoutSelect = useCallback((action: TimeoutAction) => {
    setTimeoutMenu(false);
    if (action === "pinch-hit" || action === "pinch-run" || action === "player-swap") {
      setSubMode(action === "pinch-hit" ? "pinch-hit" : action === "pinch-run" ? "pinch-run" : "player-swap");
    } else if (action === "defense-change") {
      setDefenseSwap(true);
    }
  }, []);

  const handleSubstitute = useCallback(
    (lineupIndex: number, benchIndex: number) => {
      updateMyTeam((t) => {
        const newLineup = [...t.lineup];
        const newBench = [...t.benchPlayers];
        const oldSlot = newLineup[lineupIndex];
        const benchId = newBench[benchIndex];
        newLineup[lineupIndex] = {
          playerId: benchId,
          fieldPosition: oldSlot.fieldPosition,
        };
        newBench[benchIndex] = oldSlot.playerId;
        return { ...t, lineup: newLineup, benchPlayers: newBench };
      });
      setSubMode(null);
    },
    [updateMyTeam]
  );

  const handleDefenseSwap = useCallback(
    (indexA: number, indexB: number) => {
      updateMyTeam((t) => {
        const newLineup = [...t.lineup];
        const posA = newLineup[indexA].fieldPosition;
        const posB = newLineup[indexB].fieldPosition;
        newLineup[indexA] = { ...newLineup[indexA], fieldPosition: posB };
        newLineup[indexB] = { ...newLineup[indexB], fieldPosition: posA };
        return { ...t, lineup: newLineup };
      });
      setDefenseSwap(false);
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
      homeHits: gameState.home.hits,
      awayHits: gameState.away.hits,
      homeErrors: gameState.home.errors,
      awayErrors: gameState.away.errors,
      homeLineup: state.myTeam.lineup.map((slot) => {
        const p = getPlayer(state.myTeam, slot.playerId);
        return { name: p?.name ?? "-", pos: POSITION_SHORT[slot.fieldPosition], atBats: Math.floor(Math.random() * 3 + 2), hits: Math.floor(Math.random() * 3), rbi: Math.floor(Math.random() * 2), avg: p?.avg ?? 0 };
      }),
      awayLineup: state.opponent.lineup.map((slot) => {
        const p = getPlayer(state.opponent, slot.playerId);
        return { name: p?.name ?? "-", pos: POSITION_SHORT[slot.fieldPosition], atBats: Math.floor(Math.random() * 3 + 2), hits: Math.floor(Math.random() * 3), rbi: Math.floor(Math.random() * 2), avg: p?.avg ?? 0 };
      }),
      homePitchers: [{ name: getPlayer(state.myTeam, state.myTeam.lineup[8]?.playerId)?.name ?? "-", ip: 9, hits: gameState.away.hits, er: gameState.away.runs, so: Math.floor(Math.random() * 8 + 2), bb: Math.floor(Math.random() * 4), result: gameState.home.runs > gameState.away.runs ? "W" : "L" }],
      awayPitchers: [{ name: getPlayer(state.opponent, state.opponent.lineup[8]?.playerId)?.name ?? "-", ip: 9, hits: gameState.home.hits, er: gameState.home.runs, so: Math.floor(Math.random() * 8 + 2), bb: Math.floor(Math.random() * 4), result: gameState.away.runs > gameState.home.runs ? "W" : "L" }],
    };
    addGameRecord(record);
    setActiveGameState(null);
    navigate("score-history");
  }, [state, gameState, addGameRecord, navigate, setActiveGameState]);

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
          onClick={() => setTimeoutMenu(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[hsl(38,60%,30%)] bg-[hsl(38,30%,12%)] px-3 py-1.5 text-[10px] font-black text-[hsl(38,100%,55%)] active:bg-[hsl(38,30%,18%)]"
        >
          <Clock size={13} />
          タイム
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
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${gameState.isTop ? "bg-[hsl(0,75%,45%)]" : "bg-[hsl(0,75%,45%)]/60"}`}>
                {gameState.away.shortName}
              </span>
              <span className="text-2xl font-black tabular-nums text-[hsl(48,100%,96%)]">{gameState.away.runs}</span>
            </div>
            <span className="text-sm font-bold text-[hsl(210,20%,40%)]">-</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tabular-nums text-[hsl(48,100%,96%)]">{gameState.home.runs}</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${!gameState.isTop ? "bg-[hsl(210,80%,40%)]" : "bg-[hsl(210,80%,40%)]/60"}`}>
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

      {timeoutMenu && (
        <TimeoutMenu onSelect={handleTimeoutSelect} onClose={() => setTimeoutMenu(false)} />
      )}

      {subMode && (
        <SubstitutionDragPanel
          team={state.myTeam}
          mode={subMode}
          onSubstitute={handleSubstitute}
          onClose={() => setSubMode(null)}
        />
      )}

      {defenseSwap && (
        <DefenseSwapPanel
          team={state.myTeam}
          onSwap={handleDefenseSwap}
          onClose={() => setDefenseSwap(false)}
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
                onClick={() => { handleAction("reset"); setActiveGameState(null); }}
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
