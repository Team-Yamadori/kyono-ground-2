"use client";

import { createContext, useContext } from "react";
import type { Team, GameRecord, PlayerGameStats } from "./team-data";

export interface GameConfig {
  isTopOfInning: boolean; // true=先攻, false=後攻
  totalInnings: number;
}

export interface AppState {
  myTeam: Team;
  opponent: Team;
  gameRecords: GameRecord[];
  playerGameStats: PlayerGameStats[];
  currentScreen: Screen;
  gameConfig: GameConfig;
}

export type Screen =
  | "home"
  | "team-edit"
  | "roster"
  | "lineup"
  | "defense"
  | "game-setup"
  | "game"
  | "score-history"
  | "game-detail"
  | "player-stats";

export interface AppContextValue {
  state: AppState;
  setMyTeam: (team: Team) => void;
  setOpponent: (team: Team) => void;
  updateMyTeam: (updater: (team: Team) => Team) => void;
  addGameRecord: (record: GameRecord) => void;
  addPlayerGameStats: (stats: PlayerGameStats[]) => void;
  navigate: (screen: Screen) => void;
  selectedGameId: string | null;
  setSelectedGameId: (id: string | null) => void;
  setGameConfig: (config: GameConfig) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
