import type { ClubDefinition } from "../types";
import { entertainers } from "./content/entertainers";
import { events } from "./content/events";
import { menuCategories, menuItems } from "./content/menu";
import { products } from "./content/shop";
import { jobRoles } from "./content/jobs";
import { arrivalTimes, reservationPackages, tableOptions } from "./content/reserve";
import { liveRooms } from "./content/liveRooms";
import {
  conversations,
  creditPackages,
  MESSAGE_COST,
  seedMessages,
  STARTING_CREDITS,
  TIP_AMOUNTS,
} from "./content/messages";

/**
 * Bibs Playhouse (Little Rock, AR): INDEPENDENT WEBSITE CONCEPT. Not an
 * official Bibs Playhouse website, and not affiliated with or endorsed by
 * Bibs Playhouse or its promoters.
 *
 * A copy of the ONYX reference template (src/clubs/onyx) with Bibs branding.
 * Entertainers, menu, merch, jobs, events, prices, phone and hours are the
 * template's fictional placeholders. The address and social links come from
 * promoter Mike DaPromoter's public posts (viewed 2026-11-09).
 */
const bibs = {
  venue: {
    slug: "bibs-playhouse",
    name: "Bibs Playhouse",
    shortName: "Bibs",
    tagline: "Little Rock After Dark",
    city: "Little Rock",
    description:
      "Little Rock's premier late-night destination. World-class entertainers, VIP tables, a full kitchen, and the city's best sound — every night until 3AM.",
    address: "8702 Hwy 365 S, Little Rock, AR 72206",
    phone: "(501) 555-0142",
    hours: [
      { days: "Mon – Thu", open: "8PM", close: "3AM" },
      { days: "Fri – Sat", open: "7PM", close: "4AM" },
      { days: "Sun", open: "9PM", close: "2AM" },
    ],
    socialLinks: [
      { label: "Threads", href: "https://www.threads.com/@mike_da_promoter" },
      { label: "Instagram", href: "https://www.instagram.com/mike_da_promoter/" },
    ],
    colors: {
      ink: "#080808",
      ink2: "#171717",
      ink3: "#211d26",
      bone: "#f5f3f8",
      muted: "#a7a2b0",
      gold: "#d4af37",
      goldBright: "#f1d77a",
      goldDeep: "#8c6d1c",
      blood: "#c11430",
      accent2: "#6a0dad",
    },
    theme: {
      style: "classic",
      fonts: "classic",
      wordmark: "BIBS",
      heroHue: 275,
    },
    labels: { performers: "The Girls", performersShort: "Girls" },
    nav: { mobile: ["home", "performers", "live", "messages", "account"] },
    home: {
      eyebrow: "Tonight at the club · Little Rock",
      livePreview: false,
      reserveBanner: {
        eyebrow: "The best seat in the house",
        title: "Reserve Your Table Tonight",
        body: "Stage-side sections, bottle packages, and a host who knows your name. Walk past the line every time.",
      },
      modules: [
        { href: "/girls", title: "Meet the Girls", blurb: "The full roster — see who's working tonight.", hue: 300 },
        { href: "/live", title: "Watch Live", blurb: "The main stage stream, live from the floor.", hue: 285, feature: "liveStream" },
        { href: "/webcams", title: "Webcams", blurb: "Your favorite entertainers, streaming live.", hue: 270, feature: "webcams" },
        { href: "/messages", title: "Messages", blurb: "Talk directly with your favorite entertainers.", hue: 255, feature: "messaging" },
        { href: "/reserve", title: "Reserve a Table", blurb: "VIP sections, bottle packages, stage-side seats.", hue: 45 },
        { href: "/events", title: "Events & Parking", blurb: "Tickets, guest DJs, and pre-paid parking.", hue: 280 },
        { href: "/kitchen", title: "The Kitchen", blurb: "Lemon pepper wet until 2:30AM. Enough said.", hue: 30, feature: "kitchen" },
        { href: "/jobs", title: "Join the Team", blurb: "Entertainers, bar, floor, kitchen, security.", hue: 265, feature: "jobs" },
        { href: "/shop", title: "Shop Merch", blurb: "Wear the crest. Tees, hats, and hoodies.", hue: 45, feature: "merch" },
      ],
    },
    features: {
      liveStream: true,
      webcams: true,
      messaging: true,
      kitchen: true,
      merch: true,
      parking: true,
      jobs: true,
      bookings: true,
    },
    seo: {
      ogImage: "/clubs/bibs-playhouse/og.jpg",
      keywords: ["Bibs Playhouse", "Little Rock nightlife", "Little Rock club"],
      noindex: true,
    },
    digitalStage: {
      ageRestriction: 21,
      visitNote: "Parking on site off Hwy 365. Dress code enforced. VIP tables include priority entry.",
      demo: { openingOrder: ["goldie", "sapphire"], noConsentId: "raven" },
    },
    eventsBooking: {
      description:
        "Book your next event at Bibs Playhouse. World-class entertainers, VIP tables, and a full kitchen for an unforgettable experience.",
    },
    demo: {
      ribbon: true,
      ribbonText: "Independent Website Concept — Not an Official Bibs Playhouse Website",
      ribbonTextShort: "Independent concept · Not official",
      footerNote:
        "21+ · Valid ID required · Independent concept, not affiliated with Bibs Playhouse. All people, prices and content are fictional placeholders.",
      fictionalPerformers: false,
      sampleContent: false,
    },
  },
  content: {
    entertainers,
    events,
    weeklySpecials: [],
    menuCategories,
    menuItems,
    products,
    jobRoles,
    tableOptions,
    reservationPackages,
    arrivalTimes,
    liveRooms,
    mockDancerId: "sapphire",
    conversations,
    seedMessages,
    messaging: {
      messageCost: MESSAGE_COST,
      tipAmounts: TIP_AMOUNTS,
      startingCredits: STARTING_CREDITS,
      creditPackages,
    },
  },
} satisfies ClubDefinition;

export default bibs as ClubDefinition;
