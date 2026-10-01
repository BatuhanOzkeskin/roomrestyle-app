import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import AccountMenu from "@/components/AccountMenu";

// Giriş yapılmış sayfaların (Stüdyo, Projelerim) ortak üst menüsü.
export default function AppHeader({
  active,
  email,
}: {
  active: "studio" | "projects";
  email: string | null | undefined;
}) {
  const links = [
    { id: "studio", href: "/dashboard", label: "Stüdyo" },
    { id: "projects", href: "/projects", label: "Projelerim" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Wordmark compact />
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              aria-current={active === l.id ? "page" : undefined}
              className={`rounded-full px-2.5 py-1.5 transition sm:px-3.5 ${
                active === l.id ? "bg-ink/[0.06] font-medium text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <AccountMenu email={email} />
        </nav>
      </div>
    </header>
  );
}
