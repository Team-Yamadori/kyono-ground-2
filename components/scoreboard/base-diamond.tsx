"use client";

interface BaseDiamondProps {
  bases: [boolean, boolean, boolean];
  size?: "sm" | "lg";
}

export function BaseDiamond({ bases, size = "lg" }: BaseDiamondProps) {
  if (size === "sm") {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        {/* 2nd base */}
        <rect
          x="13" y="1" width="10" height="10" rx="1.5"
          transform="rotate(45, 18, 6)"
          fill={bases[1] ? "hsl(38, 100%, 50%)" : "hsl(210, 40%, 25%)"}
          stroke={bases[1] ? "hsl(38, 80%, 60%)" : "hsl(210, 30%, 35%)"}
          strokeWidth="1"
        />
        {/* 3rd base */}
        <rect
          x="-2" y="16" width="10" height="10" rx="1.5"
          transform="rotate(45, 3, 21)"
          fill={bases[2] ? "hsl(38, 100%, 50%)" : "hsl(210, 40%, 25%)"}
          stroke={bases[2] ? "hsl(38, 80%, 60%)" : "hsl(210, 30%, 35%)"}
          strokeWidth="1"
        />
        {/* 1st base */}
        <rect
          x="28" y="16" width="10" height="10" rx="1.5"
          transform="rotate(45, 33, 21)"
          fill={bases[0] ? "hsl(38, 100%, 50%)" : "hsl(210, 40%, 25%)"}
          stroke={bases[0] ? "hsl(38, 80%, 60%)" : "hsl(210, 30%, 35%)"}
          strokeWidth="1"
        />
      </svg>
    );
  }

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {/* Diamond lines */}
      <path
        d="M50 10 L90 50 L50 90 L10 50 Z"
        fill="none"
        stroke="hsl(210, 30%, 30%)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Home plate */}
      <polygon
        points="50,90 44,86 44,82 56,82 56,86"
        fill="hsl(48, 100%, 96%)"
        stroke="hsl(210, 30%, 35%)"
        strokeWidth="1"
      />

      {/* 1st base */}
      <rect
        x={90 - 11} y={50 - 11} width="22" height="22" rx="2.5"
        transform="rotate(45, 90, 50)"
        fill={bases[0] ? "hsl(38, 100%, 50%)" : "hsl(210, 40%, 22%)"}
        stroke={bases[0] ? "hsl(38, 80%, 60%)" : "hsl(210, 30%, 35%)"}
        strokeWidth="2"
        className="transition-all duration-300"
        style={bases[0] ? { filter: "drop-shadow(0 0 8px hsl(38, 100%, 50%))" } : {}}
      />

      {/* 2nd base */}
      <rect
        x={50 - 11} y={10 - 11} width="22" height="22" rx="2.5"
        transform="rotate(45, 50, 10)"
        fill={bases[1] ? "hsl(38, 100%, 50%)" : "hsl(210, 40%, 22%)"}
        stroke={bases[1] ? "hsl(38, 80%, 60%)" : "hsl(210, 30%, 35%)"}
        strokeWidth="2"
        className="transition-all duration-300"
        style={bases[1] ? { filter: "drop-shadow(0 0 8px hsl(38, 100%, 50%))" } : {}}
      />

      {/* 3rd base */}
      <rect
        x={10 - 11} y={50 - 11} width="22" height="22" rx="2.5"
        transform="rotate(45, 10, 50)"
        fill={bases[2] ? "hsl(38, 100%, 50%)" : "hsl(210, 40%, 22%)"}
        stroke={bases[2] ? "hsl(38, 80%, 60%)" : "hsl(210, 30%, 35%)"}
        strokeWidth="2"
        className="transition-all duration-300"
        style={bases[2] ? { filter: "drop-shadow(0 0 8px hsl(38, 100%, 50%))" } : {}}
      />

      {/* Runner indicators */}
      {bases[0] && <circle cx="90" cy="50" r="4" fill="hsl(0, 0%, 100%)" className="animate-pulse" />}
      {bases[1] && <circle cx="50" cy="10" r="4" fill="hsl(0, 0%, 100%)" className="animate-pulse" />}
      {bases[2] && <circle cx="10" cy="50" r="4" fill="hsl(0, 0%, 100%)" className="animate-pulse" />}
    </svg>
  );
}
