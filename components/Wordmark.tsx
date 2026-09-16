import Link from "next/link";

// Logo mark: outer rounded square = preserved architecture;
// filled terracotta square = the new object placed inside.
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="1.25" y="1.25" width="25.5" height="25.5" rx="7" stroke="var(--rr-primary)" strokeWidth="2.5" />
      <rect x="6.5" y="6.5" width="8" height="8" rx="2" stroke="var(--rr-primary)" strokeWidth="2" />
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
}) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span className="font-display text-xl leading-none">
        <span className="text-ink">Room</span>
        <span className="text-primary">Restyle</span>
      </span>
    </Link>
  );
}
