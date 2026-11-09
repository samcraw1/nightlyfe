import type { ClubDefinition } from "../types";
import type { ClubEvent } from "@/types";
import { bookingOptions, experiences } from "./content/experiences";
import { events as playhouseEvents } from "./content/events";
import { gallery } from "./content/gallery";
import { production, vip } from "./content/production";
import { analytics, seedBookings } from "./content/dashboard";
import { arrivalTimes, reservationPackages, tableOptions } from "./content/reserve";
import { APRIL_POST, PROMOTER_INSTAGRAM, PROMOTER_THREADS } from "./content/sources";

/**
 * Bibs Playhouse (Little Rock, AR): INDEPENDENT WEBSITE CONCEPT. Not an
 * official Bibs Playhouse website, and not affiliated with or endorsed by
 * Bibs Playhouse or its promoters.
 *
 * Public facts (all from promoter Mike DaPromoter's public Threads posts,
 * viewed 2026-11-09; no venue website or venue social account was found):
 *   - Address: 8702 Hwy 365 S, Little Rock, AR 72206
 *   - "Bibs Playhouse", Apr 25 2026, 10 PM–4 AM, BYOB
 *   - "Scorpios After Dark", Sat Nov 7 2026, 10 PM–3 AM, "only at Bibs"
 *   - Promoted amenities: BYOB, live dancers, kitchen menu, sections
 *
 * PLACEHOLDERS (same convention as the ONYX template, fictional 555 number
 * and example.com email, labelled "Placeholder" in the UI): phone, email,
 * hours. Replace with the venue's real details once confirmed.
 *
 * NOT confirmed, and never shown as fact: private
 * events, music video / photoshoot production, venue rental, VIP packages,
 * prices. The UI labels those "Proposed offering" or "To be confirmed".
 */
const bibs = {
  venue: {
    slug: "bibs-playhouse",
    name: "Bibs Playhouse",
    shortName: "Bibs",
    tagline: "Where Entertainment Comes Alive",
    city: "Little Rock, Arkansas",
    description:
      "An elevated experience in nightlife, entertainment, and unforgettable moments. Little Rock, Arkansas.",
    address: "8702 Hwy 365 S, Little Rock, AR 72206",
    // Placeholders (fictional 555 number, example.com email): confirm with management.
    phone: "(501) 555-0142",
    email: "bookings@example.com",
    hours: [
      { days: "Thu", open: "9PM", close: "2AM" },
      { days: "Fri – Sat", open: "10PM", close: "4AM" },
      { days: "Sun", open: "8PM", close: "2AM" },
    ],
    hoursNote: "",
    socialLinks: [
      { label: "Threads · @mike_da_promoter", href: PROMOTER_THREADS },
      { label: "Instagram · @mike_da_promoter", href: PROMOTER_INSTAGRAM },
    ],
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=8702+Hwy+365+S+Little+Rock+AR+72206",
    colors: {
      ink: "#080808",
      ink2: "#171717",
      ink3: "#211d26",
      bone: "#f5f3f8",
      muted: "#a7a2b0",
      // metallic gold primary (buttons, rules), royal purple secondary (light)
      gold: "#d4af37",
      goldBright: "#f1d77a",
      goldDeep: "#8c6d1c",
      blood: "#e0245e",
      accent2: "#6a0dad",
    },
    theme: {
      style: "playhouse",
      fonts: "playhouse",
      wordmark: "Bibs",
      wordmarkSub: "Playhouse",
      heroHue: 275,
    },
    labels: { performers: "Entertainment", performersShort: "Talent", bookings: "Bookings" },
    nav: {
      mobile: [],
      style: "overlay",
      links: [
        { href: "/#experience", label: "Experience" },
        { href: "/#production", label: "Production" },
        { href: "/#events", label: "Events" },
        { href: "/#vip", label: "VIP" },
        { href: "/#gallery", label: "Gallery" },
        { href: "/#contact", label: "Contact" },
      ],
      cta: { label: "Book", href: "/#book" },
    },
    home: {
      layout: "playhouse",
      eyebrow: "Little Rock, Arkansas",
      headline: "BIBS PLAYHOUSE",
      heroBody: "An elevated experience in nightlife, entertainment, and unforgettable moments.",
      primaryCta: { label: "Explore the Experience", href: "#experience" },
      livePreview: false,
      reserveBanner: {
        eyebrow: "Bookings",
        title: "Booking Inquiries",
        body: "Demo flow. No booking is made and nothing is sent.",
      },
      modules: [],
    },
    features: {
      liveStream: false,
      webcams: false,
      messaging: false,
      kitchen: false,
      merch: false,
      parking: false,
      jobs: false,
      bookings: false,
      venueDashboard: true,
    },
    instagram: { handle: "mike_da_promoter", url: PROMOTER_INSTAGRAM },
    seo: {
      ogImage: "/clubs/bibs-playhouse/og.jpg",
      keywords: ["Bibs Playhouse", "Little Rock nightlife", "Little Rock event venue", "music video location Little Rock", "photoshoot venue Arkansas"],
      noindex: true,
    },
    digitalStage: {
      ageRestriction: 21,
      visitNote: "Demonstration only. Bibs Playhouse does not currently offer livestreaming.",
    },
    eventsBooking: {
      description: "Demo request form. Nothing is sent to the venue.",
    },
    demo: {
      ribbon: true,
      ribbonText: "Independent Website Concept — Not an Official Bibs Playhouse Website",
      ribbonTextShort: "Independent concept · Not official",
      footerNote:
        "Independent website concept — not an official Bibs Playhouse website and not affiliated with or endorsed by Bibs Playhouse. The address is from public promoter posts; phone, email and hours are placeholders; services marked “Proposed” are concepts. Sample events and dashboard data are fictional. No bookings or payments are processed. Photos: Unsplash stand-ins.",
      fictionalPerformers: true,
      sampleContent: true,
      hidePrices: true,
      transactionNote: "Demo only. No booking was made and nothing was sent.",
    },
  },
  content: {
    entertainers: [],
    // Generic /events page: the venue's events in the shared shape.
    events: playhouseEvents
      .filter((e) => e.date)
      .map(
        (e): ClubEvent => ({
          id: e.id,
          title: e.title,
          date: e.date!,
          doors: e.time,
          description: e.description,
          source: e.source === "verified" ? "verified" : "demo",
          gaPrice: 0,
          vipFromPrice: 0,
          parkingPrice: 0,
          featured: !!e.featured,
          hue: 275,
        }),
      ),
    weeklySpecials: [],
    menuCategories: [],
    menuItems: [],
    products: [],
    jobRoles: [],
    tableOptions,
    reservationPackages,
    arrivalTimes,
    liveRooms: [],
    mockDancerId: "",
    conversations: [],
    seedMessages: [],
    messaging: { messageCost: 0, tipAmounts: [], startingCredits: 0, creditPackages: [] },
    playhouse: {
      facts: {
        addressSourceLabel: "Address as posted by promoter @mike_da_promoter",
        addressSourceUrl: APRIL_POST,
        amenities: ["BYOB", "Live dancers", "Kitchen menu", "Sections available"],
        mapsQuery: "8702 Hwy 365 S, Little Rock, AR 72206",
      },
      experiences,
      bookingOptions,
      production,
      events: playhouseEvents,
      vip,
      gallery,
      dashboard: { seedBookings, analytics },
    },
  },
} satisfies ClubDefinition;

export default bibs as ClubDefinition;
