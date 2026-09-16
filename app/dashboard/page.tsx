import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RoomStudio from "@/components/RoomStudio";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          Room<span className="text-brand">Restyle</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/projects" className="text-ink/60 hover:text-ink">
            Projelerim
          </Link>
          <SignOutButton />
        </nav>
      </header>

      <h1 className="mb-1 text-2xl font-bold">Odanı yeniden tasarla</h1>
      <p className="mb-6 text-sm text-ink/60">
        Bir fotoğraf yükle, stil seç. Mimarini bozmadan yeni bir oda.
      </p>

      <RoomStudio />
    </main>
  );
}
