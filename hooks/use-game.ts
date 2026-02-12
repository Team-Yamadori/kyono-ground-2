"use client";

import { useCallback, useState } from "react";
import {
  type ComplexAction,
  type Destination,
  type GameAction,
  type GameState,
  type PendingPlay,
  type PlayerData,
  type RunnerSlot,
  initialGameState,
} from "@/lib/game-state";

const batterNames = [
  "猪狩 守", "矢部 明雄", "六道 聖", "友沢 亮", "橘 みずき",
  "阿畑 やすし", "東條 小次郎", "冴木 創", "茂野 吾郎",
];
const pitcherNames = [
  "早川 あおい", "猪狩 進", "聖 エミリア", "涼風 希望", "木場 嵐士",
];

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [batterIndex, setBatterIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingPlay, setPendingPlay] = useState<PendingPlay | null>(null);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 1800);
  }, []);

  const nextBatter = useCallback((): PlayerData => {
    let idx = 0;
    setBatterIndex((prev) => {
      idx = (prev + 1) % batterNames.length;
      return idx;
    });
    return {
      name: batterNames[(batterIndex + 1) % batterNames.length],
      number: ((batterIndex + 1) % batterNames.length) + 1,
      position: "野手",
      avg: `.${Math.floor(Math.random() * 200 + 200)}`,
    };
  }, [batterIndex]);

  // --- State helpers ---
  const ensureInningScore = (s: GameState): GameState => {
    const team = s.isTop ? "away" : "home";
    const d = { ...s[team] };
    const sc = [...d.scores];
    if (sc[s.inning - 1] === null) sc[s.inning - 1] = 0;
    d.scores = sc;
    return { ...s, [team]: d };
  };

  const addRuns = (s: GameState, r: number): GameState => {
    if (r <= 0) return s;
    const t = s.isTop ? "away" : "home";
    const d = { ...s[t] };
    d.runs += r;
    const sc = [...d.scores];
    sc[s.inning - 1] = (sc[s.inning - 1] || 0) + r;
    d.scores = sc;
    return { ...s, [t]: d };
  };

  const addHits = (s: GameState, h: number): GameState => {
    const t = s.isTop ? "away" : "home";
    const d = { ...s[t] }; d.hits += h;
    return { ...s, [t]: d };
  };

  const addErrors = (s: GameState, e: number): GameState => {
    const t = s.isTop ? "home" : "away";
    const d = { ...s[t] }; d.errors += e;
    return { ...s, [t]: d };
  };

  const resetCount = (s: GameState): GameState => ({ ...s, balls: 0, strikes: 0 });

  const forceAdvance = (bases: [boolean, boolean, boolean]): { newBases: [boolean, boolean, boolean]; runs: number } => {
    let runs = 0;
    const b: [boolean, boolean, boolean] = [...bases];
    if (b[0]) { if (b[1]) { if (b[2]) runs++; b[2] = true; } b[1] = true; }
    b[0] = true;
    return { newBases: b, runs };
  };

  const checkThreeOuts = useCallback((s: GameState): GameState => {
    if (s.outs < 3) return s;
    let state = ensureInningScore(s);
    if (state.isTop) {
      return { ...state, isTop: false, balls: 0, strikes: 0, outs: 0, bases: [false, false, false], currentBatter: nextBatter() };
    }
    const homeScores = [...state.home.scores];
    if (homeScores[state.inning - 1] === null) homeScores[state.inning - 1] = 0;
    state = { ...state, home: { ...state.home, scores: homeScores } };
    const next = state.inning + 1;
    if (next > 9) {
      if (state.home.runs !== state.away.runs) {
        showMessage("試合終了!");
        return { ...state, isPlaying: false, isGameOver: true };
      }
      showMessage("試合終了!");
      return { ...state, isPlaying: false, isGameOver: true };
    }
    return { ...state, inning: next, isTop: true, balls: 0, strikes: 0, outs: 0, bases: [false, false, false], currentBatter: nextBatter() };
  }, [nextBatter, showMessage]);

  // --- Build PendingPlay for complex actions ---
  const buildPendingPlay = useCallback((action: ComplexAction, state: GameState): PendingPlay | null => {
    const [r1, r2, r3] = state.bases;
    const slots: RunnerSlot[] = [];
    const hasRunners = r1 || r2 || r3;

    switch (action) {
      case "single": {
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "home", options: ["home", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "home", options: ["home", "3B"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "2B", options: ["2B", "3B", "home"] });
        slots.push({ from: "batter", label: "打者", destination: "1B", options: ["1B", "2B"] });
        return { actionLabel: "シングルヒット", slots, isHit: true, isError: false };
      }
      case "double": {
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "home", options: ["home"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "home", options: ["home", "3B"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "3B", options: ["3B", "home"] });
        slots.push({ from: "batter", label: "打者", destination: "2B", options: ["2B"] });
        return { actionLabel: "二塁打", slots, isHit: true, isError: false };
      }
      case "sacrifice-fly": {
        if (!r3) return null;
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "home", options: ["home", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "stay", options: ["stay", "3B"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "stay", options: ["stay", "2B"] });
        slots.push({ from: "batter", label: "打者", destination: "out", options: ["out"] });
        return { actionLabel: "犠牲フライ", slots, isHit: false, isError: false };
      }
      case "sacrifice-bunt": {
        if (!hasRunners) return null;
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "home", options: ["home", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "3B", options: ["3B", "home", "stay"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "2B", options: ["2B", "3B"] });
        slots.push({ from: "batter", label: "打者", destination: "out", options: ["out", "1B"] });
        return { actionLabel: "犠打", slots, isHit: false, isError: false };
      }
      case "double-play": {
        if (!hasRunners || state.outs >= 2) return null;
        // Batter is always out. Pick which runner is also out.
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "stay", options: ["out", "home", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "stay", options: ["out", "3B", "stay"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "out", options: ["out", "2B"] });
        slots.push({ from: "batter", label: "打者", destination: "out", options: ["out"] });
        return { actionLabel: "併殺 (ゲッツー)", slots, isHit: false, isError: false };
      }
      case "fielders-choice": {
        if (!hasRunners) return null;
        // Batter reaches 1st, pick which runner is out
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "stay", options: ["out", "home", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "3B", options: ["out", "3B", "stay"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "out", options: ["out", "2B", "3B"] });
        slots.push({ from: "batter", label: "打者", destination: "1B", options: ["1B"] });
        return { actionLabel: "フィールダーズチョイス", slots, isHit: false, isError: false };
      }
      case "stolen-base": {
        if (!hasRunners) return null;
        // Each runner can steal (advance 1) or stay
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "stay", options: ["home", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "3B", options: ["3B", "stay"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "2B", options: ["2B", "stay"] });
        return { actionLabel: "盗塁", slots, isHit: false, isError: false };
      }
      case "caught-stealing": {
        if (!hasRunners) return null;
        // Each runner can be caught (out) or stay
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "stay", options: ["out", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "stay", options: ["out", "stay"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "out", options: ["out", "stay"] });
        return { actionLabel: "盗塁失敗", slots, isHit: false, isError: false };
      }
      case "wild-pitch": {
        if (!hasRunners) return null;
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "home", options: ["home", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "3B", options: ["3B", "home", "stay"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "2B", options: ["2B", "3B"] });
        return { actionLabel: "暴投", slots, isHit: false, isError: false };
      }
      case "balk": {
        if (!hasRunners) return null;
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "home", options: ["home"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "3B", options: ["3B"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "2B", options: ["2B"] });
        return { actionLabel: "ボーク", slots, isHit: false, isError: false };
      }
      case "error": {
        if (r3) slots.push({ from: "3B", label: "3塁走者", destination: "home", options: ["home", "stay"] });
        if (r2) slots.push({ from: "2B", label: "2塁走者", destination: "3B", options: ["3B", "home", "stay"] });
        if (r1) slots.push({ from: "1B", label: "1塁走者", destination: "2B", options: ["2B", "3B", "home"] });
        slots.push({ from: "batter", label: "打者", destination: "1B", options: ["1B", "2B", "3B"] });
        return { actionLabel: "エラー", slots, isHit: false, isError: true };
      }
      default:
        return null;
    }
  }, []);

  // --- Resolve the pending play ---
  const resolvePlay = useCallback((play: PendingPlay) => {
    setGameState((prev) => {
      let s = ensureInningScore(prev);
      const newBases: [boolean, boolean, boolean] = [false, false, false];
      let runs = 0;
      let outs = s.outs;

      // Process each slot
      for (const slot of play.slots) {
        const dest = slot.destination;
        if (dest === "out") {
          outs++;
        } else if (dest === "home") {
          runs++;
        } else if (dest === "1B") {
          newBases[0] = true;
        } else if (dest === "2B") {
          newBases[1] = true;
        } else if (dest === "3B") {
          newBases[2] = true;
        } else if (dest === "stay") {
          // Stay at current base
          if (slot.from === "1B") newBases[0] = true;
          if (slot.from === "2B") newBases[1] = true;
          if (slot.from === "3B") newBases[2] = true;
        }
      }

      s = addRuns(s, runs);
      if (play.isHit) s = addHits(s, 1);
      if (play.isError) s = addErrors(s, 1);

      s = { ...resetCount(s), outs, bases: newBases, currentBatter: nextBatter() };

      if (runs > 0) {
        showMessage(runs >= 2 ? `${runs}点!` : "得点!");
      } else {
        showMessage(`${play.actionLabel}!`);
      }

      if (outs >= 3) {
        showMessage("チェンジ!");
        return checkThreeOuts(s);
      }
      return s;
    });
    setPendingPlay(null);
  }, [nextBatter, checkThreeOuts, showMessage]);

  // --- Handle action from controls ---
  const handleAction = useCallback((action: GameAction) => {
    if (gameState.isGameOver && action !== "reset") return;

    // Check if complex action
    const complexActions: ComplexAction[] = [
      "single", "double", "sacrifice-fly", "sacrifice-bunt",
      "double-play", "fielders-choice", "stolen-base", "caught-stealing",
      "wild-pitch", "balk", "error",
    ];

    if (complexActions.includes(action as ComplexAction)) {
      const play = buildPendingPlay(action as ComplexAction, gameState);
      if (!play) {
        showMessage("走者がいません");
        return;
      }
      // If every slot has only 1 option, auto-resolve
      const allSingle = play.slots.every((sl) => sl.options.length <= 1);
      if (allSingle) {
        resolvePlay(play);
      } else {
        setPendingPlay(play);
      }
      return;
    }

    // Simple instant actions
    setGameState((prev) => {
      let s = ensureInningScore(prev);
      switch (action) {
        case "ball": {
          const nb = s.balls + 1;
          if (nb >= 4) {
            showMessage("フォアボール!");
            const { newBases, runs } = forceAdvance(s.bases);
            s = addRuns(s, runs);
            return { ...resetCount(s), bases: newBases, currentBatter: nextBatter() };
          }
          return { ...s, balls: nb };
        }
        case "strike": {
          const ns = s.strikes + 1;
          if (ns >= 3) {
            showMessage("三振!");
            const no = s.outs + 1;
            s = { ...resetCount(s), outs: no, currentBatter: nextBatter() };
            if (no >= 3) { showMessage("チェンジ!"); return checkThreeOuts(s); }
            return s;
          }
          return { ...s, strikes: ns };
        }
        case "foul": {
          if (s.strikes < 2) return { ...s, strikes: s.strikes + 1 };
          showMessage("ファウル!");
          return s;
        }
        case "homerun": {
          const on = (s.bases[0] ? 1 : 0) + (s.bases[1] ? 1 : 0) + (s.bases[2] ? 1 : 0);
          const scored = on + 1;
          showMessage(scored === 4 ? "満塁ホームラン!!" : scored >= 2 ? `${scored}ランHR!` : "ソロホームラン!");
          s = addRuns(s, scored);
          s = addHits(s, 1);
          return { ...resetCount(s), bases: [false, false, false], currentBatter: nextBatter() };
        }
        case "triple": {
          let r = 0;
          if (s.bases[0]) r++; if (s.bases[1]) r++; if (s.bases[2]) r++;
          showMessage("三塁打!");
          s = addRuns(s, r);
          s = addHits(s, 1);
          return { ...resetCount(s), bases: [false, false, true], currentBatter: nextBatter() };
        }
        case "out": {
          showMessage("アウト!");
          const no = s.outs + 1;
          s = { ...resetCount(s), outs: no, currentBatter: nextBatter() };
          if (no >= 3) { showMessage("チェンジ!"); return checkThreeOuts(s); }
          return s;
        }
        case "walk": {
          showMessage("フォアボール!");
          const { newBases, runs } = forceAdvance(s.bases);
          s = addRuns(s, runs);
          return { ...resetCount(s), bases: newBases, currentBatter: nextBatter() };
        }
        case "hit-by-pitch": {
          showMessage("死球!");
          const { newBases, runs } = forceAdvance(s.bases);
          s = addRuns(s, runs);
          return { ...resetCount(s), bases: newBases, currentBatter: nextBatter() };
        }
        case "intentional-walk": {
          showMessage("敬遠!");
          const { newBases, runs } = forceAdvance(s.bases);
          s = addRuns(s, runs);
          return { ...resetCount(s), bases: newBases, currentBatter: nextBatter() };
        }
        case "reset": {
          showMessage("リセット!");
          setBatterIndex(0);
          return initialGameState;
        }
        default:
          return s;
      }
    });
  }, [gameState, buildPendingPlay, resolvePlay, nextBatter, checkThreeOuts, showMessage]);

  const updatePendingSlot = useCallback((slotIndex: number, dest: Destination) => {
    setPendingPlay((prev) => {
      if (!prev) return null;
      const newSlots = prev.slots.map((sl, i) =>
        i === slotIndex ? { ...sl, destination: dest } : sl,
      );
      return { ...prev, slots: newSlots };
    });
  }, []);

  const cancelPending = useCallback(() => setPendingPlay(null), []);

  const confirmPending = useCallback(() => {
    if (pendingPlay) resolvePlay(pendingPlay);
  }, [pendingPlay, resolvePlay]);

  return {
    gameState,
    message,
    pendingPlay,
    handleAction,
    updatePendingSlot,
    cancelPending,
    confirmPending,
  };
}
