import type { ClubDefinition } from "../types";
import { entertainers } from "./content/entertainers";
import { events, weeklySpecials } from "./content/events";
import { arrivalTimes, reservationPackages, tableOptions } from "./content/reserve";

/**
 * Pinkhouse Memphis: INDEPENDENT WEBSITE CONCEPT. Not an official Pinkhouse
 * website, and not affiliated with or endorsed by Pinkhouse.
 *
 * Confirmed from public Instagram profiles (viewed 2026-11-09):
 *   - @pinkhouse_memphis bio: "Houston's #1 afterhours is coming to
 *     Memphis!" and "Pinkhouse Memphis coming soon". The logo is a pink
 *     script "Pinkhouse" over "MEMPHIS" on black.
 *   - @pinkhouse_htown: the profile name is "6333 Richmond ave" (the
 *     Houston location).
 *   - @js_mgmnt: booking/management, and lists @pinkhouse_memphis as
 *     "coming soon".
 *
 * NOT confirmed, and never shown as fact: Memphis address, opening date,
 * hours, phone, email, prices, events, entertainers, or livestreaming.
 * Everything in content/ is placeholder or demo material, and the UI
 * badges it that way.
 */
const pinkhouse = {
  venue: {
    slug: "pinkhouse-memphis",
    name: "Pinkhouse Memphis",
    shortName: "Pinkhouse",
    tagline: "Houston's #1 Afterhours — Coming to Memphis",
    city: "Memphis, Tennessee",
    description:
      "Houston's #1 afterhours is coming to Memphis. Premium nightlife, VIP experiences, and late nights done the Pinkhouse way. Coming soon.",
    address: "Memphis, TN · Location to be announced",
    phone: "",
    hours: [],
    hoursNote: "Opening date and hours to be announced.",
    socialLinks: [
      { label: "@pinkhouse_memphis", href: "https://www.instagram.com/pinkhouse_memphis/" },
      { label: "@pinkhouse_htown", href: "https://www.instagram.com/pinkhouse_htown/" },
      { label: "@js_mgmnt", href: "https://www.instagram.com/js_mgmnt/" },
    ],
    colors: {
      ink: "#080808",
      ink2: "#111012",
      ink3: "#1c1a1e",
      bone: "#f7f1f4",
      muted: "#a29aa0",
      // hot pink primary, neon pink highlight
      gold: "#ff1493",
      goldBright: "#ff69b4",
      goldDeep: "#b0005f",
      blood: "#ff2d55",
      // metallic silver
      accent2: "#c9c9d1",
    },
    theme: {
      style: "pinkhouse",
      fonts: "pinkhouse",
      wordmark: "Pinkhouse",
      heroHue: 330,
    },
    labels: { performers: "Entertainers", performersShort: "Talent" },
    nav: { mobile: ["home", "performers", "live", "reserve", "events"], style: "overlay" },
    home: {
      layout: "pinkhouse",
      eyebrow: "Memphis, Tennessee · Coming Soon",
      headline: "PINKHOUSE MEMPHIS",
      heroBody: "Something unforgettable is coming to Memphis.",
      primaryCta: { label: "Explore the Experience", href: "#experience" },
      livePreview: true,
      reserveBanner: {
        eyebrow: "VIP",
        title: "Request the VIP Experience",
        body: "Demo flow. No reservation is made and nothing is sent.",
      },
      modules: [],
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
      adminPreview: true,
    },
    instagram: { handle: "pinkhouse_memphis", url: "https://www.instagram.com/pinkhouse_memphis/" },
    locations: [
      {
        slug: "memphis",
        name: "Pinkhouse Memphis",
        city: "Memphis, TN",
        status: "coming-soon",
        statusLabel: "Coming Soon",
        instagram: { handle: "pinkhouse_memphis", url: "https://www.instagram.com/pinkhouse_memphis/" },
        image: "/clubs/pinkhouse-memphis/memphis.webp",
        primary: true,
      },
      {
        slug: "houston",
        name: "Pinkhouse Houston",
        city: "Houston, TX",
        status: "open",
        statusLabel: "Established Location",
        address: "6333 Richmond Ave",
        instagram: { handle: "pinkhouse_htown", url: "https://www.instagram.com/pinkhouse_htown/" },
        image: "/clubs/pinkhouse-memphis/houston.webp",
      },
    ],
    seo: {
      ogImage: "/clubs/pinkhouse-memphis/hero.webp",
      keywords: ["Pinkhouse Memphis", "Memphis nightlife", "Memphis afterhours", "VIP Memphis", "Pinkhouse Houston"],
      noindex: true,
    },
    digitalStage: {
      ageRestriction: 21,
      visitNote: "Demonstration only. Pinkhouse does not currently offer livestreaming.",
      demo: { openingOrder: ["rose", "velvet", "nova"], noConsentId: "bella", startLive: true },
    },
    eventsBooking: {
      description: "Demo request form. Nothing is sent to the venue.",
    },
    demo: {
      ribbon: true,
      ribbonText: "Independent Website Concept — Not an Official Pinkhouse Website",
      ribbonTextShort: "Independent concept · Not official",
      footerNote:
        "Independent website concept — not an official Pinkhouse website and not affiliated with or endorsed by Pinkhouse. Entertainers, events, and the live stream are placeholders. No reservations or payments are processed. Photos: Unsplash.",
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
    tableOptions,
    reservationPackages,
    arrivalTimes,
    liveRooms: [],
    mockDancerId: "rose",
    conversations: [],
    seedMessages: [],
    messaging: {
      messageCost: 0,
      tipAmounts: [],
      startingCredits: 0,
      creditPackages: [],
    },
  },
} satisfies ClubDefinition;

export default pinkhouse as ClubDefinition;
