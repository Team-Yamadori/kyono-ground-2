"use client";

interface CountDisplayProps {
  balls: number;
  strikes: number;
  outs: number;
}

export function CountDisplay({ balls, strikes, outs }: CountDisplayProps) {
  return (
    <div className="flex items-center justify-between border-b border-[hsl(210,50%,25%)] bg-[hsl(210,60%,10%)] px-4 py-2">
      {/* Balls */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black text-[hsl(120,60%,55%)]">B</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border transition-all ${
                i < balls
                  ? "border-[hsl(120,60%,40%)] bg-[hsl(120,70%,45%)] shadow-[0_0_6px_hsl(120,70%,45%)]"
                  : "border-[hsl(210,30%,28%)] bg-[hsl(210,40%,16%)]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Strikes */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black text-[hsl(38,100%,55%)]">S</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border transition-all ${
                i < strikes
                  ? "border-[hsl(38,80%,40%)] bg-[hsl(38,100%,50%)] shadow-[0_0_6px_hsl(38,100%,50%)]"
                  : "border-[hsl(210,30%,28%)] bg-[hsl(210,40%,16%)]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Outs */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black text-[hsl(0,80%,60%)]">O</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border transition-all ${
                i < outs
                  ? "border-[hsl(0,70%,40%)] bg-[hsl(0,80%,50%)] shadow-[0_0_6px_hsl(0,80%,50%)]"
                  : "border-[hsl(210,30%,28%)] bg-[hsl(210,40%,16%)]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
