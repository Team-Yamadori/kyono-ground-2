"use client";

import { useAppContext } from "@/lib/store";

export function MypageScreen() {
  const { state, navigate, logout } = useAppContext();
  const { myTeam, userName, gameRecords } = state;

  const wins = gameRecords.filter((r) => r.result === "win").length;
  const losses = gameRecords.filter((r) => r.result === "lose").length;
  const draws = gameRecords.filter((r) => r.result === "draw").length;

  const menuItems = [
    {
      label: "選手一覧",
      desc: `${myTeam.players.length}人登録中`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      action: () => navigate("roster"),
    },
    {
      label: "チーム編集",
      desc: "チーム名・選手の管理",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      action: () => navigate("team-edit"),
    },
    {
      label: "試合履歴",
      desc: `${gameRecords.length}試合`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8v4l3 3" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      action: () => navigate("score-history"),
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(210,70%,6%)] pb-16">
      {/* Header */}
      <div className="relative px-4 pb-4 pt-6">
        <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(38,100%,50%)] to-transparent" />
        <h1 className="text-center text-sm font-bold text-[hsl(48,100%,96%)]">
          {"マイページ"}
        </h1>
      </div>

      {/* Profile Card */}
      <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-[hsl(210,50%,10%)] ring-1 ring-[hsl(210,30%,18%)]">
        <div className="flex items-center gap-4 p-4">
          {/* Avatar */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-black text-white/90 shadow-lg"
            style={{ backgroundColor: myTeam.color }}
          >
            {userName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-[hsl(48,100%,96%)]">
              {userName}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: myTeam.color }}
              />
              <span className="text-xs text-[hsl(210,15%,55%)]">
                {myTeam.name}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 border-t border-[hsl(210,30%,14%)]">
          <div className="flex flex-col items-center py-3">
            <span className="text-lg font-black text-[hsl(120,50%,55%)]">{wins}</span>
            <span className="text-[9px] text-[hsl(210,15%,45%)]">{"勝ち"}</span>
          </div>
          <div className="flex flex-col items-center border-x border-[hsl(210,30%,14%)] py-3">
            <span className="text-lg font-black text-[hsl(0,70%,55%)]">{losses}</span>
            <span className="text-[9px] text-[hsl(210,15%,45%)]">{"負け"}</span>
          </div>
          <div className="flex flex-col items-center py-3">
            <span className="text-lg font-black text-[hsl(210,15%,55%)]">{draws}</span>
            <span className="text-[9px] text-[hsl(210,15%,45%)]">{"引分"}</span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-1.5 px-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex items-center gap-3 rounded-xl bg-[hsl(210,50%,10%)] px-4 py-3.5 text-left transition-all ring-1 ring-[hsl(210,30%,18%)] active:scale-[0.98]"
          >
            <div className="text-[hsl(38,100%,50%)]">{item.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[hsl(48,100%,96%)]">
                {item.label}
              </p>
              <p className="text-[10px] text-[hsl(210,15%,45%)]">
                {item.desc}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(210,15%,35%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-auto px-4 pb-4 pt-6">
        <button
          onClick={logout}
          className="w-full rounded-xl border border-[hsl(0,50%,30%)] bg-[hsl(0,50%,12%)] px-4 py-3 text-sm font-bold text-[hsl(0,70%,60%)] transition-all active:scale-[0.98]"
        >
          {"ログアウト"}
        </button>
      </div>
    </div>
  );
}
