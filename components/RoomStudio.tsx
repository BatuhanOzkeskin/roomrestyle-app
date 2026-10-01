"use client";

import { useState, useEffect } from "react";
import { STYLE_PRESETS } from "@/lib/styles";
import BeforeAfter from "@/components/BeforeAfter";
import StructureBadge from "@/components/StructureBadge";
import ShareButton from "@/components/ShareButton";
import { STYLE_PICK_KEY } from "@/components/StyleCardLink";
import {
  Icon,
  Spinner,
  StepLabel,
  PreviewThumb,
  PrivacyNote,
  ErrorNote,
  EmptyResult,
  LoadingResult,
} from "@/components/StudioUI";

type Result = { id: string; beforeUrl: string; afterUrl: string };
type Item = {
  name: string;
  description: string;
  estimatedPriceTRY: string;
  whereToBuy: string;
  emoji?: string;
};

const STEPS = [
  "Fotoğrafın analiz ediliyor",
  "Odanın geometrisi korunuyor",
  "Stil uygulanıyor",
  "Sonuç hazırlanıyor",
];

// "3.000–5.000 TL" gibi metinlerden kaba bir toplam bütçe aralığı çıkarır (yalnızca ekranda gösterim).
function budgetRange(items: Item[]): [number, number] | null {
  let min = 0;
  let max = 0;
  let found = false;
  for (const it of items) {
    const nums = (it.estimatedPriceTRY.match(/\d[\d.]*/g) ?? [])
      .map((n) => parseInt(n.replace(/\./g, ""), 10))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (nums.length === 0) continue;
    found = true;
    min += nums[0];
    max += nums[1] ?? nums[0];
  }
  return found ? [min, max] : null;
}

const tl = (n: number) => n.toLocaleString("tr-TR");

