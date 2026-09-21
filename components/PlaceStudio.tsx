"use client";

import { useState, useEffect } from "react";
import BeforeAfter from "@/components/BeforeAfter";

type Result = { id: string; beforeUrl: string; afterUrl: string; buyUrl: string | null };

const PLACEMENTS: { id: string; label: string }[] = [
  { id: "left", label: "Sol" },
  { id: "center", label: "Orta" },
  { id: "right", label: "Sağ" },
];

const STEPS = [
  "Odan analiz ediliyor",
  "Mobilyan tanımlanıyor",
  "Ölçek ve perspektif ayarlanıyor",
  "Işık eşleştiriliyor",
  "Sonuç hazırlanıyor",
];

export default function PlaceStudio() {
  const [room, setRoom] = useState<File | null>(null);
  const [roomPreview, setRoomPreview] = useState<string | null>(null);
  const [item, setItem] = useState<File | null>(null);
  const [itemPreview, setItemPreview] = useState<string | null>(null);
  const [placement, setPlacement] = useState("center");
  const [notes, setNotes] = useState("");
  const [buyUrl, setBuyUrl] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setStep(0);
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1600);
    return () => clearInterval(id);
  }, [loading]);

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
      fd.append("widthCm", widthCm);
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
        <div className="mt-2 rounded-field border border-dashed border-line bg-bg p-4 text-center">
          <p className="text-sm font-medium text-ink">Odanın fotoğrafı</p>
          <p className="text-xs text-ink-muted">JPG, PNG veya WEBP · maks. 10 MB</p>
          <div className="mt-3 flex gap-2">
            <label className="flex-1 cursor-pointer rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:bg-surface-2">
              📷 Çek
              <input type="file" accept="image/*" capture="environment" onChange={pickRoom} className="hidden" />
            </label>
            <label className="flex-1 cursor-pointer rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:bg-surface-2">
              🖼️ Galeriden
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickRoom} className="hidden" />
            </label>
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
          İpucu: odanın tamamı ve zemini görünsün · iyi ışık · düz açı.
        </p>
        {roomPreview && (
          <img src={roomPreview} alt="Oda önizleme" className="mt-3 w-full rounded-field border border-line" />
        )}

        <p className="label-mono mt-6">2 — Mobilya fotoğrafı</p>
        <div className="mt-2 rounded-field border border-dashed border-line bg-bg p-4 text-center">
          <p className="text-sm font-medium text-ink">Ürün / mobilya fotoğrafı</p>
          <p className="text-xs text-ink-muted">Beğendiğin ürünün net bir görseli</p>
          <div className="mt-3 flex gap-2">
            <label className="flex-1 cursor-pointer rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:bg-surface-2">
              📷 Çek
              <input type="file" accept="image/*" capture="environment" onChange={pickItem} className="hidden" />
            </label>
            <label className="flex-1 cursor-pointer rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:bg-surface-2">
              🖼️ Galeriden
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickItem} className="hidden" />
            </label>
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
          İpucu: ürünü önden, net ve mümkünse tek başına çek.
        </p>
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
                  ? "border-accent bg-accent text-white shadow-sm ring-2 ring-accent/25"
                  : "border-line bg-surface text-ink hover:border-accent hover:bg-surface-2"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="label-mono mt-6">Yaklaşık genişlik — opsiyonel</p>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={widthCm}
            onChange={(e) => setWidthCm(e.target.value)}
            placeholder="ör. 220"
            className="w-24 rounded-field border border-line bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-accent"
          />
          <span className="text-xs text-ink-muted">cm — ölçeği doğru yerleştirmek için</span>
        </div>

        <p className="label-mono mt-6">4 — Not (opsiyonel)</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ör. duvara yasla, pencere önüne, biraz daha küçük"
          maxLength={300}
          rows={2}
          className="mt-2 w-full resize-none rounded-field border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
        />

        <p className="label-mono mt-6">5 — Ürün linki (opsiyonel)</p>
        <input
          type="url"
          value={buyUrl}
          onChange={(e) => setBuyUrl(e.target.value)}
          placeholder="https://... (Satın Al butonu için)"
          className="mt-2 w-full rounded-field border border-line bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-accent"
        />

        <button
          onClick={generate}
          disabled={loading}
          className="mt-5 w-full rounded-full bg-accent py-3.5 text-base font-semibold text-[#0b0a09] shadow-card transition hover:bg-accent-ink hover:shadow-lg disabled:opacity-60"
        >
          {loading ? "Yerleştiriliyor… (birkaç saniye)" : "Odama yerleştir ✨"}
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Mimari korunur: yalnızca seçtiğin ürün odaya eklenir.
        </p>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-muted">
          🔒 Fotoğrafların şifreli saklanır, yalnızca sana görünür ve AI eğitimi için kullanılmaz.
        </p>
        {error && <p className="mt-3 text-center text-sm text-accent-ink">{error}</p>}
      </div>

      {/* Result */}
      <div>
        {loading && (
          <div className="flex min-h-[320px] items-center justify-center rounded-card border border-line bg-surface p-10">
            <div className="w-full max-w-xs space-y-2.5">
              {STEPS.map((s, i) => (
                <p
                  key={i}
                  className={`flex items-center gap-2 text-sm transition ${
                    i < step ? "text-ink-muted" : i === step ? "text-ink" : "text-ink-muted/40"
                  }`}
                >
                  <span className={i < step ? "text-success" : i === step ? "text-accent" : "text-ink-muted/40"}>
                    {i < step ? "✓" : i === step ? "●" : "○"}
                  </span>
                  {s}…
                </p>
              ))}
            </div>
          </div>
        )}

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
              <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
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
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-ink"
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
