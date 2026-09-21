"use client";

import { useState } from "react";

export default function BeforeAfter({
  beforeUrl,
  afterUrl,
  accentClass = "accent-accent",
}: {
  beforeUrl: string;
  afterUrl: string;
  accentClass?: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-card border border-line">
        <img src={afterUrl} alt="Sonra" className="block w-full" />
        <img
          src={beforeUrl}
          alt="Önce"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        {/* Divider */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold shadow" style={{ left: `${pos}%` }} />

        <span className="label-mono absolute bottom-3 left-3 rounded bg-surface/90 px-2 py-1">Önce</span>
        <span className="label-mono absolute bottom-3 right-3 rounded bg-surface/90 px-2 py-1">Sonra</span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className={`mt-3 w-full cursor-ew-resize ${accentClass}`}
        aria-label="Önce/sonra karşılaştırma"
      />
    </div>
  );
}