// Yapay zekâ bazen emoji yerine kelime yazar (ör. yastık emojisi olmadığı için "pillow").
// Yalnızca gerçek bir emoji varsa onu göster; yoksa sade ürün ikonuna düş.
const EMOJI_RE = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/u;
function itemEmoji(raw?: string): string | null {
  return raw?.match(EMOJI_RE)?.[0] ?? null;
}

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
  const [step, setStep] = useState(0);
  const [pickedFromHome, setPickedFromHome] = useState(false);

  // Ana sayfadaki stil kartından gelindiyse o stili seçili başlat (?stil=… ya da sekmede hatırlanan seçim).
  useEffect(() => {
    let pick: string | null = null;
    try {
      pick = new URLSearchParams(window.location.search).get("stil");
    } catch {}
    try {
      if (!pick) pick = sessionStorage.getItem(STYLE_PICK_KEY);
      sessionStorage.removeItem(STYLE_PICK_KEY);
    } catch {}
    if (pick && STYLE_PRESETS.some((s) => s.id === pick)) {
      setStyleId(pick);
      setPickedFromHome(true);
    }
  }, []);

  useEffect(() => {
    if (!loading) return;
    setStep(0);
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1600);
    return () => clearInterval(id);
  }, [loading]);

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
  const budget = items ? budgetRange(items) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Control panel */}
      <div className="card h-fit p-6 shadow-card">
        <StepLabel n={1}>Fotoğraf</StepLabel>
        <label className="dropzone mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 px-4 py-7 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-accent">
            <Icon.Upload />
          </span>
          <span className="text-sm font-medium text-ink">
            {file ? "Fotoğrafı değiştir" : "Oda fotoğrafını seç"}
          </span>
          <span className="text-xs text-ink-muted">JPG, PNG veya WEBP · maks. 10 MB</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} className="hidden" />
        </label>
        {preview && !result ? (
          <PreviewThumb src={preview} alt="Önizleme" />
        ) : (
          <p className="mt-2.5 text-[11px] leading-relaxed text-ink-muted">
            İpucu: odanın tamamı görünsün · iyi ışık · kamera düz. Kötü foto, kötü sonuç verir.
          </p>
        )}

        <div className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <StepLabel n={2}>Stil</StepLabel>
            {pickedFromHome && <span className="text-[11px] text-gold">Seçtiğin stil hazır</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {STYLE_PRESETS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setStyleId(s.id);
                  setPickedFromHome(false);
                }}
                aria-pressed={styleId === s.id}
                className={`chip ${styleId === s.id ? "chip-active" : ""}`}
              >
                {s.labelTr}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <StepLabel n={3}>Not · opsiyonel</StepLabel>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ör. daha sıcak tonlar, bol bitki; halıyı değiştirme"
            maxLength={300}
            rows={3}
            className="field mt-3 resize-none"
          />
        </div>

        <button onClick={generate} disabled={loading} className="btn btn-primary btn-lg mt-6 w-full">
          {loading ? (
            <>
              <Spinner /> Tasarlanıyor…
            </>
          ) : (
            <>
              <Icon.Spark /> Odamı yeniden tasarla
            </>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Mimari korunur: duvarlar, pencereler ve oranlar değişmez.
        </p>
        <PrivacyNote />
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>

      {/* Result */}
      <div>
        {loading && <LoadingResult steps={STEPS} step={step} />}

        {!result && !loading && (
          <EmptyResult
            title="Sonuç burada görünecek"
            text="Fotoğrafı yükleyip stil seç; önce/sonra olarak karşılaştırabilirsin."
            tips={["Tek kare yeterli", "Gün ışığı en iyisi", "Kamera göz hizasında"]}
          />
        )}

        {result && !loading && (
          <div className="animate-fade-up space-y-5 motion-reduce:animate-none">
            <div className="relative">
              <StructureBadge className="absolute left-3 top-3 z-10" />
              <BeforeAfter beforeUrl={result.beforeUrl} afterUrl={result.afterUrl} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={download} className="btn btn-secondary btn-md">
                <Icon.Download /> İndir
              </button>
              <ShareButton imageUrl={result.afterUrl} fileName="roomrestyle.png" />
              <button onClick={makeReal} disabled={itemsLoading} className="btn btn-primary btn-md">
                {itemsLoading ? (
                  <>
                    <Spinner /> Liste hazırlanıyor…
                  </>
                ) : (
                  <>
                    <Icon.Bag /> Bu odayı gerçekleştir
                  </>
                )}
              </button>
              <span className="label-mono ml-auto rounded-full border border-line px-3 py-1">
                {activeStyle?.labelTr}
              </span>
            </div>

            {itemsLoading && !items && (
              <div className="card p-6" aria-hidden>
                <div className="h-6 w-44 animate-pulse rounded bg-ink/10" />
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-line py-4 last:border-0">
                    <div className="h-12 w-12 animate-pulse rounded-field bg-ink/[0.07]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-1/3 animate-pulse rounded bg-ink/10" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-ink/[0.06]" />
                    </div>
                    <div className="h-3.5 w-24 animate-pulse rounded bg-ink/10" />
                  </div>
                ))}
              </div>
            )}

            {items && (
              <div className="card animate-fade-up overflow-hidden shadow-card motion-reduce:animate-none">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line p-6">
                  <div>
                    <span className="label-mono text-accent">Bu odayı gerçekleştir</span>
                    <h3 className="mt-1.5 font-display text-3xl tracking-tight text-ink">Alışveriş listesi</h3>
                  </div>
                  <div className="text-right">
                    <span className="label-mono">{items.length} ürün · tahmini toplam</span>
                    {budget && (
                      <p className="mt-1 font-display text-2xl text-gold">
                        {budget[0] === budget[1]
                          ? `${tl(budget[0])} TL`
                          : `${tl(budget[0])} – ${tl(budget[1])} TL`}
                      </p>
                    )}
                  </div>
                </div>
                <ul>
                  {items.map((it, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 border-b border-line px-6 py-4 transition hover:bg-ink/[0.02] last:border-0"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-field border border-line bg-surface-2 text-2xl">
                        {itemEmoji(it.emoji) ?? <Icon.Bag className="h-5 w-5 text-ink-muted" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink">{it.name}</p>
                        <p className="truncate text-sm text-ink-muted">{it.description}</p>
                        <p className="mt-1 font-mono text-xs text-ink sm:hidden">{it.estimatedPriceTRY}</p>
                      </div>
                      <span className="hidden whitespace-nowrap font-mono text-sm text-ink sm:block">
                        {it.estimatedPriceTRY}
                      </span>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(it.name + " satın al")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${it.name} için mağazaya git`}
                        className="btn btn-secondary px-3 py-1.5 text-xs"
                      >
                        <span className="hidden sm:inline">Mağazaya git</span>
                        <Icon.External className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-line bg-bg/40 px-6 py-3 text-xs text-ink-muted">
                  Fiyatlar tahminidir ve Türkiye piyasasına göre verilir; toplam, aralıkların kaba toplamıdır.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
