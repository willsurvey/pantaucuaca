import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/components/Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PantauCuaca - Cuaca Cerdas, Hidup Lebih Mudah",
  description:
    "Aplikasi cuaca cerdas dengan AI yang memberikan info cuaca real-time, rekomendasi outfit, tips aktivitas, dan insight kesehatan personal untuk Indonesia.",
  keywords: ["cuaca", "weather", "Indonesia", "AI", "rekomendasi", "outfit", "aktivitas"],
  authors: [{ name: "PantauCuaca" }],
  openGraph: {
    title: "PantauCuaca - Cuaca Cerdas, Hidup Lebih Mudah",
    description: "Aplikasi cuaca cerdas dengan AI untuk Indonesia",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex min-h-full flex-col bg-background font-[family-name:var(--font-body)] text-foreground transition-colors duration-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
