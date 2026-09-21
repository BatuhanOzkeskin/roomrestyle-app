import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import BeforeAfter from "@/components/BeforeAfter";

export default function Home() {
  return (
    <div className="bg-bg">
      {/* Header — dikkat çekici koyu şerit */}
      <header className="bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark onDark />
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/80 sm:flex">
            <a href="#nasil" className="transition hover:text-white">Nasıl çalışır</a>
            <a href="#stiller" className="transition hover:text-white">Stiller</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Giriş yap
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#0b0a09] shadow-sm transition hover:bg-accent-ink"
            >
              Ücretsiz dene
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:grid-cols-2 md:py-28">
        <div>
          <span className="label-mono inline-block rounded-full border border-line bg-surface px-3 py-1.5">
            Mevcut odan korunur · saniyeler içinde
          </span>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.04] tracking-tight text-ink sm:text-6xl">
            Odanızı harcamadan önce görün.
          </h1>
          <p className="mt-4 text-base font-medium text-white">
            Beğendiğiniz mobilyayı almadan önce kendi odanızda deneyin — ya da odanızı bir stille baştan tasarlayın.
          </p>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-muted">
            Odanızın fotoğrafını yükleyin. Yapay zeka, duvarlarınızı ve pencerelerinizi olduğu
            gibi koruyarak beğendiğiniz ürünü odanıza yerleştirir ya da odayı yeniden tasarlar;
            sonucu tahmini bütçesiyle bir plana çevirir.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-[#0b0a09] shadow-card transition hover:bg-accent-ink"
            >
              Odamı ücretsiz yeniden tasarla
            </Link>
            <a
              href="#nasil"
              className="rounded-full border border-line bg-surface px-6 py-3 text-base font-medium text-ink transition hover:bg-surface-2"
            >
              Nasıl çalışır?
            </a>
          </div>
          <p className="label-mono mt-5">
            Kredi kartı gerekmez · İlk denemeler ücretsiz · Fotoğraflarınız gizli kalır
          </p>
        </div>

        {/* Before/after showcase — gerçek RoomRestyle çıktısı */}
        <div className="relative mx-auto w-full max-w-[420px]">
          {/* Yumuşak premium ışıltı */}
          <div aria-hidden className="pointer-events-none absolute -inset-10 rounded-[48px] bg-accent/15 blur-3xl" />
          <div className="relative">
            <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-medium text-[#0b0a09]">
              Yapı korundu ✓
            </span>
            <span className="absolute right-3 top-3 z-10 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-ink">
              Japandi
            </span>
            <BeforeAfter beforeUrl="/showcase-before.jpg" afterUrl="/showcase-after.jpg" accentClass="accent-accent" />
            <p className="mt-3 text-center text-xs text-ink-muted">
              Gerçek çıktı · kaydırarak önce/sonra karşılaştırın
            </p>
          </div>
        </div>
      </section>

      {/* Mode B highlight — flagship */}
      <section className="border-t border-line/60 bg-bg">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <span className="label-mono text-accent">Öne çıkan</span>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
            Beğendiğin mobilyayı, almadan önce odanda dene
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
            İnternette gördüğün bir mobilyanın fotoğrafını yükle; RoomRestyle onu senin gerçek
            odana, mimarini bozmadan yerleştirsin.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Odanı yükle", "Mevcut odanın tek bir fotoğrafı yeterli."],
              ["02", "Mobilyayı yükle", "Beğendiğin ürünün fotoğrafını ekle; istersen satın alma linkini de."],
              ["03", "Yerini seç, gör", "Sol/orta/sağ seç; ürün odanda gerçekçi ölçek ve ışıkla belirsin."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-card border border-line bg-surface p-6">
                <span className="label-mono text-accent">{n}</span>
                <h3 className="mt-2 font-display text-xl text-ink">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d}</p>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-base font-semibold text-[#0b0a09] shadow-card transition hover:bg-accent-ink"
          >
            Mobilyanı odanda dene ✨
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="nasil" className="border-t border-line/60 bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <h2 className="font-display text-3xl font-medium text-ink">Nasıl çalışır</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Fotoğrafı yükleyin", "Telefonla çekilmiş tek bir kare yeterli. Odanın geometrisi fotoğraftan ölçülür."],
              ["02", "Stilinizi seçin", "İskandinav'dan boheme birçok stil; bütçenizi ve korumak istediğiniz eşyaları nota yazın."],
              ["03", "Listeye çevirin", "Sonucu indirin ya da “Bu odayı gerçekleştir” ile ürün ürün, fiyatlı bir alışveriş listesine dönüştürün."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-card border border-line bg-bg p-6">
                <span className="label-mono text-accent">{n}</span>
                <h3 className="mt-2 font-display text-xl text-ink">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section id="stiller" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid items-center gap-6 md:grid-cols-3">
          <div>
            <p className="font-display text-4xl font-medium text-accent">Küratörlü 6 stil</p>
            <p className="mt-1 text-sm text-ink-muted">İskandinav, Modern, Bohem, Japandi, Endüstriyel ve daha fazlası — birbirine benzeyen onlarca preset yerine seçilmiş tasarım dilleri.</p>
          </div>
          {[
            ["Mimarine dokunmaz", "Duvarlar, pencereler ve oranlar korunur; yalnızca dekor ve stil değişir. Sonucu gerçekten hayal edebilirsin."],
            ["İlhamdan aksiyona", "Beğendiğin odayı tek tıkla, tahmini bütçesiyle kalem kalem bir alışveriş planına çevir."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-card border border-line bg-surface p-6">
              <h3 className="font-display text-xl text-ink">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-display text-xl">
              Room<span className="text-accent">Restyle</span>
            </span>
            <p className="mt-1 max-w-xs text-sm text-white/60">
              Evinizi olduğu gibi kabul eder, ilhamı bütçesi belli bir plana çevirir.
            </p>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/45">
              🔒 Fotoğraflarınız şifreli saklanır, yalnızca size görünür ve AI eğitimi için
              kullanılmaz. İstediğiniz an silebilirsiniz · KVKK'ya uygun işlenir.
            </p>
          </div>
          <p className="label-mono text-white/50">© 2026 RoomRestyle</p>
        </div>
      </footer>
    </div>
  );
}
