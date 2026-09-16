"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setMsg("Hesap oluşturuldu. E-postanı doğrulayıp giriş yapabilirsin.");
          setMode("in");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg p-4 sm:p-8">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-card border border-line shadow-card md:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden flex-col justify-between bg-primary p-10 text-white md:flex">
          <span className="font-display text-xl">
            Room<span className="text-white/70">Restyle</span>
          </span>
          <div>
            <h2 className="font-display text-3xl leading-snug">
              Odanız aynı kalır,<br />fikirleriniz değişir.
            </h2>
            <div className="mt-6 aspect-[4/3] rounded-field bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.10)_0_10px,rgba(255,255,255,.04)_10px_20px)]" />
          </div>
          <p className="text-sm italic text-white/70">
            &ldquo;Kanepeyi almadan önce salonda nasıl duracağını gördüm.&rdquo; — Elif, İzmir
          </p>
        </div>

        {/* Right form */}
        <div className="bg-surface p-8 sm:p-10">
          <div className="mb-6 inline-flex rounded-full bg-surface-2 p-1 text-sm">
            <button
              onClick={() => setMode("in")}
              className={`rounded-full px-4 py-1.5 transition ${mode === "in" ? "bg-surface shadow-sm text-ink" : "text-ink-muted"}`}
            >
              Giriş yap
            </button>
            <button
              onClick={() => setMode("up")}
              className={`rounded-full px-4 py-1.5 transition ${mode === "up" ? "bg-surface shadow-sm text-ink" : "text-ink-muted"}`}
            >
              Kayıt ol
            </button>
          </div>

          <h1 className="font-display text-3xl text-ink">
            {mode === "in" ? "Tekrar hoş geldiniz" : "Hesabınızı oluşturun"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Projelerinize ve alışveriş listelerinize devam edin.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-ink-muted">E-posta</label>
              <input
                type="email"
                required
                placeholder="ornek@eposta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-field border border-line bg-surface px-4 py-3 outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink-muted">Şifre</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-field border border-line bg-surface px-4 py-3 outline-none transition focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? "..." : mode === "in" ? "Giriş yap" : "Hesap oluştur"}
            </button>
          </form>

          {msg && <p className="mt-4 text-sm text-accent-ink">{msg}</p>}

          <p className="mt-6 text-xs text-ink-muted">
            Devam ederek Kullanım Koşulları ve Gizlilik Politikası&apos;nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </main>
  );
}
