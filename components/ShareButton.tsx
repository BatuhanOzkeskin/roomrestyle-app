"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, Spinner } from "@/components/StudioUI";

const SHARE_TEXT = "RoomRestyle ile odamı, mimarisini bozmadan yeniden tasarladım.";

// Sonucu paylaş: destekleyen cihazlarda görselin kendisi paylaşılır;
// diğerlerinde metin + site linki panoya kopyalanır. Özel (imzalı) görsel linki asla paylaşılmaz.
export default function ShareButton({ imageUrl, fileName }: { imageUrl: string; fileName: string }) {
  const fileRef = useRef<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  // Görseli önceden hazırla: paylaşım menüsü tıklamadan hemen sonra açılabilsin.
  useEffect(() => {
    let alive = true;
    fileRef.current = null;
    fetch(imageUrl)
      .then((r) => r.blob())
      .then((b) => {
        if (alive) fileRef.current = new File([b], fileName, { type: b.type || "image/png" });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [imageUrl, fileName]);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 3500);
    return () => clearTimeout(t);
  }, [note]);

  async function share() {
    setBusy(true);
    try {
      const file = fileRef.current;
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "RoomRestyle", text: SHARE_TEXT });
        return;
      }
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${window.location.origin}`);
      setNote("Metin ve site linki kopyalandı. Görseli eklemek için “İndir”i kullan.");
    } catch (e: any) {
      if (e?.name !== "AbortError") setNote("Paylaşılamadı. Görseli “İndir” ile kaydedebilirsin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="relative inline-flex">
      <button onClick={share} disabled={busy} className="btn btn-secondary btn-md">
        {busy ? <Spinner /> : <Icon.Share />} Paylaş
      </button>
      {note && (
        <span
          role="status"
          className="absolute left-0 top-full z-20 mt-2 w-64 animate-fade-up rounded-field border border-line bg-surface px-3 py-2 text-xs leading-relaxed text-ink shadow-card motion-reduce:animate-none"
        >
          {note}
        </span>
      )}
    </span>
  );
}
