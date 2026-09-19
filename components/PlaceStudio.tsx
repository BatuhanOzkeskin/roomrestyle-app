"use client";

import { useState } from "react";
import BeforeAfter from "@/components/BeforeAfter";

type Result = { id: string; beforeUrl: string; afterUrl: string; buyUrl: string | null };

const PLACEMENTS: { id: string; label: string }[] = [
  { id: "left", label: "Sol" },
  { id: "center", label: "Orta" },
  { id: "right", label: "Sağ" },
];

export default function PlaceStudio() {
  const [room, setRoom] = useState<File | null>(null);
  const [roomPreview, setRoomPreview] = useState<string | null>(null);
  const [item, setItem] = useState<File | null>(null);
  const [itemPreview, setItemPreview] = useState<string | null>(null);
  const [placement, setPlacement] = useState("center");
  const [notes, setNotes] = useState("");
  const [buyUrl, setBuyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function pickRoom(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setRoom(f);
    setResult(null);
    setError(null);
    setRoomPreview(f ? URL.createObjectURL(f) : null);
  }
  function pickItem(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setItem(f);
    setResult(null);
    setError(null);
    setItemPreview(f ? URL.createObjectURL(f) : null);
  }

  async function generate() {
    if (!room) {
      setError("Önce bir oda fotoğrafı yükle.");
      return;
    }
    if (!item) {
      setError("Yerleştirmek istediğin mobilyanın fotoğrafını yükle.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("photo", room);
      fd.append("item", item);
      fd.append("placement", placement);
      fd.append("notes", notes);
      fd.append("buyUrl", buyUrl);
      const res = await fetch("/api/place", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bir hata oluştu.");
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function download() {
    if (!result) return;
    const r = await fetch(result.afterUrl);
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roomrestyle-yerlesim.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Control panel */}
      <div className="h-fit rounded-card border border-line bg-surface p-6 shadow-card">
        <p className="label-mono">1 — Oda fotoğrafı</p>
        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-field border border-dashed border-line bg-bg px-4 py-6 text-center transition hover:border-primary">
          <span className="text-sm font-medium text-ink">Odanın fotoğrafını seç</span>
          <span className="text-xs text-ink-muted">JPG, PNG veya WEBP · maks. 10 MB</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickRoom} className="hidden" />
        </label>
        {roomPreview && (
          <img src={roomPreview} alt="Oda önizleme" className="mt-3 w-full rounded-field border border-line" />
        )}

        <p className="label-mono mt-6">2 — Mobilya fotoğrafı</p>
        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-field border border-dashed border-line bg-bg px-4 py-6 text-center transition hover:border-primary">
          <span className="text-sm font-medium text-ink">Ürün / mobilya fotoğrafını seç</span>
          <span className="text-xs text-ink-muted">Beğendiğin ürünün net bir görseli</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickItem} className="hidden" />
        </label>
        {itemPreview && (
          <img src={itemPreview} alt="Mobilya önizleme" className="mt-3 h-32 w-full rounded-field border border-line object-contain bg-surface-2" />
        )}

        <p className="label-mono mt-6">3 — Nereye koyalım?</p>
        <div className="mt-2 flex gap-2">
          {PLACEMENTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlacement(p.id)}
              className={`flex-1 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                placement === p.id
                  ? "border-primary bg-primary text-white shadow-sm ring-2 ring-primary/25"
                  : "border-line bg-surface text-ink hover:border-primary hover:bg-surface-2"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="label-mono mt-6">4 — Not (opsiyonel)</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ör. duvara yasla, pencere önüne, biraz daha küçük"
          maxLength={300}
          rows={2}
          className="mt-2 w-full resize-none rounded-field border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
        />

        <p className="label-mono mt-6">5 — Ürün linki (opsiyonel)</p>
        <input
          type="url"
          value={buyUrl}
          onChange={(e) => setBuyUrl(e.target.value)}
          placeholder="https://... (Satın Al butonu için)"
          className="mt-2 w-full rounded-field border border-line bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary"
        />

        <button
          onClick={generate}
          disabled={loading}
          className="mt-5 w-full rounded-full bg-accent py-3.5 text-base font-semibold text-white shadow-card transition hover:bg-accent-ink hover:shadow-lg disabled:opacity-60"
        >
          {loading ? "Yerleştiriliyor… (birkaç saniye)" : "Odama yerleştir ✨"}
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Mimari korunur: yalnızca seçtiğin ürün odaya eklenir.
        </p>
        {error && <p className="mt-3 text-center text-sm text-accent-ink">{error}</p>}
      </div>

      {/* Result */}
      <div>
        {!result && !loading && (
          <div className="flex min-h-[320px] items-center justify-center rounded-card border border-dashed border-line bg-surface p-10 text-center">
            <div>
              <div className="mx-auto mb-4 h-12 w-12 rounded-field border-2 border-line" />
              <p className="font-display text-xl text-ink">Ürün odanda burada görünecek</p>
              <p className="mt-1 text-sm text-ink-muted">
                Oda ve mobilya fotoğrafını yükle, yerini seç; alırsan nasıl duracağını gör.
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-5">
            <div className="relative mx-auto w-full max-w-[520px]">
              <span className="absolute left-3 top-3 z-10 rounded-full bg-success px-3 py-1 text-xs font-medium text-white">
                Yapı korundu ✓
              </span>
              <BeforeAfter beforeUrl={result.beforeUrl} afterUrl={result.afterUrl} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={download}
                className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-2"
              >
                İndir
              </button>
              {result.buyUrl && (
                <a
                  href={result.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
                >
                  Satın Al 🛒
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
