import type { Metadata, Viewport } from "next";
import "./globals.css";
import { creditsEnabled, venue, venueCssVars } from "@/config/venue";
import { fontPreset } from "@/config/fonts";
import DemoRibbon from "@/components/layout/DemoRibbon";
import { AppProvider } from "@/lib/store";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import SWRegister from "@/components/layout/SWRegister";
import BuyCreditsModal from "@/components/messages/BuyCreditsModal";

const fonts = fontPreset(venue.theme.fonts);

export const metadata: Metadata = {
  title: {
    default: `${venue.name} — ${venue.tagline}`,
    template: `%s — ${venue.name}`,
  },
  description: venue.description,
  applicationName: venue.name,
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
      className={fonts.className}
      data-style={venue.theme.style}
      data-club={venue.slug}
      data-ribbon={venue.demo.ribbon ? "" : undefined}
      style={{ ...venueCssVars(), ...fonts.vars } as React.CSSProperties}
    >
      <body className="antialiased">
        <AppProvider>
          <SWRegister />
          <DemoRibbon />
          <Navbar />
          <main className="site-main min-h-screen pt-16">{children}</main>
          <Footer />
          <BottomNav />
          {creditsEnabled ? <BuyCreditsModal /> : null}
        </AppProvider>
      </body>
    </html>
  );
}
