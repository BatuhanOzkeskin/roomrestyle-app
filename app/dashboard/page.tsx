import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Wordmark } from "@/components/Wordmark";
import Studio from "@/components/Studio";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line/60 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark onDark />
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="font-medium text-ink">
              Stüdyo
            </Link>
            <Link href="/projects" className="text-ink-muted transition hover:text-ink">
              Projelerim
            </Link>
            <SignOutButton />
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-white">
              {initial}
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <span className="label-mono">Stüdyo</span>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink">Stüdyo</h1>
          <p className="mt-1 text-sm text-ink-muted">
            İki mod: odanı bir stille yeniden tasarla, ya da beğendiğin bir mobilyayı kendi
            odana yerleştir. Her ikisinde de mimarin korunur.
          </p>
        </div>

        <Studio />
      </main>
    </div>
  );
}
