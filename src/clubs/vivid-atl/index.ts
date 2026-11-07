import type { ClubDefinition } from "../types";
import { entertainers } from "./content/entertainers";
import { events, weeklySpecials } from "./content/events";
import { menuCategories, menuItems } from "./content/menu";
import { jobRoles } from "./content/jobs";
import { arrivalTimes, reservationPackages, tableOptions } from "./content/reserve";

/**
 * Vivide Atlanta — UNOFFICIAL CONCEPT DEMO for a Major Linkx pitch.
 *
 * Confirmed from the club's verified Instagram, @vivideatlanta (viewed
 * 2026-11-07):
 *   - Name "Vivide Atlanta"; wordmark VIVIDĒ with a geometric "V" monogram
 *     (white on black), and the line "Nightclub with a twist".
 *   - Bio: "Atlanta's Only 15 Hour Night Club with a Twist".
 *   - Address: 1271 Marietta Blvd NW, Atlanta, GA 30318 (also matches
 *     public listings).
 *   - Story highlights: Kitchen, Party, Bar, Hookah.
 *   - Flyers: "For VIP section 470-900-6040 @VR1_PROMOTION".
 *   - Weekly themed nights (see content/events.ts).
 *
 * NOT confirmed (shown as "confirm with management"): exact daily hours,
 * cover, dress code, age policy, prices, menu. Performers, events, prices
 * and menus are fictional samples and are badged as such in the UI.
 */
const CONFIRM = "confirm with management";

