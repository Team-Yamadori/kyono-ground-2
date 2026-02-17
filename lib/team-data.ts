// Shared types and default player data for the Power Pro-style app

export type Position =
  | "投手"
  | "捕手"
  | "一塁"
  | "二塁"
  | "三塁"
  | "遊撃"
  | "左翼"
  | "中堅"
  | "右翼"
  | "DH";

export interface Player {
  id: string;
  name: string;
  number: number;
  inviteCode: string; // unique player invite code
  position: Position; // main (natural) position
  subPositions?: Position[]; // secondary positions
  // Batting stats
  avg: number;
  hr: number;
  rbi: number;
  hits: number;
  atBats: number;
  runs: number;
  stolenBases: number;
  obp: number;
  slg: number;
  walks: number;
  strikeoutsBatting: number;
  doubles: number;
  triples: number;
  sacrificeBunts: number;
  sacrificeFlies: number;
  // Pitching stats (for pitchers)
  era?: number;
  wins?: number;
  losses?: number;
  saves?: number;
  holds?: number;
  strikeouts?: number;
  pitchWalks?: number;
  inningsPitched?: number;
  hitsAllowed?: number;
  earnedRuns?: number;
  games?: number;
  completeGames?: number;
  shutouts?: number;
  whip?: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: "監督" | "コーチ";
  inviteCode: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "監督" | "コーチ" | "保護者";
  playerId?: string;      // 保護者の場合、紐づく選手ID
  permission: "edit" | "view";  // 監督・コーチはedit固定、保護者はデフォルトview
  joinedAt: string;
}

// A lineup slot: which player plays which defensive position
export interface LineupSlot {
  playerId: string;
  fieldPosition: Position; // the defensive position assigned for this game
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  inviteCode: string; // team invite code
  color: string;
  subColor: string;
  players: Player[];
  staff: StaffMember[];
  members: TeamMember[];
  lineup: LineupSlot[]; // 9 batting order slots with assigned fielding position
  benchPlayers: string[]; // bench player IDs
  pitchingRotation: string[];
}

export interface GameRecord {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeShort: string;
  awayShort: string;
  homeColor: string;
  awayColor: string;
  homeScore: number;
  awayScore: number;
  innings: { away: (number | null)[]; home: (number | null)[] };
  homeHits: number;
  awayHits: number;
  homeErrors: number;
  awayErrors: number;
  homeLineup: { name: string; pos: string; atBats: number; hits: number; rbi: number; avg: number }[];
  awayLineup: { name: string; pos: string; atBats: number; hits: number; rbi: number; avg: number }[];
  homePitchers: { name: string; ip: number; hits: number; er: number; so: number; bb: number; result: string }[];
  awayPitchers: { name: string; ip: number; hits: number; er: number; so: number; bb: number; result: string }[];
  mvp?: string;
}

export interface PlayerGameStats {
  playerId: string;
  gameId: string;
  atBats: number;
  hits: number;
  hr: number;
  rbi: number;
  runs: number;
  walks: number;
  strikeouts: number;
  inningsPitched?: number;
  earnedRuns?: number;
  pitchStrikeouts?: number;
  pitchWalks?: number;
  hitsAllowed?: number;
}

// Position order for display
export const POSITION_ORDER: Position[] = [
  "投手",
  "捕手",
  "一塁",
  "二塁",
  "三塁",
  "遊撃",
  "左翼",
  "中堅",
  "右翼",
];

export const POSITION_SHORT: Record<Position, string> = {
  投手: "投",
  捕手: "捕",
  一塁: "一",
  二塁: "二",
  三塁: "三",
  遊撃: "遊",
  左翼: "左",
  中堅: "中",
  右翼: "右",
  DH: "D",
};

export const POSITION_NUMBER: Record<Position, number> = {
  投手: 1,
  捕手: 2,
  一塁: 3,
  二塁: 4,
  三塁: 5,
  遊撃: 6,
  左翼: 7,
  中堅: 8,
  右翼: 9,
  DH: 0,
};

export const ALL_POSITIONS: Position[] = [
  "投手",
  "捕手",
  "一塁",
  "二塁",
  "三塁",
  "遊撃",
  "左翼",
  "中堅",
  "右翼",
  "DH",
];

