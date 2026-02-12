"use client";

import {
  type Destination,
  DEST_COLORS,
  DEST_LABELS,
  type PendingPlay,
} from "@/lib/game-state";

interface RunnerResolutionProps {
  play: PendingPlay;
  onUpdate: (slotIndex: number, dest: Destination) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const FROM_LABELS: Record<string, string> = {
  batter: "打",
  "1B": "1",
  "2B": "2",
  "3B": "3",
};

const FROM_COLORS: Record<string, string> = {
  batter: "bg-[hsl(210,50%,35%)]",
  "1B": "bg-[hsl(210,60%,40%)]",
  "2B": "bg-[hsl(180,50%,35%)]",
  "3B": "bg-[hsl(45,50%,35%)]",
};

export function RunnerResolution({
  play,
  onUpdate,
  onCancel,
  onConfirm,
}: RunnerResolutionProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(210,80%,4%)]/70">
      <div className="w-full max-w-md animate-[slideUp_0.25s_ease-out] rounded-t-2xl border-t-2 border-[hsl(38,100%,40%)] bg-[hsl(210,50%,8%)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[hsl(210,40%,18%)] px-4 py-3">
          <span className="text-sm font-black text-[hsl(38,100%,55%)]">
            {play.actionLabel}
          </span>
          <span className="text-[10px] font-bold text-[hsl(210,20%,45%)]">
            各走者の結果を指定
          </span>
        </div>

        {/* Runner Slots */}
        <div className="flex flex-col gap-2 px-4 py-3">
          {play.slots.map((slot, idx) => (
            <div key={slot.from} className="flex items-center gap-2">
              {/* From badge */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black text-[hsl(0,0%,100%)] ${FROM_COLORS[slot.from]}`}
              >
                {FROM_LABELS[slot.from]}
              </div>

              {/* Arrow */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="shrink-0 text-[hsl(210,20%,35%)]"
                aria-hidden="true"
              >
                <path
                  d="M3 8h8M8 5l3 3-3 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Destination pills */}
              <div className="flex flex-1 gap-1.5">
                {slot.options.map((opt) => {
                  const selected = slot.destination === opt;
                  const colors = DEST_COLORS[opt];
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onUpdate(idx, opt)}
                      className={`flex-1 rounded-lg py-2 text-center text-xs font-black transition-all active:scale-95 ${
                        selected
                          ? `${colors.activeBg} ${colors.text} ring-2 ring-[hsl(38,100%,50%)]`
                          : `${colors.bg} ${colors.text} opacity-50`
                      }`}
                    >
                      {DEST_LABELS[opt]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-[hsl(210,40%,18%)] px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-[hsl(210,30%,15%)] py-3 text-sm font-black text-[hsl(210,20%,55%)] active:scale-95"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-[2] rounded-xl bg-[hsl(38,100%,45%)] py-3 text-sm font-black text-[hsl(210,80%,8%)] active:scale-95"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
