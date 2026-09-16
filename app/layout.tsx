import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoomRestyle — AI Interior Redesign",
  description:
    "Reimagine your room in any style while keeping its real architecture. Then turn the design into a real shopping list.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
