import Link from "next/link";

// Logo mark: outer rounded square = preserved architecture;
// filled terracotta square = the new object placed inside.
export function LogoMark({ size = 28, onDark = false }: { size?: number; onDark?: boolean }) {
  const stroke = onDark ? "#ffffff" : "var(--rr-primary)";
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
  onDark = false,
}: {
  href?: string;
  size?: number;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} onDark={onDark} />
      <span className="font-display text-xl leading-none">
        <span className={onDark ? "text-white" : "text-ink"}>Room</span>
        <span className={onDark ? "text-accent" : "text-accent"}>Restyle</span>
      </span>
    </Link>
  );
}
