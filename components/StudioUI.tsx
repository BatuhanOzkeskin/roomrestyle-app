// Stüdyo ekranlarının (RoomStudio + PlaceStudio) ortak görsel parçaları.
// Yalnızca görünüm — hiçbir veri/istek mantığı içermez.

type IconProps = { className?: string };
const base = "h-4 w-4 flex-shrink-0";
const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Icon = {
  Upload: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" {...stroke} />
    </svg>
  ),
  Camera: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z" {...stroke} />
      <circle cx="12" cy="12.5" r="3.2" {...stroke} />
    </svg>
  ),
  Image: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <rect x="4" y="5" width="16" height="14" rx="2" {...stroke} />
      <path d="m4 16 4.5-4.5 3.5 3.5 2.5-2.5L20 18" {...stroke} />
      <circle cx="15.5" cy="9.5" r="1.3" {...stroke} />
    </svg>
  ),
  Download: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" {...stroke} />
    </svg>
  ),
  Bag: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M5.5 8h13l-1 12h-11l-1-12Z" {...stroke} />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" {...stroke} />
    </svg>
  ),
  Spark: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2L12 3.5Z" {...stroke} />
    </svg>
  ),
  Lock: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" {...stroke} />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" {...stroke} />
    </svg>
  ),
  External: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M14 5h5v5m0-5-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" {...stroke} />
    </svg>
  ),
  Share: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 15V4m0 0L8 8m4-4 4 4M6 11H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-1" {...stroke} />
    </svg>
  ),
  Refresh: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" {...stroke} />
    </svg>
  ),
  Check: ({ className = "" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="m6 12.5 4 4L18 8" {...stroke} />
    </svg>
  ),
};

export function Spinner({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-4 w-4 animate-spin ${className}`}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Kontrol panelindeki numaralı adım başlığı. */
export function StepLabel({ n, children }: { n?: number; children: React.ReactNode }) {
  return (
    <p className="label-mono flex items-center gap-2">
      {n !== undefined && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[10px] text-ink">
          {n}
        </span>
      )}
      {children}
    </p>
  );
}

/** Yüklenen fotoğrafın küçük önizlemesi + "değiştir" hissi. */
export function PreviewThumb({ src, alt, contain = false }: { src: string; alt: string; contain?: boolean }) {
  return (
    <div className="relative mt-3 overflow-hidden rounded-field border border-line bg-surface-2">
      <img
        src={src}
        alt={alt}
        className={`w-full ${contain ? "h-32 object-contain" : "max-h-56 object-cover"}`}
      />
      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-ink/10 bg-bg/75 px-2 py-0.5 text-[11px] text-ink backdrop-blur-md">
        <Icon.Check className="h-3 w-3 text-success" />
        yüklendi
      </span>
    </div>
  );
}

export function PrivacyNote({ plural = false }: { plural?: boolean }) {
  return (
    <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-ink-muted">
      <Icon.Lock className="mt-px h-3.5 w-3.5" />
      <span>
        Fotoğraf{plural ? "ların" : "ın"} şifreli saklanır, yalnızca sana görünür ve AI eğitimi için
        kullanılmaz.
      </span>
    </p>
  );
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-4 rounded-field border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink">
      {children}
    </p>
  );
}

/** Sonuç alanının boş hali. */
export function EmptyResult({ title, text, tips }: { title: string; text: string; tips: string[] }) {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-card border border-dashed border-ink/15 bg-surface/50 p-10 text-center">
      <div className="max-w-sm">
        {/* Logo diliyle çizilmiş oda: dış çerçeve = korunan mimari, terracotta kare = yeni dokunuş */}
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="mx-auto h-16 w-16">
          <rect x="4" y="4" width="56" height="56" rx="14" stroke="rgb(var(--rr-ink-rgb) / 0.25)" strokeWidth="2" strokeDasharray="4 5" />
          <rect x="15" y="15" width="18" height="18" rx="4" stroke="rgb(var(--rr-ink-rgb) / 0.35)" strokeWidth="2" />
          <rect x="31" y="31" width="18" height="18" rx="4" fill="var(--rr-accent)" />
        </svg>
        <p className="mt-6 font-display text-2xl text-ink">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {tips.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Üretim sürerken: kullanıcının kendi fotoğrafı bulanık zeminde, üzerinden altın tarama çizgisi geçer;
 * önde ilerleme çubuğu + adımlar. Fotoğraf yoksa parlayan iskelet gösterilir.
 */
export function LoadingResult({
  steps,
  step,
  previewUrl,
  title = "Hazırlanıyor",
}: {
  steps: string[];
  step: number;
  previewUrl?: string | null;
  title?: string;
}) {
  const pct = Math.round(((step + 1) / steps.length) * 100);
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-card border border-line bg-surface" aria-live="polite">
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55 blur-[6px] grayscale-[35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/60 to-bg/85" />
          <div
            aria-hidden
            className="absolute inset-x-0 h-24 -translate-y-1/2 animate-scan bg-gradient-to-b from-transparent via-gold/15 to-transparent motion-reduce:hidden"
          >
            <div className="absolute inset-x-0 top-1/2 h-px bg-gold shadow-[0_0_14px_rgb(var(--rr-gold-rgb))]" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(100deg,transparent_30%,rgb(var(--rr-ink-rgb)/0.05)_50%,transparent_70%)] bg-[length:200%_100%] motion-reduce:animate-none" />
      )}
      <div className="relative flex min-h-[420px] items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-xs rounded-field border border-line bg-bg/70 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="label-mono text-accent">{title}</span>
            <span className="font-mono text-xs text-ink-muted">%{pct}</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-gold transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <ul className="mt-6 space-y-3">
            {steps.map((s, i) => (
              <li
                key={i}
                className={`flex items-center gap-2.5 text-sm transition duration-300 ${
                  i < step ? "text-ink-muted" : i === step ? "text-ink" : "text-ink-muted/40"
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center">
                  {i < step ? (
                    <Icon.Check className="h-4 w-4 text-success" />
                  ) : i === step ? (
                    <Spinner className="text-accent" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-muted/40" />
                  )}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export type VersionThumb = { id: string; afterUrl: string; label: string };

/** Bu oturumda üretilen versiyonlar: küçük resimlere tıklayarak aralarında geçiş. */
export function VersionStrip({
  versions,
  activeId,
  onSelect,
}: {
  versions: VersionThumb[];
  activeId: string | undefined;
  onSelect: (id: string) => void;
}) {
  if (versions.length < 2) return null;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label-mono">Versiyonlar</span>
        <span className="text-[11px] text-ink-muted">Karşılaştırmak için birine dokun</span>
      </div>
      <div role="tablist" aria-label="Versiyonlar" className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {versions.map((v, i) => {
          const active = v.id === activeId;
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(v.id)}
              className="group w-24 flex-shrink-0 text-left"
            >
              <span
                className={`relative block aspect-[4/3] overflow-hidden rounded-field border transition duration-200 ${
                  active ? "border-accent ring-2 ring-accent/30" : "border-line group-hover:border-ink/30"
                }`}
              >
                <img src={v.afterUrl} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-ink backdrop-blur">
                  V{i + 1}
                </span>
              </span>
              <span className={`mt-1.5 block truncate text-xs ${active ? "text-ink" : "text-ink-muted"}`}>
                {v.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
