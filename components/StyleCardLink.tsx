"use client";

import Link from "next/link";

// Ana sayfadaki stil kartı: stüdyoyu bu stil seçili açar.
// Seçim ayrıca bu sekmede hatırlanır; ziyaretçi önce giriş yapmak zorunda kalsa da kaybolmaz.
export const STYLE_PICK_KEY = "rr-style-pick";

export default function StyleCardLink({
  styleId,
  label,
  className = "",
  children,
}: {
  styleId: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/dashboard?stil=${encodeURIComponent(styleId)}`}
      aria-label={`${label} stiliyle odamı tasarla`}
      onClick={() => {
        try {
          sessionStorage.setItem(STYLE_PICK_KEY, styleId);
        } catch {
          /* gizli sekme vb. — URL'deki seçim yine çalışır */
        }
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
