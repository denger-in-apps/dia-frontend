import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { PwaRegister } from "@/components/pwa/PwaRegister";

export const metadata: Metadata = {
  title: "Denger.in — Ruang Aman Mahasiswa Didengar",
  description: "Di sini, kamu didengar sebelum semuanya terasa berat. Layanan konseling, curhat anonim, dan bantuan darurat mahasiswa.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a1f5e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-bg text-text">
        <Providers>
          <PwaRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
