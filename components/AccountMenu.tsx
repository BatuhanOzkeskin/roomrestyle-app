"use client";

import { useEffect, useRef, useState } from "react";
import SignOutButton from "@/components/SignOutButton";

// Sağ üstteki harfli yuvarlak: tıklayınca e-posta + "Çıkış yap" menüsü açılır (telefonda da).
export default function AccountMenu({ email }: { email: string | null | undefined }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const initial = (email ?? "?").charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={boxRef} className="relative ml-1 sm:ml-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Hesap menüsü"
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent transition duration-200 hover:brightness-110 ${
          open ? "ring-2 ring-accent/40 ring-offset-2 ring-offset-bg" : ""
        }`}
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-64 animate-fade-up overflow-hidden rounded-field border border-line bg-surface shadow-card motion-reduce:animate-none"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="label-mono">Hesap</p>
            <p className="mt-1 truncate text-sm text-ink">{email}</p>
          </div>
          <SignOutButton className="block w-full px-4 py-3 text-left text-sm text-ink transition hover:bg-ink/[0.05]" />
        </div>
      )}
    </div>
  );
}