// ======== Invite code generation ========
function generateCode(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // ambiguous chars removed (0/O, 1/I)
  let code = "";
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function generateTeamCode(): string {
  return generateCode(6);
}

export function generatePlayerCode(): string {
  return generateCode(4);
}

export function generateStaffCode(): string {
  return generateCode(5);
}

// ======== Default My Team (user's team) ========
export function createDefaultMyTeam(): Team {
  const players: Player[] = [
    { id: "h1", name: "早川 あおい", number: 18, inviteCode: "", position: "投手", avg: 0.165, hr: 0, rbi: 2, hits: 8, atBats: 48, runs: 3, stolenBases: 1, obp: 0.21, slg: 0.185, walks: 4, strikeoutsBatting: 15, doubles: 1, triples: 0, sacrificeBunts: 3, sacrificeFlies: 0, era: 2.45, wins: 10, losses: 4, saves: 0, holds: 0, strikeouts: 132, pitchWalks: 28, inningsPitched: 135, hitsAllowed: 108, earnedRuns: 37, games: 22, completeGames: 3, shutouts: 1, whip: 1.01 },
    { id: "h2", name: "あおい 明日香", number: 8, inviteCode: "", position: "中堅", avg: 0.302, hr: 8, rbi: 38, hits: 102, atBats: 338, runs: 55, stolenBases: 22, obp: 0.365, slg: 0.445, walks: 35, strikeoutsBatting: 42, doubles: 18, triples: 4, sacrificeBunts: 2, sacrificeFlies: 3 },
    { id: "h3", name: "久遠 冬華", number: 3, inviteCode: "", position: "一塁", avg: 0.325, hr: 32, rbi: 92, hits: 118, atBats: 363, runs: 72, stolenBases: 1, obp: 0.405, slg: 0.645, walks: 52, strikeoutsBatting: 68, doubles: 22, triples: 0, sacrificeBunts: 0, sacrificeFlies: 5 },
    { id: "h4", name: "神高 龍一", number: 6, inviteCode: "", position: "遊撃", avg: 0.288, hr: 14, rbi: 52, hits: 95, atBats: 330, runs: 48, stolenBases: 18, obp: 0.355, slg: 0.475, walks: 38, strikeoutsBatting: 35, doubles: 15, triples: 3, sacrificeBunts: 5, sacrificeFlies: 2 },
    { id: "h5", name: "須神 絵久", number: 7, inviteCode: "", position: "左翼", avg: 0.278, hr: 10, rbi: 45, hits: 85, atBats: 306, runs: 38, stolenBases: 6, obp: 0.34, slg: 0.428, walks: 28, strikeoutsBatting: 52, doubles: 12, triples: 2, sacrificeBunts: 1, sacrificeFlies: 4 },
    { id: "h6", name: "朱雀 南赤", number: 11, inviteCode: "", position: "投手", avg: 0.14, hr: 0, rbi: 1, hits: 5, atBats: 36, runs: 2, stolenBases: 0, obp: 0.18, slg: 0.14, walks: 2, strikeoutsBatting: 12, doubles: 0, triples: 0, sacrificeBunts: 2, sacrificeFlies: 0, era: 3.25, wins: 7, losses: 5, saves: 0, holds: 0, strikeouts: 88, pitchWalks: 38, inningsPitched: 102, hitsAllowed: 95, earnedRuns: 37, games: 18, completeGames: 1, shutouts: 0, whip: 1.3 },
    { id: "h7", name: "黒崎 遼", number: 5, inviteCode: "", position: "三塁", avg: 0.272, hr: 18, rbi: 58, hits: 88, atBats: 323, runs: 42, stolenBases: 5, obp: 0.345, slg: 0.498, walks: 35, strikeoutsBatting: 55, doubles: 16, triples: 1, sacrificeBunts: 0, sacrificeFlies: 3 },
    { id: "h8", name: "鳴海 悠斗", number: 2, inviteCode: "", position: "捕手", avg: 0.262, hr: 12, rbi: 48, hits: 82, atBats: 313, runs: 32, stolenBases: 0, obp: 0.325, slg: 0.418, walks: 30, strikeoutsBatting: 48, doubles: 14, triples: 0, sacrificeBunts: 1, sacrificeFlies: 4 },
    { id: "h9", name: "星野 光", number: 9, inviteCode: "", position: "右翼", avg: 0.295, hr: 15, rbi: 55, hits: 92, atBats: 312, runs: 48, stolenBases: 20, obp: 0.375, slg: 0.498, walks: 42, strikeoutsBatting: 38, doubles: 17, triples: 3, sacrificeBunts: 0, sacrificeFlies: 2 },
    { id: "h10", name: "白瀬 芙喜", number: 14, inviteCode: "", position: "投手", avg: 0.1, hr: 0, rbi: 0, hits: 2, atBats: 20, runs: 0, stolenBases: 0, obp: 0.14, slg: 0.1, walks: 2, strikeoutsBatting: 8, doubles: 0, triples: 0, sacrificeBunts: 1, sacrificeFlies: 0, era: 2.68, wins: 5, losses: 2, saves: 0, holds: 8, strikeouts: 72, pitchWalks: 20, inningsPitched: 78, hitsAllowed: 62, earnedRuns: 23, games: 35, completeGames: 0, shutouts: 0, whip: 1.05 },
    { id: "h11", name: "嵐丸 聖人", number: 15, inviteCode: "", position: "投手", avg: 0.11, hr: 0, rbi: 0, hits: 2, atBats: 18, runs: 0, stolenBases: 0, obp: 0.16, slg: 0.11, walks: 1, strikeoutsBatting: 7, doubles: 0, triples: 0, sacrificeBunts: 0, sacrificeFlies: 0, era: 3.48, wins: 4, losses: 3, saves: 0, holds: 2, strikeouts: 55, pitchWalks: 25, inningsPitched: 62, hitsAllowed: 58, earnedRuns: 24, games: 15, completeGames: 0, shutouts: 0, whip: 1.34 },
    { id: "h12", name: "結城 哲也", number: 4, inviteCode: "", position: "二塁", avg: 0.275, hr: 8, rbi: 40, hits: 82, atBats: 298, runs: 35, stolenBases: 8, obp: 0.34, slg: 0.408, walks: 32, strikeoutsBatting: 30, doubles: 14, triples: 2, sacrificeBunts: 8, sacrificeFlies: 3 },
    { id: "h13", name: "蒼井 琉星", number: 19, inviteCode: "", position: "投手", avg: 0.07, hr: 0, rbi: 0, hits: 1, atBats: 14, runs: 0, stolenBases: 0, obp: 0.12, slg: 0.07, walks: 1, strikeoutsBatting: 6, doubles: 0, triples: 0, sacrificeBunts: 0, sacrificeFlies: 0, era: 4.12, wins: 2, losses: 4, saves: 0, holds: 0, strikeouts: 42, pitchWalks: 22, inningsPitched: 48, hitsAllowed: 52, earnedRuns: 22, games: 10, completeGames: 0, shutouts: 0, whip: 1.54 },
    { id: "h14", name: "山吹 薫", number: 25, inviteCode: "", position: "投手", avg: 0.09, hr: 0, rbi: 0, hits: 1, atBats: 11, runs: 0, stolenBases: 0, obp: 0.15, slg: 0.09, walks: 1, strikeoutsBatting: 5, doubles: 0, triples: 0, sacrificeBunts: 0, sacrificeFlies: 0, era: 1.85, wins: 3, losses: 0, saves: 18, holds: 0, strikeouts: 52, pitchWalks: 10, inningsPitched: 38, hitsAllowed: 25, earnedRuns: 8, games: 40, completeGames: 0, shutouts: 0, whip: 0.92 },
    { id: "h15", name: "天城 蓮", number: 10, inviteCode: "", position: "中堅", subPositions: ["左翼", "右翼"], avg: 0.258, hr: 5, rbi: 22, hits: 48, atBats: 186, runs: 25, stolenBases: 12, obp: 0.32, slg: 0.382, walks: 18, strikeoutsBatting: 32, doubles: 8, triples: 2, sacrificeBunts: 3, sacrificeFlies: 1 },
    { id: "h16", name: "桜庭 翔太", number: 30, inviteCode: "", position: "捕手", subPositions: ["一塁"], avg: 0.235, hr: 3, rbi: 18, hits: 32, atBats: 136, runs: 12, stolenBases: 0, obp: 0.298, slg: 0.345, walks: 12, strikeoutsBatting: 28, doubles: 6, triples: 0, sacrificeBunts: 2, sacrificeFlies: 2 },
  ];

  // Fixed invite codes for default team
  const defaultPlayerCodes = ["T3K7", "M8N2", "R4P9", "W6J3", "H2V8", "L5X4", "B9Q6", "F7D2", "C3Y5", "G8K4", "N2S7", "E6A9", "P4U3", "J8R5", "V2M6", "X7B4"];
  for (let i = 0; i < players.length; i++) players[i].inviteCode = defaultPlayerCodes[i] ?? generatePlayerCode();

  const defaultStaff: StaffMember[] = [
    { id: "staff-1", name: "猪狩 守", role: "監督", inviteCode: "KNT5A" },
    { id: "staff-2", name: "友沢 亮", role: "コーチ", inviteCode: "TMZ3B" },
    { id: "staff-3", name: "橘 みずき", role: "コーチ", inviteCode: "TCB7D" },
  ];

  const defaultMembers: TeamMember[] = [
    { id: "member-1", name: "猪狩 守", role: "監督", permission: "edit", joinedAt: "2024-04-01" },
    { id: "member-8", name: "友沢 亮", role: "コーチ", permission: "edit", joinedAt: "2024-04-01" },
    { id: "member-9", name: "橘 みずき", role: "コーチ", permission: "edit", joinedAt: "2024-04-03" },
    { id: "member-2", name: "早川 太郎", role: "保護者", playerId: "h1", permission: "view", joinedAt: "2024-04-05" },
    { id: "member-3", name: "早川 花子", role: "保護者", playerId: "h1", permission: "view", joinedAt: "2024-04-05" },
    { id: "member-4", name: "久遠 剛", role: "保護者", playerId: "h3", permission: "edit", joinedAt: "2024-04-08" },
    { id: "member-5", name: "神高 美咲", role: "保護者", playerId: "h4", permission: "view", joinedAt: "2024-04-10" },
    { id: "member-6", name: "鳴海 健一", role: "保護者", playerId: "h8", permission: "view", joinedAt: "2024-04-12" },
    { id: "member-7", name: "星野 裕子", role: "保護者", playerId: "h9", permission: "edit", joinedAt: "2024-04-15" },
  ];

  return {
    id: "my-team",
    name: "あかつき大附",
    shortName: "あか",
    inviteCode: "AKT24X",
    color: "hsl(210, 80%, 45%)",
    subColor: "hsl(210, 60%, 30%)",
    players,
    staff: defaultStaff,
    members: defaultMembers,
    lineup: [
      { playerId: "h2", fieldPosition: "中堅" },
      { playerId: "h12", fieldPosition: "二塁" },
      { playerId: "h4", fieldPosition: "遊撃" },
      { playerId: "h3", fieldPosition: "一塁" },
      { playerId: "h9", fieldPosition: "右翼" },
      { playerId: "h5", fieldPosition: "左翼" },
      { playerId: "h7", fieldPosition: "三塁" },
      { playerId: "h8", fieldPosition: "捕手" },
      { playerId: "h1", fieldPosition: "投手" },
    ],
    benchPlayers: ["h6", "h10", "h11", "h13", "h14", "h15", "h16"],
    pitchingRotation: ["h1", "h6", "h10", "h11", "h13", "h14"],
  };
}

// ======== Auto-generate opponent team ========
const OPPONENT_NAMES = [
  { name: "パワフルズ", short: "パワ", color: "hsl(0, 85%, 55%)", sub: "hsl(0, 70%, 35%)" },
  { name: "極亜久高校", short: "極亜", color: "hsl(270, 60%, 50%)", sub: "hsl(270, 45%, 30%)" },
  { name: "帝王実業", short: "帝実", color: "hsl(38, 80%, 45%)", sub: "hsl(38, 60%, 28%)" },
  { name: "聖タチバナ学園", short: "聖タ", color: "hsl(145, 60%, 40%)", sub: "hsl(145, 50%, 25%)" },
  { name: "瞬鋭高校", short: "瞬鋭", color: "hsl(180, 60%, 45%)", sub: "hsl(180, 50%, 28%)" },
  { name: "ブルーオーシャンズ", short: "BO", color: "hsl(200, 70%, 45%)", sub: "hsl(200, 60%, 30%)" },
];

const OPPONENT_LAST_NAMES = [
  "田中", "鈴木", "佐藤", "高橋", "伊藤", "渡辺", "山本", "中村",
  "小林", "加藤", "吉田", "山田", "松本", "井上", "木村",
  "林", "斎藤", "清水", "山口", "森",
];

function randomOpponentPlayer(id: string, num: number, pos: Position): Player {
  const name = OPPONENT_LAST_NAMES[Math.floor(Math.random() * OPPONENT_LAST_NAMES.length)];
  const avg = +(0.2 + Math.random() * 0.12).toFixed(3);
  const atBats = Math.floor(200 + Math.random() * 200);
  const hits = Math.round(atBats * avg);
  const hr = Math.floor(Math.random() * 20);
  const rbi = Math.floor(hr * 2.5 + Math.random() * 30);
  const isPitcher = pos === "投手";

  return {
    id, name, number: num, inviteCode: generatePlayerCode(), position: pos,
    avg, hr, rbi, hits, atBats,
    runs: Math.floor(Math.random() * 60),
    stolenBases: Math.floor(Math.random() * 15),
    obp: +(avg + 0.05 + Math.random() * 0.05).toFixed(3),
    slg: +(avg + 0.1 + Math.random() * 0.2).toFixed(3),
    walks: Math.floor(Math.random() * 40),
    strikeoutsBatting: Math.floor(Math.random() * 60),
    doubles: Math.floor(Math.random() * 20),
    triples: Math.floor(Math.random() * 5),
    sacrificeBunts: Math.floor(Math.random() * 5),
    sacrificeFlies: Math.floor(Math.random() * 5),
    ...(isPitcher ? {
      era: +(1.5 + Math.random() * 3.5).toFixed(2),
      wins: Math.floor(Math.random() * 12),
      losses: Math.floor(Math.random() * 8),
      saves: 0, holds: 0,
      strikeouts: Math.floor(40 + Math.random() * 120),
      pitchWalks: Math.floor(10 + Math.random() * 40),
      inningsPitched: Math.floor(40 + Math.random() * 120),
      hitsAllowed: Math.floor(30 + Math.random() * 100),
      earnedRuns: Math.floor(10 + Math.random() * 40),
      games: Math.floor(5 + Math.random() * 30),
      completeGames: Math.floor(Math.random() * 3),
      shutouts: Math.floor(Math.random() * 2),
      whip: +(0.8 + Math.random() * 0.8).toFixed(2),
    } : {}),
  };
}

export function createRandomOpponent(): Team {
  const info = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
  const positions: Position[] = ["投手", "捕手", "一塁", "二塁", "三塁", "遊撃", "左翼", "中堅", "右翼"];
  const players: Player[] = [];

  // 9 starters
  for (let i = 0; i < 9; i++) {
    players.push(randomOpponentPlayer(`opp-${i + 1}`, (i === 0 ? 18 : i + 1), positions[i]));
  }
  // 5 bench (3 pitchers, 2 position)
  players.push(randomOpponentPlayer("opp-10", 11, "投手"));
  players.push(randomOpponentPlayer("opp-11", 14, "投手"));
  players.push(randomOpponentPlayer("opp-12", 19, "投手"));
  players.push(randomOpponentPlayer("opp-13", 24, "中堅"));
  players.push(randomOpponentPlayer("opp-14", 28, "捕手"));

  const lineup: LineupSlot[] = [
    { playerId: "opp-8", fieldPosition: "中堅" },
    { playerId: "opp-4", fieldPosition: "二塁" },
    { playerId: "opp-6", fieldPosition: "遊撃" },
    { playerId: "opp-3", fieldPosition: "一塁" },
    { playerId: "opp-7", fieldPosition: "左翼" },
    { playerId: "opp-9", fieldPosition: "右翼" },
    { playerId: "opp-5", fieldPosition: "三塁" },
    { playerId: "opp-2", fieldPosition: "捕手" },
    { playerId: "opp-1", fieldPosition: "投手" },
  ];

  return {
    id: "opponent",
    name: info.name,
    shortName: info.short,
    inviteCode: generateTeamCode(),
    color: info.color,
    subColor: info.sub,
    players,
    staff: [],
    members: [],
    lineup,
    benchPlayers: ["opp-10", "opp-11", "opp-12", "opp-13", "opp-14"],
    pitchingRotation: ["opp-1", "opp-10", "opp-11", "opp-12"],
  };
}

// ======== Utility functions ========
export function getPlayer(team: Team, playerId: string): Player | undefined {
  return team.players.find((p) => p.id === playerId);
}

export function getLineupPlayers(team: Team): (Player | undefined)[] {
  return team.lineup.map((slot) => getPlayer(team, slot.playerId));
}

export function getBenchPlayers(team: Team): Player[] {
  return team.benchPlayers
    .map((id) => getPlayer(team, id))
    .filter(Boolean) as Player[];
}

export function formatAvg(avg: number): string {
  return avg.toFixed(3).replace(/^0/, "");
}

export function formatEra(era: number): string {
  return era.toFixed(2);
}
