"use client";

import { useAppContext } from "@/lib/store";
import { generateStaffCode, type StaffMember } from "@/lib/team-data";
import { ArrowLeft, Plus, Trash2, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

const APP_URL = "https://little-base.app";

function AddStaffModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (name: string, role: "監督" | "コーチ") => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"監督" | "コーチ">("コーチ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-[#F3F4F6] px-4 py-4">
          <h3 className="text-sm font-black text-[#1A1D23]">{"スタッフを追加"}</h3>
        </div>

        <div className="flex flex-col gap-3 px-4 py-4">
          <div>
            <label className="mb-1 block text-[10px] font-bold text-[#9CA3AF]">{"名前"}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力"
              maxLength={10}
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8F9FB] px-3 py-2.5 text-sm font-bold text-[#1A1D23] outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold text-[#9CA3AF]">{"役職"}</label>
            <div className="flex gap-2">
              {(["監督", "コーチ"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 rounded-lg border py-2.5 text-xs font-bold transition-all active:scale-95 ${
                    role === r
                      ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                      : "border-[#E5E7EB] bg-white text-[#6B7280]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#F3F4F6] px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-[#F3F4F6] py-2.5 text-[11px] font-bold text-[#6B7280] active:scale-95"
          >
            {"キャンセル"}
          </button>
          <button
            type="button"
            onClick={() => { if (name.trim()) { onAdd(name.trim(), role); onClose(); } }}
            disabled={!name.trim()}
            className={`flex-1 rounded-lg py-2.5 text-[11px] font-bold active:scale-95 ${
              name.trim() ? "bg-[#2563EB] text-white" : "bg-[#E5E7EB] text-[#D1D5DB]"
            }`}
          >
            {"追加する"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PermissionManagementScreen() {
  const { state, goBack, updateMyTeam } = useAppContext();
  const { myTeam } = state;
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  const buildStaffInviteMessage = useCallback((staff: StaffMember) => {
    return `【${myTeam.name}】に${staff.role}として招待されました！

アプリ: ${APP_URL}
チームコード: ${myTeam.inviteCode}
スタッフコード: ${staff.inviteCode}

上のURLからアプリを開いてコードを入力してください。`;
  }, [myTeam]);

  const handleAddStaff = (name: string, role: "監督" | "コーチ") => {
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name,
      role,
      inviteCode: generateStaffCode(),
    };
    updateMyTeam((t) => ({
      ...t,
      staff: [...t.staff, newStaff],
      members: [...t.members, {
        id: `member-${Date.now()}`,
        name,
        role,
        permission: "edit" as const,
        joinedAt: new Date().toISOString().split("T")[0],
      }],
    }));
  };

  const handleDeleteStaff = (staffId: string) => {
    updateMyTeam((t) => {
      const staff = t.staff.find((s) => s.id === staffId);
      return {
        ...t,
        staff: t.staff.filter((s) => s.id !== staffId),
        members: staff
          ? t.members.filter((m) => !(m.name === staff.name && m.role === staff.role))
          : t.members,
      };
    });
    setConfirmDeleteId(null);
  };

  const roleColor = (role: string) => {
    if (role === "監督") return "bg-[#FEF3C7] text-[#D97706]";
    if (role === "コーチ") return "bg-[#DBEAFE] text-[#2563EB]";
    return "bg-[#F3F4F6] text-[#6B7280]";
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#F8F9FB]">
      {/* Header */}
      <div className="flex items-center border-b border-[#E5E7EB] bg-white px-3 py-2.5">
        <button type="button" onClick={goBack} className="flex items-center gap-1 text-[#6B7280] active:opacity-70">
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">{"戻る"}</span>
        </button>
        <h2 className="flex-1 text-center text-sm font-black text-[#1A1D23]">{"メンバー権限"}</h2>
        <div className="w-12" />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {/* Info */}
        <div className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-3">
          <p className="text-[10px] font-bold text-[#2563EB]">{"監督・コーチは常に「編集あり」です。選手（保護者）の権限を切り替えできます。"}</p>
        </div>

        {/* Staff section */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#F3F4F6] px-4 py-3">
            <p className="text-[10px] font-black tracking-wider text-[#D97706]">{"スタッフ"}</p>
            <p className="mt-0.5 text-[10px] text-[#9CA3AF]">{`${myTeam.staff.length}名`}</p>
          </div>

          <div className="divide-y divide-[#F3F4F6]">
            {myTeam.staff.map((staff) => (
              <div key={staff.id} className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#1A1D23]">{staff.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${roleColor(staff.role)}`}>
                        {staff.role}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(buildStaffInviteMessage(staff), staff.id)}
                    className="flex items-center gap-1 rounded-lg bg-[#EFF6FF] px-2.5 py-1.5 text-[#2563EB] active:scale-95"
                  >
                    {copiedId === staff.id ? <Check size={12} /> : <Copy size={12} />}
                    <span className="text-[9px] font-black">{copiedId === staff.id ? "コピー済" : "コピー"}</span>
                  </button>

                  {confirmDeleteId === staff.id ? (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg bg-[#F3F4F6] px-2 py-1.5 text-[9px] font-bold text-[#6B7280] active:scale-95"
                      >
                        {"戻す"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="rounded-lg bg-[#DC2626] px-2 py-1.5 text-[9px] font-bold text-white active:scale-95"
                      >
                        {"削除"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(staff.id)}
                      className="rounded-lg bg-[#FEF2F2] p-1.5 text-[#DC2626] active:scale-95"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {myTeam.staff.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-[10px] text-[#9CA3AF]">{"スタッフがいません"}</p>
            </div>
          )}

          {/* Add staff button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-[#F3F4F6] bg-white px-4 py-3 active:bg-[#F3F4F6]"
          >
            <Plus size={14} className="text-[#D97706]" />
            <span className="text-[11px] font-bold text-[#D97706]">{"スタッフを追加"}</span>
          </button>
        </div>

        {/* Users section */}
        {(() => {
          const users = myTeam.members.filter((m) => m.role === "保護者");
          return (
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
              <div className="border-b border-[#F3F4F6] px-4 py-3">
                <p className="text-[10px] font-black tracking-wider text-[#2563EB]">{"ユーザー"}</p>
                <p className="mt-0.5 text-[10px] text-[#9CA3AF]">{`${users.length}名`}</p>
              </div>

              <div className="divide-y divide-[#F3F4F6]">
                {users.map((member) => {
                  const player = member.playerId
                    ? myTeam.players.find((p) => p.id === member.playerId)
                    : null;

                  return (
                    <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1">
                        <span className="text-xs font-black text-[#1A1D23]">{member.name}</span>
                        {player && (
                          <p className="mt-0.5 text-[9px] text-[#9CA3AF]">{`#${player.number} ${player.name}`}</p>
                        )}
                      </div>
                      <div
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-bold ${
                          member.permission === "edit"
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}
                      >
                        <div
                          className={`h-3 w-6 rounded-full transition-all ${
                            member.permission === "edit" ? "bg-[#16A34A]" : "bg-[#D1D5DB]"
                          }`}
                        >
                          <div
                            className={`h-3 w-3 rounded-full bg-white shadow-sm transition-all ${
                              member.permission === "edit" ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                        {member.permission === "edit" ? "編集あり" : "閲覧のみ"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {users.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-[10px] text-[#9CA3AF]">{"ユーザーがいません"}</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {showAddModal && (
        <AddStaffModal onClose={() => setShowAddModal(false)} onAdd={handleAddStaff} />
      )}
    </div>
  );
}
