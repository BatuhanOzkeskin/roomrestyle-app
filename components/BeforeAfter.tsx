"use client";

import { useState, useEffect, useRef } from "react";

export default function BeforeAfter({
  beforeUrl,
  afterUrl,
  autoSweep = false,
}: {
  beforeUrl: string;
  afterUrl: string;
  /** Eski sürümden kalma; artık kullanılmıyor (ayrı kaydırma çubuğu kaldırıldı). */
  accentClass?: string;
  autoSweep?: boolean;
}) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  // Bir kez kendi kendine süpür — etkileşimi öğretir + sayfaya hayat katar.
  useEffect(() => {
    if (!autoSweep) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now() + 600;
    const dur = 2400;
    const tick = (t: number) => {
      if (touched.current) return; // kullanıcı tuttuysa animasyonu bırak
      const p = Math.min(Math.max((t - start) / dur, 0), 1);
      setPos(50 + Math.sin(p * Math.PI * 2) * 34); // 50→84→50→16→50
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPos(50);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoSweep]);

  function moveTo(clientX: number) {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    touched.current = true;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    touched.current = true;
    e.preventDefault();
  }

  return (
    <div
      ref={boxRef}
      role="slider"
      tabIndex={0}
      aria-label="Önce/sonra karşılaştırma"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`Önce %${Math.round(pos)}`}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging && moveTo(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={onKeyDown}
      className={`group relative w-full touch-pan-y select-none overflow-hidden rounded-card border border-line ${
        dragging ? "cursor-grabbing" : "cursor-ew-resize"
      }`}
    >
      <img src={afterUrl} alt="Sonra" draggable={false} className="pointer-events-none block w-full" />
      <img
        src={beforeUrl}
        alt="Önce"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Ayraç çizgisi + tutamaç */}
      <div
        className="pointer-events-none absolute inset-y-0 -translate-x-1/2"
        style={{ left: `${pos}%` }}
      >
        <div className="mx-auto h-full w-px bg-gold shadow-[0_0_12px_rgb(var(--rr-gold-rgb)/0.6)]" />
        <div
          className={`absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 bg-bg/70 text-gold shadow-card backdrop-blur-md transition-transform duration-200 group-hover:scale-105 ${
            dragging ? "scale-110" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <span
        className={`label-mono pointer-events-none absolute bottom-3 left-3 rounded-full border border-ink/10 bg-bg/70 px-2.5 py-1 backdrop-blur-md transition-opacity duration-200 ${
          pos < 12 ? "opacity-0" : "opacity-100"
        }`}
      >
        Önce
      </span>
      <span
        className={`label-mono pointer-events-none absolute bottom-3 right-3 rounded-full border border-ink/10 bg-bg/70 px-2.5 py-1 backdrop-blur-md transition-opacity duration-200 ${
          pos > 88 ? "opacity-0" : "opacity-100"
        }`}
      >
        Sonra
      </span>
    </div>
  );
}
