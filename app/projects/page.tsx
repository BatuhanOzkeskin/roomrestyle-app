import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import StructureBadge from "@/components/StructureBadge";
import { STYLE_PRESETS } from "@/lib/styles";

export const dynamic = "force-dynamic";

function projectLabel(p: { mode?: string | null; style?: string | null }) {
  if (p.mode === "place") return "Yerleştirme";
  if (!p.style) return "Tasarım";
  return STYLE_PRESETS.find((s) => s.id === p.style)?.labelTr ?? p.style;
}

type Filter = "all" | "a" | "b";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "a", label: "Mod A · stil" },
  { id: "b", label: "Mod B · ürün" },
];
const isPlace = (p: { mode?: string | null }) => p.mode === "place";

export default async function ProjectsPage({ searchParams }: { searchParams?: { mod?: string } }) {
  const filter: Filter = searchParams?.mod === "a" || searchParams?.mod === "b" ? searchParams.mod : "all";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS: only this user's rows come back.
  const { data: projects } = await supabase
    .from("projects")
    .select("id, style, mode, status, output_path, created_at")
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(30);

  const all = projects ?? [];
  const counts: Record<Filter, number> = {
    all: all.length,
    a: all.filter((p) => !isPlace(p)).length,
    b: all.filter(isPlace).length,
  };
  const visible = filter === "all" ? all : all.filter((p) => (filter === "b" ? isPlace(p) : !isPlace(p)));

  // Sign a URL for each visible output image.
  const withUrls = await Promise.all(
    visible.map(async (p) => {
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
      <AppHeader active="projects" email={user.email} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="label-mono text-accent">Arşiv</span>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink">Projelerim</h1>
            {counts.all > 0 && (
              <p className="mt-2 text-sm text-ink-muted">{counts.all} tasarım · en yeni üstte</p>
            )}
          </div>
          <Link href="/dashboard" className="btn btn-primary btn-md">
            + Yeni tasarım
          </Link>
        </div>

        {counts.all > 0 && (
          <nav aria-label="Projeleri filtrele" className="mb-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f.id}
                href={f.id === "all" ? "/projects" : `/projects?mod=${f.id}`}
                aria-current={filter === f.id ? "page" : undefined}
                className={`chip inline-flex items-center gap-2 ${filter === f.id ? "chip-active" : ""}`}
              >
                {f.label}
                <span className="font-mono text-[11px] text-ink-muted">{counts[f.id]}</span>
              </Link>
            ))}
          </nav>
        )}

        {counts.all > 0 && withUrls.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-card border border-dashed border-ink/15 bg-surface/50 p-10 text-center">
            <p className="font-display text-xl text-ink">Bu filtrede henüz tasarım yok</p>
            <p className="mt-2 text-sm text-ink-muted">
              {filter === "b" ? "Beğendiğin bir mobilyayı odanda dene." : "Odanı bir stille yeniden tasarla."}
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/projects" className="btn btn-secondary btn-md">Tümünü göster</Link>
              <Link href="/dashboard" className="btn btn-primary btn-md">Stüdyoya git</Link>
            </div>
          </div>
        ) : withUrls.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-card border border-dashed border-ink/15 bg-surface/50 p-10 text-center">
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="h-16 w-16">
              <rect x="4" y="4" width="56" height="56" rx="14" stroke="rgb(var(--rr-ink-rgb) / 0.25)" strokeWidth="2" strokeDasharray="4 5" />
              <rect x="15" y="15" width="18" height="18" rx="4" stroke="rgb(var(--rr-ink-rgb) / 0.35)" strokeWidth="2" />
              <rect x="31" y="31" width="18" height="18" rx="4" fill="var(--rr-accent)" />
            </svg>
            <p className="mt-6 font-display text-2xl text-ink">Henüz tasarımın yok</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
              İlk odanı oluştur; tüm tasarımların ve yerleştirmelerin burada birikir.
            </p>
            <Link href="/dashboard" className="btn btn-primary btn-md mt-7">
              İlkini oluştur
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {withUrls.map((p) => {
              const card = (
                <>
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                    {p.url && (
                      <img
                        src={p.url}
                        alt={projectLabel(p)}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    <StructureBadge className="absolute left-3 top-3" />
                  </div>
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-medium text-ink">{projectLabel(p)}</p>
                      <p className="label-mono mt-1">{p.mode === "place" ? "Mod B · ürün" : "Mod A · stil"}</p>
                    </div>
                    <span className="label-mono">
                      {new Date(p.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </>
              );
              return p.url ? (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Tam boyutta aç"
                  className="card card-hover group block overflow-hidden"
                >
                  {card}
                </a>
              ) : (
                <div key={p.id} className="card group overflow-hidden">
                  {card}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
