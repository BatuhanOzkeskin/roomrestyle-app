import type { Metadata } from "next";

// Giriş sayfası arama sonuçlarında çıkmasın.
export const metadata: Metadata = {
  title: "Giriş yap",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
