"use client";

import { useState, useCallback, type ReactNode } from "react";
import { AppContext, type AppState, type Screen } from "@/lib/store";
import {
  createDefaultMyTeam,
  createRandomOpponent,
  type Team,
  type GameRecord,
  type PlayerGameStats,
} from "@/lib/team-data";

// Screens
import { HomeMenu } from "@/components/screens/home-menu";
import { TeamEdit } from "@/components/screens/team-edit";
import { RosterScreen } from "@/components/screens/roster-screen";
import { LineupScreen } from "@/components/screens/lineup-screen";

import { GameScreen } from "@/components/screens/game-screen";
import { ScoreHistoryScreen } from "@/components/screens/score-history-screen";
import { GameDetailScreen } from "@/components/screens/game-detail-screen";

function ScreenRouter({ screen }: { screen: Screen }) {
  switch (screen) {
    case "home":
      return <HomeMenu />;
    case "team-edit":
      return <TeamEdit />;
    case "roster":
      return <RosterScreen />;
    case "lineup":
      return <LineupScreen />;
    case "defense":
      return <LineupScreen />;
    case "game":
      return <GameScreen />;
    case "player-stats":
      return <HomeMenu />;
    case "score-history":
      return <ScoreHistoryScreen />;
    case "game-detail":
      return <GameDetailScreen />;
    default:
      return <HomeMenu />;
  }
}

export function AppProvider({ children }: { children?: ReactNode }) {
  const [state, setState] = useState<AppState>({
    myTeam: createDefaultMyTeam(),
    opponent: createRandomOpponent(),
    gameRecords: [],
    playerGameStats: [],
    currentScreen: "home",
  });

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const navigate = useCallback((screen: Screen) => {
    setState((s) => ({ ...s, currentScreen: screen }));
  }, []);

  const setMyTeam = useCallback((team: Team) => {
    setState((s) => ({ ...s, myTeam: team }));
  }, []);

  const setOpponent = useCallback((team: Team) => {
    setState((s) => ({ ...s, opponent: team }));
  }, []);

  const updateMyTeam = useCallback((updater: (team: Team) => Team) => {
    setState((s) => ({ ...s, myTeam: updater(s.myTeam) }));
  }, []);

  const addGameRecord = useCallback((record: GameRecord) => {
    setState((s) => ({ ...s, gameRecords: [...s.gameRecords, record] }));
  }, []);

  const addPlayerGameStats = useCallback((stats: PlayerGameStats[]) => {
    setState((s) => ({
      ...s,
      playerGameStats: [...s.playerGameStats, ...stats],
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setMyTeam,
        setOpponent,
        updateMyTeam,
        addGameRecord,
        addPlayerGameStats,
        navigate,
        selectedGameId,
        setSelectedGameId,
      }}
    >
      <ScreenRouter screen={state.currentScreen} />
    </AppContext.Provider>
  );
}
