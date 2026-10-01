// İmza rozet: "Yapı korundu ✓" — tüm görsellerde aynı görünüm.
export default function StructureBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-bg/75 px-3 py-1 text-xs font-medium text-ink shadow-glow backdrop-blur-md ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--rr-accent-rgb))]" />
      Yapı korundu ✓
    </span>
  );
}
