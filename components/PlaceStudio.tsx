"use client";

import { useState, useEffect } from "react";
import BeforeAfter from "@/components/BeforeAfter";
import StructureBadge from "@/components/StructureBadge";
import ShareButton from "@/components/ShareButton";
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

/** Kamera / galeri seçimli yükleme kutusu (görünüm). */
function UploadBox({
  title,
  hint,
  done,
  onPick,
}: {
  title: string;
  hint: string;
  done: boolean;
  onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="dropzone mt-3 p-4 text-center">
      <p className="text-sm font-medium text-ink">{done ? `${title} · değiştir` : title}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>
      <div className="mt-3 flex gap-2">
        <label className="btn btn-secondary flex-1 cursor-pointer px-3 py-2 text-sm">
          <Icon.Camera /> Çek
          <input type="file" accept="image/*" capture="environment" onChange={onPick} className="hidden" />
        </label>
        <label className="btn btn-secondary flex-1 cursor-pointer px-3 py-2 text-sm">
          <Icon.Image /> Galeriden
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} className="hidden" />
        </label>
      </div>
    </div>
  );
}

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
      <div className="card h-fit p-6 shadow-card">
        <StepLabel n={1}>Oda fotoğrafı</StepLabel>
        <UploadBox
          title="Odanın fotoğrafı"
          hint="JPG, PNG veya WEBP · maks. 10 MB"
          done={!!room}
          onPick={pickRoom}
        />
        {roomPreview ? (
          <PreviewThumb src={roomPreview} alt="Oda önizleme" />
        ) : (
          <p className="mt-2.5 text-[11px] leading-relaxed text-ink-muted">
            İpucu: odanın tamamı ve zemini görünsün · iyi ışık · düz açı.
          </p>
        )}

        <div className="mt-7">
          <StepLabel n={2}>Mobilya fotoğrafı</StepLabel>
          <UploadBox
            title="Ürün / mobilya fotoğrafı"
            hint="Beğendiğin ürünün net bir görseli"
            done={!!item}
            onPick={pickItem}
          />
          {itemPreview ? (
            <PreviewThumb src={itemPreview} alt="Mobilya önizleme" contain />
          ) : (
            <p className="mt-2.5 text-[11px] leading-relaxed text-ink-muted">
              İpucu: ürünü önden, net ve mümkünse tek başına çek.
            </p>
          )}
        </div>

        <div className="mt-7">
          <StepLabel n={3}>Nereye koyalım?</StepLabel>
          <div role="radiogroup" className="mt-3 grid grid-cols-3 gap-1 rounded-full border border-line bg-bg/60 p-1">
            {PLACEMENTS.map((p) => (
              <button
                key={p.id}
                role="radio"
                aria-checked={placement === p.id}
                onClick={() => setPlacement(p.id)}
                className={`rounded-full py-1.5 text-sm font-medium transition duration-200 ${
                  placement === p.id
                    ? "bg-accent text-on-accent shadow-glow"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <StepLabel>Yaklaşık genişlik · opsiyonel</StepLabel>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative w-32">
              <input
                type="number"
                min={1}
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
                placeholder="ör. 220"
                className="field pr-11"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-muted">
                cm
              </span>
            </div>
            <span className="text-xs leading-snug text-ink-muted">ölçeği doğru yerleştirmek için</span>
          </div>
        </div>

        <div className="mt-7">
          <StepLabel n={4}>Not · opsiyonel</StepLabel>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ör. duvara yasla, pencere önüne, biraz daha küçük"
            maxLength={300}
            rows={2}
            className="field mt-3 resize-none"
          />
        </div>

        <div className="mt-7">
          <StepLabel n={5}>Ürün linki · opsiyonel</StepLabel>
          <input
            type="url"
            value={buyUrl}
            onChange={(e) => setBuyUrl(e.target.value)}
            placeholder="https://... (Satın Al butonu için)"
            className="field mt-3"
          />
        </div>

        <button onClick={generate} disabled={loading} className="btn btn-primary btn-lg mt-6 w-full">
          {loading ? (
            <>
              <Spinner /> Yerleştiriliyor…
            </>
          ) : (
            <>
              <Icon.Spark /> Odama yerleştir
            </>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Mimari korunur: yalnızca seçtiğin ürün odaya eklenir.
        </p>
        <PrivacyNote plural />
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>

      {/* Result */}
      <div>
        {loading && <LoadingResult steps={STEPS} step={step} />}

        {!result && !loading && (
          <EmptyResult
            title="Ürün odanda burada görünecek"
            text="Oda ve mobilya fotoğrafını yükle, yerini seç; alırsan nasıl duracağını gör."
            tips={["Ürün önden çekilsin", "Genişliği yaz", "Zemin görünsün"]}
          />
        )}

        {result && !loading && (
          <div className="animate-fade-up space-y-5 motion-reduce:animate-none">
            <div className="relative mx-auto w-full max-w-[560px]">
              <StructureBadge className="absolute left-3 top-3 z-10" />
              <BeforeAfter beforeUrl={result.beforeUrl} afterUrl={result.afterUrl} />
            </div>

            <div className="mx-auto flex w-full max-w-[560px] flex-wrap items-center gap-3">
              <button onClick={download} className="btn btn-secondary btn-md">
                <Icon.Download /> İndir
              </button>
              <ShareButton imageUrl={result.afterUrl} fileName="roomrestyle-yerlesim.png" />
              {result.buyUrl && (
                <a
                  href={result.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-md"
                >
                  <Icon.Bag /> Satın Al
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
