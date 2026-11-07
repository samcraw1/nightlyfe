import type { ClubDefinition } from "../types";
import { entertainers } from "./content/entertainers";
import { events, weeklySpecials } from "./content/events";
import { menuCategories, menuItems } from "./content/menu";
import { products } from "./content/shop";
import { jobRoles } from "./content/jobs";
import { arrivalTimes, reservationPackages, tableOptions } from "./content/reserve";

/**
 * Pin Ups (Atlanta) — UNOFFICIAL CONCEPT DEMO.
 *
 * Facts below come from the club's public site (atlpinups.com) and its own
 * promo video: the name, "Home of $5 Dances", the Dayshift / Saturday /
 * New Sundays / Hiring sections, hookah and food, "© 1991", the map pin on
 * East Ponce de Leon Ave near Decatur, and the Facebook/Instagram handles.
 *
 * Anything not confirmed there is a clearly-labelled placeholder ("confirm
 * with management"). Performers, events, prices, and menus are fictional
 * samples and are badged as such in the UI.
 */
const CONFIRM = "Confirm with management";

const pinups = {
  venue: {
    slug: "pinups-atl",
    name: "Pin Ups",
    shortName: "Pin Ups",
    tagline: "Adult Entertainment · Atlanta",
    city: "Decatur · Atlanta",
    established: "Since 1991",
    description:
      "Atlanta's home of $5 dances. Dayshift, Saturday nights, and New Sundays on East Ponce — with a live Digital Stage and VIP booking right from your phone.",
    address: `East Ponce de Leon Ave · Decatur, GA — street number: ${CONFIRM.toLowerCase()}`,
    phone: `Phone: ${CONFIRM.toLowerCase()}`,
    hours: [],
    hoursNote: `Dayshift and nightly hours — ${CONFIRM.toLowerCase()}`,
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/clubpinupsatl/" },
      { label: "Facebook", href: "https://www.facebook.com/clubpinups" },
    ],
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Pin+Ups+Strip+Club+Decatur+GA",
    colors: {
      ink: "#0b0610",
      ink2: "#150b1c",
      ink3: "#22122c",
      bone: "#fbeef6",
      muted: "#b39bb4",
      gold: "#ff2e93",
      goldBright: "#ff8cc6",
      goldDeep: "#a3125c",
      blood: "#ff2e5f",
      accent2: "#8f4bff",
    },
    theme: {
      style: "neon",
      fonts: "neon-pinup",
      wordmark: "Pin Ups",
      heroHue: 320,
    },
    labels: { performers: "Entertainers", performersShort: "Dancers", bookings: "Private Events" },
    nav: { mobile: ["home", "performers", "live", "reserve", "account"] },
    home: {
      eyebrow: "Decatur · Atlanta · Since 1991",
      headline: "Home of $5 Dances",
      heroBody:
        "Dayshift, Saturday nights, and New Sundays on East Ponce. Watch the Digital Stage live, then lock in your VIP section before you pull up.",
      primaryCta: { label: "Reserve VIP", href: "/reserve" },
      ticker: [
        "Home of $5 Dances",
        "Dayshift",
        "Saturday Nights",
        "New Sundays",
        "Hookah Lounge",
        "Food from the kitchen",
        "VIP sections",
        "Digital Stage · Live",
        "Now hiring",
      ],
      livePreview: true,
      visitBlock: true,
      reserveBanner: {
        eyebrow: "VIP at Pin Ups",
        title: "Your Section, Ready When You Arrive",
        body: "Pick a section, add a bottle package, and walk straight in. Demo flow — no reservation is made and no payment is taken.",
      },
      modules: [
        { href: "/girls", title: "Entertainers", blurb: "Who's working tonight, featured dancers, and full profiles.", hue: 325 },
        { href: "/live", title: "Digital Stage", blurb: "The main stage, streamed live with a managed rotation.", hue: 280, feature: "liveStream" },
        { href: "/reserve", title: "VIP & Tables", blurb: "Sections, bottle packages, and arrival times in a few taps.", hue: 335 },
        { href: "/kitchen", title: "Kitchen & Hookah", blurb: "Order food and hookah to your table.", hue: 20, feature: "kitchen" },
        { href: "/jobs", title: "Now Hiring", blurb: "Entertainers, bar, floor, kitchen, and security.", hue: 265, feature: "jobs" },
        { href: "/shop", title: "Merch", blurb: "Neon logo tees, hoodies, and hats.", hue: 315, feature: "merch" },
      ],
    },
    pages: {
      kitchen: {
        eyebrow: "Food & hookah",
        title: "Kitchen & Hookah",
        description: "Order food and hookah to your table. Sample menu and prices for this demo — the real menu would be loaded by the club.",
      },
      shop: {
        eyebrow: "Concept merch",
        title: "Shop",
        description: "A merch store concept for Pin Ups. Sample products; orders are pretend and nothing is charged.",
      },
      events: {
        eyebrow: "The calendar",
        title: "Weekly Lineup & Events",
        description: "Dayshift, Saturday nights, and New Sundays. Sample dates, times, and prices — details to be confirmed by the club.",
      },
    },
    features: {
      liveStream: true,
      webcams: false,
      messaging: false,
      kitchen: true,
      merch: true,
      parking: false,
      jobs: true,
      bookings: true,
    },
    digitalStage: {
      // Age policy not confirmed; 21+ is the conservative default for the demo.
      ageRestriction: 21,
      visitNote: `Valid ID required. Cover, dress code, and age policy: ${CONFIRM.toLowerCase()}.`,
      demo: { openingOrder: ["velvet", "roxy", "lola-neon"], noConsentId: "starla", startLive: true },
    },
    eventsBooking: {
      description:
        "Birthdays, bachelor parties, and private celebrations at Pin Ups. Demo request form — nothing is sent to the club.",
    },
    demo: {
      ribbon: true,
      ribbonText: "Unofficial concept demo · Not affiliated with Pin Ups · Sample content",
      ribbonTextShort: "Unofficial demo · Not affiliated",
      footerNote:
        "Unofficial concept demo — not affiliated with or endorsed by Pin Ups. Performers, events, prices and menus are fictional samples. No bookings or payments are processed.",
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
    products,
    jobRoles,
    tableOptions,
    reservationPackages,
    arrivalTimes,
    // Private webcams and paid messaging are off for this club.
    liveRooms: [],
    mockDancerId: "velvet",
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

export default pinups as ClubDefinition;
