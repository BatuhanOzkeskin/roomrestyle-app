import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

// Arama sonuçları için: aranan ifadeler ("yapay zeka ile oda tasarımı", "dekorasyon") başlıkta.
// Sayfadaki slogan ("Odanızı harcamadan önce görün") paylaşım kartında kalır.
const DESCRIPTION =
  "Odanızın fotoğrafını yükleyin, Japandi'den Bohem'e stil seçin. Yapay zeka duvar ve pencereleri koruyarak yeniden tasarlasın, TL fiyatlı liste versin.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yapay Zeka ile Oda Tasarımı ve Dekorasyon | RoomRestyle",
    template: "%s · RoomRestyle",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: SITE_NAME,
    title: "RoomRestyle — Odanızı harcamadan önce görün",
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "RoomRestyle önce/sonra: mimari korunarak yeniden tasarlanmış oda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomRestyle — Odanızı harcamadan önce görün",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#141311",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
