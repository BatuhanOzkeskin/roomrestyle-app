import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import BeforeAfter from "@/components/BeforeAfter";

export default function Home() {
  return (
    <div className="bg-bg">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Wordmark />
        <nav className="hidden items-center gap-7 text-sm text-ink-muted sm:flex">
          <a href="#nasil" className="hover:text-ink">Nasıl çalışır</a>
          <a href="#stiller" className="hover:text-ink">Stiller</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            Giriş yap
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            Ücretsiz dene
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-20">
        <div>
          <span className="label-mono inline-block rounded-full border border-line bg-surface px-3 py-1.5">
            Mevcut odan korunur · saniyeler içinde
          </span>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.04] tracking-tight text-ink sm:text-6xl">
            Odanızı harcamadan önce görün.
          </h1>
          <p className="mt-4 text-base font-medium text-primary">
            Bir AI oda tasarımcısı değil — bir yenileme karar aracı.
          </p>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-muted">
            Mevcut odanızın fotoğrafını yükleyin, tarzınızı seçin. Yapay zeka duvarlarınızı
            ve pencerelerinizi olduğu gibi koruyarak odayı yeniden tasarlar; sonra beğendiğiniz
            görünümü tahmini bütçesiyle bir plana çevirir.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition hover:bg-primary-hover"
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
          <span className="absolute left-3 top-3 z-10 rounded-full bg-success px-3 py-1 text-xs font-medium text-white">
            Yapı korundu ✓
          </span>
          <span className="absolute right-3 top-3 z-10 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-ink">
            Japandi
          </span>
          <BeforeAfter beforeUrl="/showcase-before.jpg" afterUrl="/showcase-after.jpg" />
          <p className="mt-3 text-center text-xs text-ink-muted">
            Gerçek çıktı · kaydırarak önce/sonra karşılaştırın
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="nasil" className="border-t border-line/60 bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
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
      <section id="stiller" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-6 md:grid-cols-3">
          <div>
            <p className="font-display text-4xl font-medium text-primary">Küratörlü 7 stil</p>
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
      <footer className="bg-ink text-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-display text-xl">
              Room<span className="text-primary">Restyle</span>
            </span>
            <p className="mt-1 max-w-xs text-sm text-surface/60">
              Evinizi olduğu gibi kabul eder, ilhamı bütçesi belli bir plana çevirir.
            </p>
          </div>
          <p className="label-mono text-surface/50">© 2026 RoomRestyle</p>
        </div>
      </footer>
    </div>
  );
}
