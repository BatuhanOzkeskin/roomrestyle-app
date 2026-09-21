"use client";

import { useState } from "react";
import RoomStudio from "@/components/RoomStudio";
import PlaceStudio from "@/components/PlaceStudio";

type Mode = "restyle" | "place";

export default function Studio() {
  const [mode, setMode] = useState<Mode>("restyle");

  return (
    <div>
      {/* Mode switch */}
      <div className="mb-6 inline-flex rounded-full border border-line bg-surface p-1 text-sm shadow-sm">
        <button
          onClick={() => setMode("restyle")}
          className={`rounded-full px-4 py-2 font-medium transition ${
            mode === "restyle" ? "bg-accent text-white" : "text-ink-muted hover:text-ink"
          }`}
        >
          Odanı yeniden tasarla
        </button>
        <button
          onClick={() => setMode("place")}
          className={`rounded-full px-4 py-2 font-medium transition ${
            mode === "place" ? "bg-accent text-white" : "text-ink-muted hover:text-ink"
          }`}
        >
          Mobilyanı odana koy
        </button>
      </div>

      {mode === "restyle" ? <RoomStudio /> : <PlaceStudio />}
    </div>
  );
}
