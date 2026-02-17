"use client";

import { useAppContext } from "@/lib/store";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

const APP_URL = "https://little-base.app";

export function InviteCodesScreen() {
  const { state, goBack } = useAppContext();
  const { myTeam } = state;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  const buildInviteMessage = useCallback((playerName: string, playerCode: string) => {
    return `【${myTeam.name}】に招待されました！

アプリ: ${APP_URL}
チームコード: ${myTeam.inviteCode}
選手コード: ${playerCode}

${playerName}さんの保護者の方は、上のURLからアプリを開いてコードを入力してください。`;
  }, [myTeam]);

  const buildStaffInviteMessage = useCallback((staffName: string, staffCode: string, role: string) => {
    return `【${myTeam.name}】に${role}として招待されました！

アプリ: ${APP_URL}
チームコード: ${myTeam.inviteCode}
スタッフコード: ${staffCode}

上のURLからアプリを開いてコードを入力してください。`;
  }, [myTeam]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#F8F9FB]">
      {/* Header */}
      <div className="flex items-center border-b border-[#E5E7EB] bg-white px-3 py-2.5">
        <button type="button" onClick={goBack} className="flex items-center gap-1 text-[#6B7280] active:opacity-70">
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">{"戻る"}</span>
        </button>
        <h2 className="flex-1 text-center text-sm font-black text-[#1A1D23]">{"招待コード"}</h2>
        <div className="w-12" />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {/* Team code */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#F3F4F6] px-4 py-3">
            <p className="text-[10px] font-black tracking-wider text-[#2563EB]">{"チームコード"}</p>
          </div>
          <div className="flex items-center justify-center px-4 py-4">
            <span className="font-mono text-2xl font-black tracking-[0.3em] text-[#1A1D23]">{myTeam.inviteCode}</span>
          </div>
        </div>

        {/* Staff codes */}
        {myTeam.staff.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="border-b border-[#F3F4F6] px-4 py-3">
              <p className="text-[10px] font-black tracking-wider text-[#D97706]">{"スタッフ招待コード"}</p>
              <p className="mt-0.5 text-[10px] text-[#9CA3AF]">{"コピーでURL・チームコード・スタッフコードをまとめてコピーできます"}</p>
            </div>
            <div className="divide-y divide-[#F3F4F6]">
              {myTeam.staff.map((staff) => (
                <div key={staff.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                        staff.role === "監督" ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#DBEAFE] text-[#2563EB]"
                      }`}>{staff.role}</span>
                      <span className="truncate text-xs font-black text-[#1A1D23]">{staff.name}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleCopy(buildStaffInviteMessage(staff.name, staff.inviteCode, staff.role), `staff-${staff.id}`)}
                    className="flex items-center gap-1 rounded-lg bg-[#FFF7ED] px-2.5 py-1.5 text-[#D97706] active:scale-95">
                    {copiedId === `staff-${staff.id}` ? <Check size={12} /> : <Copy size={12} />}
                    <span className="text-[9px] font-black">{copiedId === `staff-${staff.id}` ? "コピー済" : "コピー"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player codes */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#F3F4F6] px-4 py-3">
            <p className="text-[10px] font-black tracking-wider text-[#2563EB]">{"選手コード"}</p>
            <p className="mt-0.5 text-[10px] text-[#9CA3AF]">{"コピーでURL・チームコード・選手コードをまとめてコピーできます"}</p>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {myTeam.players.map((player) => (
              <div key={player.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold tabular-nums text-[#9CA3AF]">#{player.number}</span>
                    <span className="truncate text-xs font-black text-[#1A1D23]">{player.name}</span>
                  </div>
                </div>
                <button type="button" onClick={() => handleCopy(buildInviteMessage(player.name, player.inviteCode), player.id)}
                  className="flex items-center gap-1 rounded-lg bg-[#EFF6FF] px-2.5 py-1.5 text-[#2563EB] active:scale-95">
                  {copiedId === player.id ? <Check size={12} /> : <Copy size={12} />}
                  <span className="text-[9px] font-black">{copiedId === player.id ? "コピー済" : "コピー"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
