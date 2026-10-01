import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import BeforeAfter from "@/components/BeforeAfter";
import StructureBadge from "@/components/StructureBadge";
import StyleCardLink from "@/components/StyleCardLink";
import { STYLE_PRESETS } from "@/lib/styles";

// Stil vitrini için kısa Türkçe tanımlar (prompt'lara dokunmadan, sadece metin).
const STYLE_COPY: Record<string, { line: string; tags: string[] }> = {
  scandinavian: { line: "Ferah, aydınlık, sade.", tags: ["açık ahşap", "nötr tonlar", "bitki"] },
  "modern-minimalist": { line: "Az eşya, temiz çizgiler.", tags: ["alçak mobilya", "boş yüzey", "doku"] },
  industrial: { line: "Koyu, karakterli, sıcak ışık.", tags: ["metal", "tuğla", "deri"] },
  boho: { line: "Katmanlı, toprak tonlu, samimi.", tags: ["rattan", "kilim", "makrome"] },
  japandi: { line: "Sakin, doğal, işlevsel.", tags: ["doğal malzeme", "alçak", "dingin"] },
  coastal: { line: "Hafif, esintili, tatil havası.", tags: ["beyaz", "keten", "rattan"] },
};

const FAQ: [string, string][] = [
  [
    "Odamın mimarisi gerçekten korunuyor mu?",
    "Evet. Duvarlar, pencereler, kapılar ve odanın oranları sabit tutulur; yalnızca mobilya, tekstil, aydınlatma ve dekor değişir. Sonuçta gördüğünüz oda, sizin odanızdır.",
  ],
  [
    "Ne kadar sürer?",
    "Genellikle birkaç saniye. Fotoğraf yüklenir, stil seçilir ve önce/sonra karşılaştırması hazır olur.",
  ],
  [
    "Hangi fotoğraf iyi sonuç verir?",
    "Odanın tamamının ve zeminin göründüğü, iyi ışıklı ve düz açıyla çekilmiş tek bir kare yeterli. Telefon kamerası fazlasıyla iş görür.",
  ],
  [
    "Alışveriş listesindeki fiyatlar nereden geliyor?",
    "Fiyatlar Türkiye piyasasına göre verilen tahmini aralıklardır; bütçenizi kabaca planlamanız içindir. Kesin fiyat için mağazaya bakmanızı öneririz.",
  ],
  [
    "Fotoğraflarım ne oluyor?",
    "Fotoğraflarınız şifreli saklanır, yalnızca size görünür ve yapay zeka eğitimi için kullanılmaz. İstediğiniz an silebilirsiniz; veriler KVKK'ya uygun işlenir.",
  ],
];

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`h-4 w-4 ${className}`}>
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`h-4 w-4 flex-shrink-0 ${className}`}>
      <path d="m5 10.5 3.2 3L15 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead?: string }) {
  return (
    <div className="max-w-2xl">
      <span className="label-mono text-accent">{eyebrow}</span>
      <h2 className="mt-3 font-display text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-5xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-ink-muted">{lead}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-clip bg-bg">
      {/* Header — cam efektli, sayfayla aynı sıcak siyah */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark />
          <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
            <a href="#modlar" className="transition hover:text-ink">Nasıl çalışır</a>
            <a href="#stiller" className="transition hover:text-ink">Stiller</a>
            <a href="#sss" className="transition hover:text-ink">SSS</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="btn btn-ghost hidden px-3 py-2 text-sm sm:inline-flex">
              Giriş yap
            </Link>
            <Link href="/dashboard" className="btn btn-primary btn-md">
              Ücretsiz dene
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--rr-accent-rgb)/0.14),transparent)] blur-2xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 md:grid-cols-[1.1fr_1fr] md:pb-28 md:pt-24">
          <div className="animate-fade-up motion-reduce:animate-none">
            <span className="label-mono inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Mimarin korunur · saniyeler içinde
            </span>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-[-0.025em] text-ink sm:text-6xl lg:text-7xl">
              Odanızı harcamadan önce <em className="text-accent">görün.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
              Odanızın tek bir fotoğrafını yükleyin. Yapay zeka duvarlarınızı ve pencerelerinizi olduğu
              gibi koruyarak odayı yeniden tasarlar ya da beğendiğiniz mobilyayı odanıza yerleştirir;
              sonucu bütçeli bir alışveriş listesine çevirir.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="btn btn-primary btn-lg group">
                Odamı ücretsiz yeniden tasarla
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a href="#modlar" className="btn btn-secondary btn-lg">
                Nasıl çalışır?
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
              {["Kredi kartı gerekmez", "İlk denemeler ücretsiz", "Fotoğraflarınız gizli kalır"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="text-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Before/after showcase — gerçek RoomRestyle çıktısı */}
          <div
            className="relative mx-auto w-full max-w-[440px] animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: "150ms" }}
          >
            <div aria-hidden className="pointer-events-none absolute -inset-8 rounded-[48px] bg-accent/10 blur-3xl" />
            <div className="relative rounded-[26px] border border-line bg-surface/60 p-2 shadow-card">
              <StructureBadge className="absolute left-5 top-5 z-10" />
              <span className="badge-overlay absolute right-5 top-5 z-10">Japandi</span>
              <BeforeAfter beforeUrl="/showcase-before.jpg" afterUrl="/showcase-after.jpg" autoSweep />
            </div>
            <p className="label-mono mt-4 text-center">Gerçek çıktı · sürükleyerek karşılaştırın</p>
          </div>
        </div>

        {/* Güven şeridi */}
        <div className="relative border-y border-line bg-surface/40">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
            {[
              ["Mimari", "Duvar · pencere · oran korunur"],
              ["Stil", "6 küratörlü tasarım dili"],
              ["Bütçe", "TL bazlı tahmini liste"],
              ["Gizlilik", "Fotoğraflar yalnızca sizde"],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`px-6 py-6 ${i % 2 === 1 ? "border-l border-line" : ""} ${i === 2 ? "md:border-l md:border-line" : ""} ${i > 1 ? "max-md:border-t max-md:border-line" : ""}`}
              >
                <dt className="label-mono">{k}</dt>
                <dd className="mt-1.5 text-sm text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* İki mod — tek bölümde */}
      <section id="modlar">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHead
            eyebrow="Nasıl çalışır"
            title={<>İki mod, tek söz: <em className="text-accent">odan aynı kalır.</em></>}
            lead="İster odanı bir stille baştan giydir, ister internette gördüğün bir mobilyayı almadan önce kendi odanda dene."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {[
              {
                tag: "Mod A",
                title: "Odanı yeniden tasarla",
                cta: "Odamı tasarla",
                featured: false,
                steps: [
                  ["Fotoğrafı yükle", "Telefonla çekilmiş tek bir kare yeterli."],
                  ["Stilini seç", "İskandinav'dan boheme; istersen notunu ekle."],
                  ["Listeye çevir", "Sonucu indir ya da fiyatlı alışveriş listesine dönüştür."],
                ],
              },
              {
                tag: "Mod B · Öne çıkan",
                title: "Mobilyanı odana koy",
                cta: "Mobilyamı dene",
                featured: true,
                steps: [
                  ["Odanı yükle", "Mevcut odanın tek bir fotoğrafı."],
                  ["Mobilyayı yükle", "Beğendiğin ürünün görseli; istersen satın alma linki."],
                  ["Yerini seç, gör", "Sol, orta ya da sağ — gerçekçi ölçek ve ışıkla."],
                ],
              },
            ].map((m) => (
              <div
                key={m.title}
                className={`card card-hover relative flex flex-col p-8 md:p-10 ${
                  m.featured ? "border-accent/30 bg-gradient-to-b from-accent/[0.07] to-surface" : ""
                }`}
              >
                <span className={`label-mono ${m.featured ? "text-accent" : ""}`}>{m.tag}</span>
                <h3 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink">{m.title}</h3>
                <ol className="mt-8 flex-1 space-y-5">
                  {m.steps.map(([t, d], i) => (
                    <li key={t} className="flex gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line font-mono text-xs text-ink-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-medium text-ink">{t}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/dashboard"
                  className={`btn btn-md group mt-10 self-start ${m.featured ? "btn-primary" : "btn-secondary"}`}
                >
                  {m.cta}
                  <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structure-Lock — imza özellik */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
          <div>
            <SectionHead
              eyebrow="Yapı kilidi"
              title="Mimarine dokunmaz. Sadece hayal ettiğin değişir."
              lead="Sıradan üretimlerde pencere kayar, duvar uzar, oda başka bir odaya dönüşür. RoomRestyle odanın iskeletini kilitler — sonucu gerçekten kendi evinde hayal edebilirsin."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <span className="label-mono">Korunan</span>
                <StructureBadge />
              </div>
              <ul className="mt-5 space-y-3 text-sm text-ink">
                {["Duvarlar ve köşeler", "Pencere ve kapılar", "Tavan yüksekliği", "Odanın oranları"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <Check className="text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <span className="label-mono">Değişen</span>
              <ul className="mt-5 space-y-3 text-sm text-ink-muted">
                {["Mobilya", "Tekstil ve halı", "Aydınlatma", "Dekor ve bitkiler"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6 sm:col-span-2">
              <div className="flex items-baseline justify-between">
                <span className="label-mono">İlhamdan aksiyona</span>
                <span className="label-mono text-gold">Örnek liste</span>
              </div>
              <ul className="mt-4 divide-y divide-line text-sm">
                {[
                  ["Keten üçlü kanepe", "18.000–26.000 TL"],
                  ["Rattan sehpa", "3.500–6.000 TL"],
                  ["Yün halı 160×230", "5.000–9.000 TL"],
                ].map(([n, p]) => (
                  <li key={n} className="flex items-center justify-between py-2.5">
                    <span className="text-ink">{n}</span>
                    <span className="font-mono text-xs text-ink-muted">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stil vitrini */}
      <section id="stiller" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <SectionHead
            eyebrow="Stiller"
            title="Onlarca benzer preset değil; seçilmiş altı tasarım dili."
            lead="Birini seç; stüdyo o stille hazır açılsın."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {STYLE_PRESETS.map((s, i) => {
              const copy = STYLE_COPY[s.id];
              return (
                <StyleCardLink
                  key={s.id}
                  styleId={s.id}
                  label={s.labelTr}
                  className="group block bg-bg p-8 transition duration-300 hover:bg-surface focus-visible:outline-offset-[-3px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ink-muted transition group-hover:text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowRight className="-translate-x-1 text-accent opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-ink">{s.labelTr}</h3>
                  {copy && (
                    <>
                      <p className="mt-2 text-sm text-ink-muted">{copy.line}</p>
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {copy.tags.map((t) => (
                          <span key={t} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-muted">
                            {t}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="label-mono mt-6 text-ink-muted/70 transition group-hover:text-accent">Bu stille dene</p>
                </StyleCardLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.4fr] md:py-32">
          <SectionHead eyebrow="SSS" title="Aklındaki sorular" />
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-medium text-ink transition hover:text-accent [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition duration-300 group-open:rotate-45 group-open:border-accent/50 group-open:text-accent">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Kapanış çağrısı */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-accent/25 bg-surface px-8 py-16 text-center md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(var(--rr-accent-rgb)/0.16),transparent_60%)]"
          />
          <div className="relative">
            <span className="label-mono text-accent">Bu akşam dene</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-5xl">
              Para harcamadan önce, odanın yeni halini gör.
            </h2>
            <Link href="/dashboard" className="btn btn-primary btn-lg group mt-9">
              Ücretsiz başla
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <p className="label-mono mt-5">Kredi kartı gerekmez</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark size={24} />
            <p className="mt-4 text-sm text-ink-muted">
              Evinizi olduğu gibi kabul eder, ilhamı bütçesi belli bir plana çevirir.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted/70">
              Fotoğraflarınız şifreli saklanır, yalnızca size görünür ve yapay zeka eğitimi için
              kullanılmaz. İstediğiniz an silebilirsiniz · KVKK&apos;ya uygun işlenir.
            </p>
          </div>
          <nav className="flex gap-8 text-sm text-ink-muted">
            <a href="#modlar" className="transition hover:text-ink">Nasıl çalışır</a>
            <a href="#stiller" className="transition hover:text-ink">Stiller</a>
            <a href="#sss" className="transition hover:text-ink">SSS</a>
            <Link href="/login" className="transition hover:text-ink">Giriş</Link>
          </nav>
        </div>
        <div className="border-t border-line">
          <p className="label-mono mx-auto max-w-6xl px-6 py-5">© 2026 RoomRestyle</p>
        </div>
      </footer>
    </div>
  );
}
