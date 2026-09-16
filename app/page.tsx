import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <p className="inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
          Yapını koruruz · sadece dekoru değiştiririz
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Odanı saniyeler içinde yeniden tasarla
        </h1>
        <p className="mx-auto max-w-xl text-lg text-ink/70">
          Odanın fotoğrafını yükle, bir stil seç. Yapay zekâ mimariyi bozmadan
          odanı yeniden tasarlar — sonra da onu gerçekleştirebilmen için bir
          alışveriş ve bütçe listesi çıkarır.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-dark"
      >
        Hadi başlayalım
      </Link>

      <div className="grid gap-4 pt-8 text-left sm:grid-cols-3">
        {[
          ["1. Yükle", "Odanın bir fotoğrafını çek ve yükle."],
          ["2. Stil seç", "İskandinav, modern, boho… tek dokunuş."],
          ["3. Sonucu al", "Önce/sonra karşılaştır, indir, listeyi gör."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-ink/10 bg-white p-4">
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-ink/60">{d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
