import type { ClubDefinition, NetworkDemoData } from "../types";
import { locations } from "./content/locations";
import { entertainers } from "./content/entertainers";
import { events, weeklySpecials } from "./content/events";

/**
 * Pandora's Clubs (DFW): INDEPENDENT WEBSITE CONCEPT. Not an official
 * Pandora's Clubs website, and not affiliated with or endorsed by Pandora's.
 *
 * A multi-location ("network") build: one site for all seven brands, with
 * /clubs/[slug] pages and a multi-location /admin-demo dashboard. Sources and
 * verification levels for each club are documented in content/locations.ts.
 */

const network: NetworkDemoData = {
  seedInquiries: [
    { id: "VIP-DEMO1", club: "pandoras-euless", name: "Demo Guest (Birthday)", date: "2026-11-21", partySize: "9–12 guests", requests: "Birthday section, demo request.", status: "new", receivedAt: "2026-11-08T22:14:00Z" },
    { id: "VIP-DEMO2", club: "platinum-dallas", name: "Demo Guest (Corporate)", date: "2026-11-27", partySize: "5–8 guests", status: "contacted", receivedAt: "2026-11-08T19:02:00Z" },
    { id: "VIP-DEMO3", club: "pandoras-south", name: "Demo Guest (Bachelor)", date: "2026-11-15", partySize: "13–20 guests", requests: "Bachelor party, demo request.", status: "confirmed", receivedAt: "2026-11-07T23:40:00Z" },
    { id: "VIP-DEMO4", club: "roxys-showgirls", name: "Demo Guest", date: "2026-11-14", partySize: "2–4 guests", status: "new", receivedAt: "2026-11-07T17:25:00Z" },
    { id: "VIP-DEMO5", club: "pandoras-dallas", name: "Demo Guest (Game day)", date: "2026-11-22", partySize: "5–8 guests", status: "declined", receivedAt: "2026-11-06T21:10:00Z" },
  ],
  analytics: {
    visitors30d: 48210,
    visitorsTrend: [980, 1120, 1040, 1310, 1580, 2240, 2610, 1190, 1060, 1150, 1420, 1720, 2390, 2780],
    viewsByClub: {
      "pandoras-euless": 11840,
      "pandoras-south": 9620,
      "platinum-dallas": 8310,
      "pandoras-dallas": 7150,
      "roxys-showgirls": 5480,
      "dallas-cabaret": 3290,
      "pandoras-lakeside": 2520,
    },
    eventEngagement: [
      { label: "After-hours parties", value: 4120 },
      { label: "Themed parties", value: 2870 },
      { label: "Game days", value: 1640 },
      { label: "Happy hour", value: 1310 },
    ],
  },
};

const pandoras = {
  venue: {
    slug: "pandoras-dfw",
    name: "Pandora's Clubs",
    shortName: "Pandora's",
    tagline: "Seven Destinations. One Unforgettable Experience.",
    city: "Dallas–Fort Worth",
    description:
      "Discover premier nightlife experiences across Dallas–Fort Worth. Seven clubs, one network. Find a club, see what's on, and request the VIP experience.",
    address: "Seven locations across Dallas–Fort Worth",
    phone: "",
    hours: [],
    hoursNote: "Hours vary by club. See each club's page.",
    socialLinks: [
      { label: "Pandora's Euless · Instagram", href: "https://www.instagram.com/pandoras_euless/" },
      { label: "Pandora's South · Instagram", href: "https://www.instagram.com/pandoras_south/" },
    ],
    colors: {
      ink: "#080808",
      ink2: "#151515",
      ink3: "#1f1f1f",
      bone: "#f5f3ee",
      muted: "#a3a3a8",
      gold: "#d4af37",
      goldBright: "#f1dc97",
      goldDeep: "#8a6b1f",
      blood: "#9b111e",
      accent2: "#9b111e",
    },
    theme: {
      style: "luxe",
      fonts: "luxe",
      wordmark: "Pandora's",
      wordmarkSub: "Clubs · DFW",
      heroHue: 45,
    },
    labels: { performers: "Entertainers", performersShort: "Talent" },
    nav: { mobile: ["home", "events", "reserve", "live", "performers"], style: "overlay" },
    home: {
      layout: "network",
      eyebrow: "Dallas–Fort Worth",
      headline: "PANDORA'S CLUBS",
      heroBody: "Discover premier nightlife experiences across Dallas–Fort Worth.",
      primaryCta: { label: "Explore Our Clubs", href: "#clubs" },
      livePreview: true,
      reserveBanner: {
        eyebrow: "VIP",
        title: "VIP Experiences",
        body: "Demo flow. No reservation is made and nothing is sent.",
      },
      modules: [],
    },
    pages: {
      events: {
        eyebrow: "Across all seven clubs",
        title: "Events & Promotions",
        description: "Weekly promotions published by the clubs, plus clearly labelled demo events. Filter by club.",
      },
    },
    features: {
      liveStream: true,
      webcams: false,
      messaging: false,
      kitchen: false,
      merch: false,
      parking: false,
      jobs: false,
      bookings: false,
      adminPreview: false,
      network: true,
    },
    locations,
    seo: {
      ogImage: "/clubs/pandoras-dfw/hero.webp",
      keywords: ["Pandora's Clubs", "Dallas nightlife", "Fort Worth nightlife", "Euless", "VIP Dallas"],
      noindex: true,
    },
    digitalStage: {
      ageRestriction: 21,
      visitNote: "Proposed feature. Pandora's does not currently offer livestreaming.",
      demo: { openingOrder: ["aurelia", "scarlett", "onyx"], noConsentId: "sienna", startLive: true },
    },
    eventsBooking: {
      description: "Demo request form. Nothing is sent to the clubs.",
    },
    demo: {
      ribbon: true,
      ribbonText: "Independent Website Concept — Not an Official Pandora's Clubs Website",
      ribbonTextShort: "Independent concept · Not official",
      footerNote:
        "Independent website concept — not an official Pandora's Clubs website and not affiliated with or endorsed by Pandora's Clubs. Details marked \"confirm with management\" come from public listings. Entertainers, demo events, live streams, and analytics are placeholders. No reservations or payments are processed. Photos: Unsplash.",
      fictionalPerformers: true,
      sampleContent: true,
      hidePrices: true,
      transactionNote: "Demo only. No reservation was made and nothing was sent.",
    },
  },
  content: {
    entertainers,
    events,
    weeklySpecials,
    menuCategories: [],
    menuItems: [],
    products: [],
    jobRoles: [],
    tableOptions: [
      { id: "main-floor", name: "VIP Main Floor Table", description: "As listed on the clubs' VIP packages pages.", minimumSpend: 0, seats: 6 },
      { id: "party-table", name: "VIP Party Table Package", description: "As listed on the clubs' VIP packages pages.", minimumSpend: 0, seats: 10 },
    ],
    reservationPackages: [{ id: "none", name: "Discuss with your host", description: "Packages and pricing confirmed by the club.", price: 0 }],
    arrivalTimes: ["TBA — confirmed by your host"],
    liveRooms: [],
    mockDancerId: "aurelia",
    conversations: [],
    seedMessages: [],
    messaging: { messageCost: 0, tipAmounts: [], startingCredits: 0, creditPackages: [] },
    network,
  },
} satisfies ClubDefinition;

export default pandoras as ClubDefinition;
