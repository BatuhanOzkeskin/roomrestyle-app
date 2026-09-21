import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Wordmark } from "@/components/Wordmark";
import SignOutButton from "@/components/SignOutButton";
import { STYLE_PRESETS } from "@/lib/styles";

export const dynamic = "force-dynamic";

function projectLabel(p: { mode?: string | null; style?: string | null }) {
  if (p.mode === "place") return "Yerleştirme";
  if (!p.style) return "Tasarım";
  return STYLE_PRESETS.find((s) => s.id === p.style)?.labelTr ?? p.style;
}

export default async function ProjectsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  // RLS: only this user's rows come back.
  const { data: projects } = await supabase
    .from("projects")
    .select("id, style, mode, status, output_path, created_at")
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(30);

  // Sign a URL for each output image.
  const withUrls = await Promise.all(
    (projects ?? []).map(async (p) => {
      let url: string | null = null;
      if (p.output_path) {
        const { data } = await supabase.storage
          .from("rooms")
          .createSignedUrl(p.output_path, 3600);
        url = data?.signedUrl ?? null;
      }
      return { ...p, url };
    })
  );

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line/60 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Wordmark onDark />
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-ink-muted transition hover:text-ink">
              Stüdyo
            </Link>
            <Link href="/projects" className="font-medium text-ink">
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
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="label-mono">Arşiv</span>
            <h1 className="mt-1 font-display text-3xl font-medium text-ink">Projelerim</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-ink"
          >
            Yeni tasarım
          </Link>
        </div>

        {withUrls.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface p-10 text-center">
            <div className="mb-4 h-12 w-12 rounded-field border-2 border-line" />
            <p className="font-display text-xl text-ink">Henüz tasarımın yok</p>
            <p className="mt-1 text-sm text-ink-muted">İlk odanı oluştur, burada birikmeye başlasın.</p>
            <Link
              href="/dashboard"
              className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-ink"
            >
              İlkini oluştur
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {withUrls.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-card border border-line bg-surface shadow-card transition hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] bg-surface-2">
                  {p.url && (
                    <img
                      src={p.url}
                      alt={projectLabel(p)}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-ink">
                    {projectLabel(p)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-ink">{projectLabel(p)}</span>
                  <span className="label-mono">
                    {new Date(p.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
