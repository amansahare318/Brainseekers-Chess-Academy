import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import { SettingsProvider } from "@/context/SettingsContext";
import WhatsAppFloatingButton from "@/components/layout/WhatsAppFloatingButton";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "BrainSeekers Chess Academy | Master the Game, Sharpen the Mind",
  description: "Transforming beginners into champions. Premium online chess coaching with FIDE Masters and grandmaster-level strategies. Interactive living chessboard, strategic learning pathways, and world-class training.",
  keywords: ["chess academy", "chess coaching", "online chess", "FIDE master", "learn chess", "brainseekers", "chess training"],
  authors: [{ name: "BrainSeekers Chess Academy" }],
  openGraph: {
    title: "BrainSeekers Chess Academy | Master the Game, Sharpen the Mind",
    description: "Premium online chess coaching for students worldwide. Master strategies, logic, and critical thinking with championship coaches.",
    url: "https://brainseekerschess.com",
    siteName: "BrainSeekers Chess Academy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrainSeekers Chess Academy",
    description: "Transforming beginners into champions with interactive, elite online chess coaching.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-navy-950 text-slate-100 font-sans selection:bg-royal-600 selection:text-white">
        <AuthProvider>
          <SettingsProvider>
            {children}
            <WhatsAppFloatingButton />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
