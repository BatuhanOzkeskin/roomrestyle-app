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

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Controls */}
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">1. Oda fotoğrafını yükle</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPick}
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white hover:file:bg-brand-dark"
          />
          {preview && !result && (
            <img src={preview} alt="Önizleme" className="mt-3 w-full rounded-xl border border-ink/10" />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">2. Stil seç</label>
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyleId(s.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  styleId === s.id
                    ? "border-brand bg-brand text-white"
                    : "border-ink/15 hover:border-brand"
                }`}
              >
                {s.labelTr}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            3. İstersen bir not ekle (opsiyonel)
          </label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ör. daha sıcak tonlar, bol bitki"
            maxLength={300}
            className="w-full rounded-lg border border-ink/15 px-4 py-2 outline-none focus:border-brand"
          />
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Tasarlanıyor… (birkaç saniye)" : "Odamı yeniden tasarla"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {/* Result */}
      <div className="space-y-4">
        {!result && !loading && (
          <div className="flex h-full min-h-56 items-center justify-center rounded-xl border border-dashed border-ink/20 p-6 text-center text-sm text-ink/50">
            Sonuç burada görünecek — önce/sonra olarak karşılaştırabileceksin.
          </div>
        )}

        {result && (
          <>
            <BeforeAfter beforeUrl={result.beforeUrl} afterUrl={result.afterUrl} />
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              Yapın korundu ✓ — sadece dekor değişti
            </span>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={download}
                className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium hover:border-brand"
              >
                İndir
              </button>
              <button
                onClick={makeReal}
                disabled={itemsLoading}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {itemsLoading ? "Hazırlanıyor…" : "Bu odayı gerçekleştir 🛒"}
              </button>
            </div>

            {items && (
              <div className="rounded-xl border border-ink/10 bg-white p-4">
                <h3 className="mb-3 font-semibold">Alışveriş & bütçe listesi</h3>
                <ul className="space-y-3">
                  {items.map((it, i) => (
                    <li key={i} className="border-b border-ink/5 pb-2 last:border-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium">{it.name}</span>
                        <span className="whitespace-nowrap text-sm text-brand">
                          {it.estimatedPriceTRY}
                        </span>
                      </div>
                      <p className="text-sm text-ink/60">{it.description}</p>
                      <p className="text-xs text-ink/40">Nereden: {it.whereToBuy}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
