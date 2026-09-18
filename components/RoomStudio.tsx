"use client";

import { useState } from "react";
import { STYLE_PRESETS } from "@/lib/styles";
import BeforeAfter from "@/components/BeforeAfter";

type Result = { id: string; beforeUrl: string; afterUrl: string };
type Item = {
  name: string;
  description: string;
  estimatedPriceTRY: string;
  whereToBuy: string;
};

export default function RoomStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [styleId, setStyleId] = useState(STYLE_PRESETS[0].id);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [itemsLoading, setItemsLoading] = useState(false);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setResult(null);
    setItems(null);
    setError(null);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function generate() {
    if (!file) {
      setError("Önce bir oda fotoğrafı yükle.");
      return;
    }
    setLoading(true);
    setError(null);
    setItems(null);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("style", styleId);
      fd.append("notes", notes);
      const res = await fetch("/api/redesign", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bir hata oluştu.");
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function makeReal() {
    if (!result) return;
    setItemsLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: result.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Liste oluşturulamadı.");
      setItems(data.items);
    } catch (e: any) {
      setError(e?.message ?? "Liste oluşturulamadı.");
    } finally {
      setItemsLoading(false);
    }
  }

  async function download() {
    if (!result) return;
    const r = await fetch(result.afterUrl);
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roomrestyle.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  const activeStyle = STYLE_PRESETS.find((s) => s.id === styleId);

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Control panel */}
      <div className="h-fit rounded-card border border-line bg-surface p-6 shadow-card">
        <p className="label-mono">1 — Fotoğraf</p>
        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-field border border-dashed border-line bg-bg px-4 py-8 text-center transition hover:border-primary">
          <span className="text-sm font-medium text-ink">Oda fotoğrafını seç</span>
          <span className="text-xs text-ink-muted">JPG, PNG veya WEBP · maks. 10 MB</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} className="hidden" />
        </label>
        {file && (
          <div className="mt-3 flex items-center justify-between rounded-field bg-surface-2 px-3 py-2 text-sm">
            <span className="truncate text-ink">{file.name}</span>
            <span className="label-mono text-success">yüklendi</span>
          </div>
        )}
        {preview && !result && (
          <img src={preview} alt="Önizleme" className="mt-3 w-full rounded-field border border-line" />
        )}

        <p className="label-mono mt-6">2 — Stil</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STYLE_PRESETS.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyleId(s.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                styleId === s.id
                  ? "border-primary bg-primary text-white shadow-sm ring-2 ring-primary/25"
                  : "border-line bg-surface text-ink hover:border-primary hover:bg-surface-2"
              }`}
            >
              {s.labelTr}
            </button>
          ))}
        </div>

        <p className="label-mono mt-6">3 — Not (opsiyonel)</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ör. daha sıcak tonlar, bol bitki; halıyı değiştirme"
          maxLength={300}
          rows={3}
          className="mt-2 w-full resize-none rounded-field border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
        />

        <button
          onClick={generate}
          disabled={loading}
          className="mt-5 w-full rounded-full bg-accent py-3.5 text-base font-semibold text-white shadow-card transition hover:bg-accent-ink hover:shadow-lg disabled:opacity-60"
        >
          {loading ? "Tasarlanıyor… (birkaç saniye)" : "Odamı yeniden tasarla ✨"}
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Mimari korunur: duvarlar, pencereler ve oranlar değişmez.
        </p>
        {error && <p className="mt-3 text-center text-sm text-accent-ink">{error}</p>}
      </div>

      {/* Result */}
      <div>
        {!result && !loading && (
          <div className="flex min-h-[320px] items-center justify-center rounded-card border border-dashed border-line bg-surface p-10 text-center">
            <div>
              <div className="mx-auto mb-4 h-12 w-12 rounded-field border-2 border-line" />
              <p className="font-display text-xl text-ink">Sonuç burada görünecek</p>
              <p className="mt-1 text-sm text-ink-muted">
                Fotoğrafı yükleyip stil seçin; önce/sonra olarak karşılaştırabilirsiniz.
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-5">
            <div className="relative">
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
              <button
                onClick={makeReal}
                disabled={itemsLoading}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
              >
                {itemsLoading ? "Hazırlanıyor…" : "Bu odayı gerçekleştir 🛒"}
              </button>
              <span className="label-mono ml-auto">{activeStyle?.labelTr}</span>
            </div>

            {items && (
              <div className="rounded-card border border-line bg-surface p-6 shadow-card">
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="font-display text-2xl text-ink">Alışveriş listesi</h3>
                  <span className="label-mono">{items.length} ürün</span>
                </div>
                <ul>
                  {items.map((it, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 border-b border-line/60 py-3 last:border-0"
                    >
                      <div className="h-11 w-11 flex-shrink-0 rounded-field bg-surface-2" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink">{it.name}</p>
                        <p className="truncate text-sm text-ink-muted">{it.description}</p>
                      </div>
                      <span className="whitespace-nowrap font-mono text-sm text-ink">
                        {it.estimatedPriceTRY}
                      </span>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(it.name + " satın al")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-surface-2"
                      >
                        Mağazaya git
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink-muted">
                  Fiyatlar tahminidir ve Türkiye piyasasına göre verilir.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
