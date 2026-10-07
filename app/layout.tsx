import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const DESCRIPTION =
  "Odanızın fotoğrafını yükleyin, bir stil seçin. Yapay zeka mimarinizi bozmadan odanızı yeniden tasarlar ve sonucu bütçeli bir alışveriş listesine çevirir.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RoomRestyle — Odanızı harcamadan önce görün",
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
