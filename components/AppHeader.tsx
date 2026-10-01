import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import SignOutButton from "@/components/SignOutButton";

// Giriş yapılmış sayfaların (Stüdyo, Projelerim) ortak üst menüsü.
export default function AppHeader({
  active,
  email,
}: {
  active: "studio" | "projects";
  email: string | null | undefined;
}) {
  const initial = (email ?? "?").charAt(0).toUpperCase();
  const links = [
    { id: "studio", href: "/dashboard", label: "Stüdyo" },
    { id: "projects", href: "/projects", label: "Projelerim" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Wordmark />
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              aria-current={active === l.id ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 transition ${
                active === l.id ? "bg-ink/[0.06] font-medium text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
          <span className="hidden sm:block">
            <SignOutButton />
          </span>
          <span
            title={email ?? undefined}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent"
          >
            {initial}
          </span>
        </nav>
      </div>
    </header>
  );
}