const vivide = {
  venue: {
    slug: "vivid-atl",
    name: "Vivide Atlanta",
    shortName: "Vivide",
    tagline: "Nightclub with a Twist",
    city: "West Midtown · Atlanta",
    description:
      "Atlanta's only 15-hour nightclub with a twist. Entertainment, kitchen, bar, and hookah on Marietta Blvd — now with a live Digital Stage and VIP booking from your phone.",
    address: "1271 Marietta Blvd NW, Atlanta, GA 30318",
    phone: "VIP sections: (470) 900-6040",
    hours: [],
    hoursNote: `Open 15 hours a day — exact daily hours: ${CONFIRM}`,
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/vivideatlanta/" },
      { label: "VIP · @vr1_promotion", href: "https://www.instagram.com/vr1_promotion/" },
    ],
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=1271+Marietta+Blvd+NW+Atlanta+GA+30318",
    colors: {
      ink: "#050505",
      ink2: "#0d0d0f",
      ink3: "#18181b",
      bone: "#f5f2ec",
      muted: "#9b978f",
      // champagne / chrome primary accent
      gold: "#d6bd86",
      goldBright: "#f4e8c8",
      goldDeep: "#8a7447",
      blood: "#e8284f",
      // "the twist": amethyst, used sparingly
      accent2: "#7b3fe4",
    },
    theme: {
      style: "cinematic",
      fonts: "vivide",
      wordmark: "VIVIDĒ",
      heroHue: 268,
    },
    labels: { performers: "Entertainers", performersShort: "Dancers", bookings: "Celebrations" },
    nav: { mobile: ["home", "performers", "live", "reserve", "events"], style: "overlay" },
    home: {
      layout: "cinematic",
      eyebrow: "1271 Marietta Blvd NW · Atlanta",
      headline: "Atlanta's Only 15‑Hour Nightclub",
      heroBody:
        "Entertainment, kitchen, bar, and hookah — from day into late night. Watch the stage live, see who's on, and lock in your VIP section before you pull up.",
      primaryCta: { label: "Reserve VIP", href: "/reserve" },
      livePreview: true,
      visitBlock: true,
      reserveBanner: {
        eyebrow: "VIP at Vivide",
        title: "Your Section. Your Night.",
        body: "Pick a section, add a package, choose your arrival time. Demo flow — no reservation is made and no payment is taken.",
      },
      modules: [
        { href: "/girls", title: "Entertainers", blurb: "Who's on tonight, featured entertainers, and full profiles.", hue: 42 },
        { href: "/live", title: "Digital Stage", blurb: "The main stage, streamed with a managed rotation.", hue: 268, feature: "liveStream" },
        { href: "/reserve", title: "VIP Sections", blurb: "Sections, packages, and arrival times in a few taps.", hue: 45 },
        { href: "/events", title: "Weekly Nights", blurb: "Dinero Lunes through Vivide on Saturday.", hue: 38 },
        { href: "/kitchen", title: "Kitchen, Bar & Hookah", blurb: "Order to your table.", hue: 20, feature: "kitchen" },
        { href: "/jobs", title: "Now Hiring", blurb: "Entertainers, VIP hosts, bar, kitchen, and security.", hue: 220, feature: "jobs" },
      ],
    },
    pages: {
      kitchen: {
        eyebrow: "Kitchen · Bar · Hookah",
        title: "Kitchen, Bar & Hookah",
        description: "Order food, drinks, and hookah to your table. Sample menu and prices for this demo — the real menu would be loaded by the club.",
      },
      events: {
        eyebrow: "Every night has a name",
        title: "Weekly Nights & Events",
        description: "Night names as promoted on @vivideatlanta. Dates, times, and prices are samples — details to be confirmed by the club.",
      },
    },
    features: {
      liveStream: true,
      webcams: false,
      messaging: false,
      kitchen: true,
      merch: false,
      parking: false,
      jobs: true,
      bookings: true,
      adminPreview: true,
    },
    instagram: { handle: "vivideatlanta", url: "https://www.instagram.com/vivideatlanta/" },
    vip: {
      phone: "(470) 900-6040",
      promoter: "@VR1_PROMOTION",
      promoterUrl: "https://www.instagram.com/vr1_promotion/",
      note: "VIP sections are booked by phone today, per the club's flyers.",
    },
    highlights: [
      { title: "Kitchen", blurb: "Food served all day and into the night.", hue: 30, href: "/kitchen" },
      { title: "Party", blurb: "Themed nights, hosted events, celebrations.", hue: 268, href: "/events" },
      { title: "Bar", blurb: "Full bar and bottle service.", hue: 45, href: "/kitchen" },
      { title: "Hookah", blurb: "Hookah to your table or section.", hue: 210, href: "/kitchen" },
    ],
    digitalStage: {
      // Age policy not confirmed; 21+ is the conservative default for the demo
      // (the club's Instagram is itself 21+ restricted).
      ageRestriction: 21,
      visitNote: `Valid ID required. Cover, dress code, and age policy: ${CONFIRM}.`,
      demo: { openingOrder: ["onyxia", "amethyst", "dinero"], noConsentId: "nova-rae", startLive: true },
    },
    eventsBooking: {
      description:
        "Birthdays, celebrations, and private events at Vivide. Demo request form — nothing is sent to the club.",
    },
    demo: {
      ribbon: true,
      ribbonText: "Unofficial concept demo — not affiliated with or endorsed by Vivide Atlanta.",
      ribbonTextShort: "Unofficial demo · Not affiliated",
      footerNote:
        "Unofficial concept demo — not affiliated with or endorsed by Vivide Atlanta. Performers, events, prices and menus are fictional samples. No bookings or payments are processed.",
      fictionalPerformers: true,
      sampleContent: true,
      transactionNote: "Demo only — no reservation was made and no payment was processed.",
    },
  },
  content: {
    entertainers,
    events,
    weeklySpecials,
    menuCategories,
    menuItems,
    products: [],
    jobRoles,
    tableOptions,
    reservationPackages,
    arrivalTimes,
    // Private webcams and paid messaging are off for this club.
    liveRooms: [],
    mockDancerId: "onyxia",
    conversations: [],
    seedMessages: [],
    messaging: {
      messageCost: 5,
      tipAmounts: [10, 25, 50],
      startingCredits: 0,
      creditPackages: [],
    },
  },
} satisfies ClubDefinition;

export default vivide as ClubDefinition;
