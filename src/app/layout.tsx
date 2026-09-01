import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import { venue, venueCssVars } from "@/config/venue";
import { AppProvider } from "@/lib/store";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import SWRegister from "@/components/layout/SWRegister";
import BuyCreditsModal from "@/components/messages/BuyCreditsModal";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: `${venue.name} — ${venue.tagline}`,
    template: `%s — ${venue.name}`,
  },
  description: venue.description,
  applicationName: venue.name,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: venue.name,
  },
};

export const viewport: Viewport = {
  themeColor: venue.colors.ink,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${manrope.variable}`}
      style={venueCssVars() as React.CSSProperties}
    >
      <body className="antialiased">
        <AppProvider>
          <SWRegister />
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <BottomNav />
          <BuyCreditsModal />
        </AppProvider>
      </body>
    </html>
  );
}
