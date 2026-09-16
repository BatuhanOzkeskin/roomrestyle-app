"use client";

import { useState } from "react";

// Before/after comparison slider. Both images are full-width and aligned;
// the "before" layer is revealed with clip-path so nothing is squished.
export default function BeforeAfter({
  beforeUrl,
  afterUrl,
}: {
  beforeUrl: string;
  afterUrl: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-xl border border-ink/10">
        {/* After = base layer, also sets the height */}
        <img src={afterUrl} alt="Sonra" className="block w-full" />

        {/* Before = full-width overlay, clipped to the left `pos`% */}
        <img
          src={beforeUrl}
          alt="Önce"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

        {/* Divider */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white/90 shadow"
          style={{ left: `${pos}%` }}
        />

        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
          Önce
        </span>
        <span className="absolute right-2 top-2 rounded bg-brand px-2 py-0.5 text-xs text-white">
          Sonra
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="mt-3 w-full cursor-ew-resize accent-brand"
        aria-label="Önce/sonra karşılaştırma"
      />
    </div>
  );
}
