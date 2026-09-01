/**
 * Central venue configuration.
 *
 * To rebrand this template for another club, edit this file (name, colors,
 * contact info, feature flags). Colors flow into CSS variables in the root
 * layout; feature flags gate whole modules (nav links, home cards, routes
 * render an "unavailable" notice when disabled).
 */

export interface VenueFeatures {
  liveStream: boolean;
  webcams: boolean;
  messaging: boolean;
  kitchen: boolean;
  merch: boolean;
  parking: boolean;
  jobs: boolean;
  bookings: boolean;
}

export interface VenueConfig {
  eventsBooking: {
    description: string;
  };
  name: string;
  shortName: string;
  tagline: string;
  city: string;
  description: string;
  address: string;
  phone: string;
  hours: { days: string; open: string; close: string }[];
  socialLinks: { label: string; href: string }[];
  colors: {
    ink: string;
    ink2: string;
    ink3: string;
    bone: string;
    muted: string;
    gold: string;
    goldBright: string;
    goldDeep: string;
    blood: string;
  };
  features: VenueFeatures;
}

export const venue: VenueConfig = {
  name: "ONYX",
  shortName: "ONYX",
  tagline: "Atlanta After Dark",
  city: "Atlanta",
  description:
    "Atlanta's premier late-night destination. World-class entertainers, VIP tables, a full kitchen, and the city's best sound — every night until 3AM.",
  address: "1888 Peachtree Rd NW, Atlanta, GA 30309",
  phone: "(404) 555-0188",
  hours: [
    { days: "Mon – Thu", open: "8PM", close: "3AM" },
    { days: "Fri – Sat", open: "7PM", close: "4AM" },
    { days: "Sun", open: "9PM", close: "2AM" },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "X", href: "https://x.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
  colors: {
    ink: "#0a0808",
    ink2: "#14100e",
    ink3: "#1d1713",
    bone: "#f4ecdc",
    muted: "#a39581",
    gold: "#d4a94e",
    goldBright: "#f0d78c",
    goldDeep: "#8a6d2f",
    blood: "#c11430",
  },
  features: {
    liveStream: false,
    webcams: true,
    messaging: true,
    kitchen: true,
    merch: true,
    parking: true,
    jobs: true,
    bookings: true
  },
  eventsBooking: {
    description: "Book your next event at ONYX. World-class entertainers, VIP tables, and a full kitchen for an unforgettable experience.",
  },
};

/** CSS custom properties derived from venue colors, applied on <html>. */
export function venueCssVars(): Record<string, string> {
  const c = venue.colors;
  return {
    "--ink": c.ink,
    "--ink-2": c.ink2,
    "--ink-3": c.ink3,
    "--bone": c.bone,
    "--muted": c.muted,
    "--gold": c.gold,
    "--gold-bright": c.goldBright,
    "--gold-deep": c.goldDeep,
    "--blood": c.blood,
  };
}
