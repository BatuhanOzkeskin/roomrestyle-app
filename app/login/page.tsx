"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BeforeAfter from "@/components/BeforeAfter";
import StructureBadge from "@/components/StructureBadge";
import { Wordmark } from "@/components/Wordmark";
import { Spinner } from "@/components/StudioUI";

const SIGNUP_OK = "Hesap oluşturuldu. E-postanı doğrulayıp giriş yapabilirsin.";

// Sık görülen İngilizce hata mesajlarını ekranda Türkçe göster (yalnızca metin).
function trMsg(m: string) {
  const s = m.toLowerCase();
  if (s.includes("invalid login credentials")) return "E-posta veya şifre hatalı.";
  if (s.includes("email not confirmed")) return "E-postan henüz doğrulanmamış. Gelen kutunu kontrol et.";
  if (s.includes("already registered") || s.includes("already been registered"))
    return "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.";
  if (s.includes("password should be at least")) return "Şifre en az 6 karakter olmalı.";
  if (s.includes("rate limit") || s.includes("too many")) return "Çok fazla deneme yapıldı. Biraz bekleyip tekrar dene.";
  if (s.includes("invalid") && s.includes("email")) return "Geçerli bir e-posta adresi gir.";
  return m;
}

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
          setMsg(SIGNUP_OK);
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

  const isSuccess = msg === SIGNUP_OK;

  return (
    <main className="relative flex min-h-screen items-center bg-bg p-4 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--rr-accent-rgb)/0.1),transparent)] blur-2xl"
      />
      <div className="relative mx-auto grid w-full max-w-5xl animate-fade-up overflow-hidden rounded-[28px] border border-line shadow-card motion-reduce:animate-none md:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden flex-col justify-between gap-10 border-r border-line bg-surface p-10 md:flex">
          <Wordmark />
          <div>
            <span className="label-mono text-accent">Yapı kilidi</span>
            <h2 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink">
              Odanız aynı kalır,
              <br />
              <em className="text-accent">fikirleriniz</em> değişir.
            </h2>
            <div className="relative mt-8">
              <StructureBadge className="absolute left-3 top-3 z-10" />
              <BeforeAfter beforeUrl="/login-before.jpg" afterUrl="/login-after.jpg" />
            </div>
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">
            Tasarımlarını kaydet, beğendiğin mobilyaları odanda dene, alışveriş planını gör.
          </p>
        </div>

        {/* Right form */}
        <div className="flex flex-col justify-center bg-bg/60 p-8 sm:p-12">
          <Wordmark className="mb-8 md:hidden" />

          <div role="tablist" className="mb-8 inline-flex self-start rounded-full border border-line bg-surface p-1 text-sm">
            {(
              [
                ["in", "Giriş yap"],
                ["up", "Kayıt ol"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                onClick={() => setMode(id)}
                className={`rounded-full px-4 py-1.5 font-medium transition duration-200 ${
                  mode === id ? "bg-ink/[0.08] text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
            {mode === "in" ? "Tekrar hoş geldiniz" : "Hesabınızı oluşturun"}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {mode === "in"
              ? "Projelerinize ve alışveriş listelerinize devam edin."
              : "Ücretsiz başlayın; kredi kartı gerekmez."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="label-mono mb-2 block">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ornek@eposta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-mono mb-2 block">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "in" ? "current-password" : "new-password"}
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? (
                <>
                  <Spinner /> Bir saniye…
                </>
              ) : mode === "in" ? (
                "Giriş yap"
              ) : (
                "Hesap oluştur"
              )}
            </button>
          </form>

          {msg && (
            <p
              role={isSuccess ? "status" : "alert"}
              className={`mt-5 rounded-field border px-4 py-3 text-sm text-ink ${
                isSuccess ? "border-success/30 bg-success/10" : "border-accent/30 bg-accent/10"
              }`}
            >
              {trMsg(msg)}
            </p>
          )}

          <p className="mt-8 text-xs leading-relaxed text-ink-muted">
            Devam ederek Kullanım Koşulları ve Gizlilik Politikası&apos;nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </main>
  );
}
