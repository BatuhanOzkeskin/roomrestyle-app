"use client";

import { useState } from "react";
import RoomStudio from "@/components/RoomStudio";
import PlaceStudio from "@/components/PlaceStudio";

type Mode = "restyle" | "place";

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "restyle", label: "Odanı yeniden tasarla", hint: "Bir stil seç, odan baştan giyinsin" },
  { id: "place", label: "Mobilyanı odana koy", hint: "Beğendiğin ürünü almadan önce dene" },
];

export default function Studio() {
  const [mode, setMode] = useState<Mode>("restyle");
  const active = MODES.find((m) => m.id === mode)!;

  return (
    <div>
      {/* Mode switch */}
      <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div
          role="tablist"
          aria-label="Stüdyo modu"
          className="inline-flex rounded-full border border-line bg-surface p-1 text-sm"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-full px-4 py-2 font-medium transition duration-200 ${
                mode === m.id
                  ? "bg-accent text-on-accent shadow-glow"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-ink-muted">{active.hint}</p>
      </div>

      {mode === "restyle" ? <RoomStudio /> : <PlaceStudio />}
    </div>
  );
}
