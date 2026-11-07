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
 * ONYX: the reference template club (fictional). This is the default tenant
 * when NEXT_PUBLIC_CLUB is unset.
 */
const onyx = {
  venue: {
    slug: "onyx",
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
      accent2: "#8a6d2f",
    },
    theme: {
      style: "classic",
      fonts: "classic",
      wordmark: "ONYX",
      heroHue: 40,
    },
    labels: { performers: "The Girls", performersShort: "Girls" },
    nav: { mobile: ["home", "performers", "live", "messages", "account"] },
    home: {
      eyebrow: "Tonight at the club · Atlanta",
      livePreview: false,
      reserveBanner: {
        eyebrow: "The best seat in the house",
        title: "Reserve Your Table Tonight",
        body: "Stage-side sections, bottle packages, and a host who knows your name. Walk past the line every time.",
      },
      modules: [
        { href: "/girls", title: "Meet the Girls", blurb: "The full roster — see who's working tonight.", hue: 330 },
        { href: "/live", title: "Watch Live", blurb: "The main stage stream, live from the floor.", hue: 350, feature: "liveStream" },
        { href: "/webcams", title: "Webcams", blurb: "Your favorite entertainers, streaming live.", hue: 270, feature: "webcams" },
        { href: "/messages", title: "Messages", blurb: "Talk directly with your favorite entertainers.", hue: 210, feature: "messaging" },
        { href: "/reserve", title: "Reserve a Table", blurb: "VIP sections, bottle packages, stage-side seats.", hue: 42 },
        { href: "/events", title: "Events & Parking", blurb: "Tickets, guest DJs, and pre-paid parking.", hue: 190 },
        { href: "/kitchen", title: "The Kitchen", blurb: "Lemon pepper wet until 2:30AM. Enough said.", hue: 25, feature: "kitchen" },
        { href: "/jobs", title: "Join the Team", blurb: "Entertainers, bar, floor, kitchen, security.", hue: 150, feature: "jobs" },
        { href: "/shop", title: "Shop Merch", blurb: "Wear the crest. Tees, hats, and hoodies.", hue: 45, feature: "merch" },
      ],
    },
    features: {
      // Digital Stage lives at /live; the flag gates the nav link and home card.
      liveStream: true,
      webcams: true,
      messaging: true,
      kitchen: true,
      merch: true,
      parking: true,
      jobs: true,
      bookings: true,
    },
    digitalStage: {
      ageRestriction: 21,
      visitNote: "Valet on Peachtree. Dress code enforced. VIP tables include priority entry.",
      demo: { openingOrder: ["goldie", "sapphire"], noConsentId: "raven" },
    },
    eventsBooking: {
      description:
        "Book your next event at ONYX. World-class entertainers, VIP tables, and a full kitchen for an unforgettable experience.",
    },
    demo: {
      ribbon: false,
      ribbonText: "",
      footerNote: "21+ · Valid ID required · Demo template — all people and content are fictional",
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

export default onyx as ClubDefinition;
