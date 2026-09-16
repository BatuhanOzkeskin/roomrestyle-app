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
        // If email confirmation is disabled in Supabase, a session exists now.
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
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-bold">
        {mode === "in" ? "Giriş yap" : "Hesap oluştur"}
      </h1>
      <p className="mt-1 text-sm text-ink/60">RoomRestyle'a devam etmek için.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="email"
          required
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-4 py-3 outline-none focus:border-brand"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Şifre (en az 6 karakter)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-4 py-3 outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "..." : mode === "in" ? "Giriş yap" : "Hesap oluştur"}
        </button>
      </form>

      {msg && <p className="mt-4 text-sm text-ink/70">{msg}</p>}

      <button
        onClick={() => setMode(mode === "in" ? "up" : "in")}
        className="mt-6 text-sm text-brand hover:underline"
      >
        {mode === "in" ? "Hesabın yok mu? Oluştur" : "Zaten hesabın var mı? Giriş yap"}
      </button>
    </main>
  );
}
