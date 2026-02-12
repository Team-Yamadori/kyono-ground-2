export interface TeamData {
  name: string;
  shortName: string;
  scores: (number | null)[];
  runs: number;
  hits: number;
  errors: number;
  color: string;
}

export interface PlayerData {
  name: string;
  number: number;
  position: string;
  avg?: string;
  era?: string;
}

// Destinations for runners
export type Destination = "out" | "1B" | "2B" | "3B" | "home" | "stay";

export interface RunnerSlot {
  from: "batter" | "1B" | "2B" | "3B";
  label: string;
  destination: Destination;
  options: Destination[];
}

export interface PendingPlay {
  actionLabel: string;
  slots: RunnerSlot[];
  isHit: boolean;
  isError: boolean;
}

// Simple instant actions
export type SimpleAction =
  | "ball"
  | "strike"
  | "foul"
  | "homerun"
  | "triple"
  | "out"
  | "walk"
  | "hit-by-pitch"
  | "intentional-walk"
  | "reset";

// Actions that open the runner resolution sheet
export type ComplexAction =
  | "single"
  | "double"
  | "sacrifice-fly"
  | "sacrifice-bunt"
  | "double-play"
  | "fielders-choice"
  | "stolen-base"
  | "caught-stealing"
  | "wild-pitch"
  | "balk"
  | "error";

export type GameAction = SimpleAction | ComplexAction;

export const DEST_LABELS: Record<Destination, string> = {
  out: "OUT",
  "1B": "1塁",
  "2B": "2塁",
  "3B": "3塁",
  home: "得点",
  stay: "残留",
};

export const DEST_COLORS: Record<Destination, { bg: string; text: string; activeBg: string }> = {
  out: { bg: "bg-[hsl(0,50%,18%)]", text: "text-[hsl(0,80%,65%)]", activeBg: "bg-[hsl(0,60%,30%)]" },
  "1B": { bg: "bg-[hsl(210,40%,18%)]", text: "text-[hsl(210,70%,70%)]", activeBg: "bg-[hsl(210,60%,30%)]" },
  "2B": { bg: "bg-[hsl(180,35%,18%)]", text: "text-[hsl(180,60%,65%)]", activeBg: "bg-[hsl(180,50%,28%)]" },
  "3B": { bg: "bg-[hsl(45,35%,18%)]", text: "text-[hsl(45,70%,65%)]", activeBg: "bg-[hsl(45,55%,28%)]" },
  home: { bg: "bg-[hsl(38,50%,18%)]", text: "text-[hsl(38,100%,60%)]", activeBg: "bg-[hsl(38,70%,30%)]" },
  stay: { bg: "bg-[hsl(210,25%,16%)]", text: "text-[hsl(210,20%,55%)]", activeBg: "bg-[hsl(210,30%,25%)]" },
};

export interface GameState {
  home: TeamData;
  away: TeamData;
  inning: number;
  isTop: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: [boolean, boolean, boolean];
  currentBatter: PlayerData;
  currentPitcher: PlayerData;
  isPlaying: boolean;
  isGameOver: boolean;
}

export const initialGameState: GameState = {
  away: {
    name: "パワフルズ",
    shortName: "パワ",
    scores: [null, null, null, null, null, null, null, null, null],
    runs: 0,
    hits: 0,
    errors: 0,
    color: "hsl(0, 85%, 55%)",
  },
  home: {
    name: "あかつき大附",
    shortName: "あか",
    scores: [null, null, null, null, null, null, null, null, null],
    runs: 0,
    hits: 0,
    errors: 0,
    color: "hsl(210, 80%, 45%)",
  },
  inning: 1,
  isTop: true,
  balls: 0,
  strikes: 0,
  outs: 0,
  bases: [false, false, false],
  currentBatter: {
    name: "猪狩 守",
    number: 1,
    position: "投手",
    avg: ".321",
  },
  currentPitcher: {
    name: "早川 あおい",
    number: 18,
    position: "投手",
    era: "2.45",
  },
  isPlaying: true,
  isGameOver: false,
};
