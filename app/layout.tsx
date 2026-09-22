import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Spectral, Kalam, IBM_Plex_Sans, Special_Elite } from "next/font/google";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const specialElite = Special_Elite({
  variable: "--font-special",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Tutor de Idiomas",
  description: "Pratique conversação e receba correções com IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body
          className={`${spectral.variable} ${kalam.variable} ${plexSans.variable} ${specialElite.variable} font-sans antialiased flex flex-col min-h-screen`}
        >
          <TooltipProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
