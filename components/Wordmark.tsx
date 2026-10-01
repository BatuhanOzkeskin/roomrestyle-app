import Link from "next/link";

// Logo mark: outer rounded square = preserved architecture;
// filled terracotta square = the new object placed inside.
export function LogoMark({ size = 28 }: { size?: number; onDark?: boolean }) {
  const stroke = "var(--rr-ink)";
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="1.25" y="1.25" width="25.5" height="25.5" rx="7" stroke={stroke} strokeWidth="2.5" />
      <rect x="6.5" y="6.5" width="8" height="8" rx="2" stroke={stroke} strokeWidth="2" />
      <rect x="14" y="14" width="8" height="8" rx="2" fill="var(--rr-accent)" />
    </svg>
  );
}

export function Wordmark({
  href = "/",
  size = 28,
  className = "",
}: {
  href?: string;
  size?: number;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="RoomRestyle ana sayfa"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="transition-transform duration-300 ease-out group-hover:rotate-[-6deg]">
        <LogoMark size={size} />
      </span>
      <span className="font-display text-xl leading-none tracking-tight">
        <span className="text-ink">Room</span>
        <span className="text-accent">Restyle</span>
      </span>
    </Link>
  );
}
