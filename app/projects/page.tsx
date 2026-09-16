import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS: only this user's rows come back.
  const { data: projects } = await supabase
    .from("projects")
    .select("id, style, status, output_path, created_at")
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
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          Room<span className="text-brand">Restyle</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/dashboard" className="text-ink/60 hover:text-ink">
            Yeni tasarım
          </Link>
          <SignOutButton />
        </nav>
      </header>

      <h1 className="mb-6 text-2xl font-bold">Projelerim</h1>

      {withUrls.length === 0 ? (
        <p className="text-ink/60">
          Henüz tasarımın yok.{" "}
          <Link href="/dashboard" className="text-brand hover:underline">
            İlkini oluştur →
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withUrls.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-ink/10 bg-white">
              {p.url && <img src={p.url} alt={p.style ?? "Tasarım"} className="w-full" />}
              <div className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="capitalize">{p.style}</span>
                <span className="text-ink/40">
                  {new Date(p.created_at).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
