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
      <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark />
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <Link href="/dashboard" aria-current="page" className="rounded-full bg-ink/[0.06] px-3.5 py-1.5 font-medium text-ink">
              Stüdyo
            </Link>
            <Link href="/projects" className="rounded-full px-3.5 py-1.5 text-ink-muted transition hover:text-ink">
              Projelerim
            </Link>
            <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
            <span className="hidden sm:block">
              <SignOutButton />
            </span>
            <span
              title={user.email ?? undefined}
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent"
            >
              {initial}
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <span className="label-mono text-accent">Stüdyo</span>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink">
            Bugün hangi odayı değiştiriyoruz?
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            İki mod: odanı bir stille yeniden tasarla, ya da beğendiğin bir mobilyayı kendi
            odana yerleştir. Her ikisinde de mimarin korunur.
          </p>
        </div>

        <Studio />
      </main>
    </div>
  );
}
