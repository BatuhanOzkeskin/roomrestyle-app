import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import Studio from "@/components/Studio";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader active="studio" email={user.email} />

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
