import type { ClubLocation } from "@/clubs/types";

/*
 * The seven Pandora's Clubs brands, as linked under "Our Brands" on the
 * official sites (pandorasfortworth.com, pandorassouth.com), viewed
 * 2026-11-09.
 *
 * verification:
 *   "official"    – details read from the club's own website.
 *   "listing"     – address from public directory listings only; the UI
 *                   tags it "Confirm with management".
 *   "unconfirmed" – the club's site could not be read here and no reliable
 *                   listing was found; placeholders only.
 *
 * Descriptions are written for this concept. Facts in them come only from
 * the official sites: six stages, open every day including holidays,
 * after-hours Fri/Sat until 4am, happy hour, monthly themed parties, special
 * guest appearances, and celebrations. Nothing else (prices, dress codes,
 * policies) is stated.
 */

const R = "/clubs/pandoras-dfw";

const TBC = "Hours to be confirmed with management.";

export const locations: ClubLocation[] = [
  {
    slug: "platinum-dallas",
    name: "The Platinum Club Dallas",
    city: "Dallas, TX",
    status: "open",
    statusLabel: "Dallas",
    tagline: "Polished. Private. Platinum.",
    summary: "The network's Dallas address for an elevated night: refined rooms, attentive VIP hosting, and a crowd that dresses for it.",
    description: [
      "The Platinum Club Dallas is the most polished room in the Pandora's network: quieter lighting, closer tables, and a night built around hospitality.",
      "Details for this location are shown from public listings and would be confirmed with management before launch.",
    ],
    accent: "#c9ccd3",
    address: "2444 Walnut Ridge St, Dallas, TX",
    mapsQuery: "2444 Walnut Ridge St, Dallas, TX",
    hours: [],
    hoursNote: TBC,
    amenities: ["VIP tables & sections", "Celebrations & private parties", "Full entertainment line-up"],
    image: `${R}/platinum.webp`,
    gallery: [`${R}/platinum.webp`, `${R}/champagne.webp`, `${R}/chandelier.webp`],
    verification: "listing",
    sourceUrl: "https://www.atly.com/location/ThePlatinumClub",
    website: "https://www.pandorasplatinum.com/",
  },
  {
    slug: "pandoras-dallas",
    name: "Pandora's Dallas",
    city: "Dallas, TX",
    status: "open",
    statusLabel: "Dallas",
    tagline: "The original Dallas Pandora's.",
    summary: "Pandora's on Harry Hines: the Dallas sister club to Euless and South Fort Worth.",
    description: [
      "Pandora's Dallas is the Dallas sister club named on the Euless and South Fort Worth websites.",
      "Current details for this location, including hours, would be confirmed with management before anything is published.",
    ],
    accent: "#d4af37",
    address: "10649 Harry Hines Blvd, Dallas, TX 75220",
    mapsQuery: "10649 Harry Hines Blvd, Dallas, TX 75220",
    hours: [],
    hoursNote: TBC,
    amenities: ["VIP tables", "Celebrations & private parties"],
    image: `${R}/dallas.webp`,
    gallery: [`${R}/dallas.webp`, `${R}/crowd.webp`, `${R}/bokeh.webp`],
    verification: "listing",
    sourceUrl: "https://www.yelp.com/biz/pandoras-mens-club-dallas-dallas",
    website: "https://www.pandorasdallas.com/",
  },
  {
    slug: "dallas-cabaret",
    name: "Dallas Cabaret North",
    city: "Dallas, TX",
    status: "open",
    statusLabel: "Dallas",
    tagline: "Cabaret nights, north of downtown.",
    summary: "A cabaret-style room in the Pandora's family. Location details to be confirmed.",
    description: [
      "Dallas Cabaret North is one of the seven brands in the Pandora's Clubs family.",
      "Its address and hours couldn't be verified for this concept and are left as placeholders until management confirms them.",
    ],
    accent: "#9b111e",
    hours: [],
    hoursNote: "Address and hours to be confirmed with management.",
    amenities: ["VIP tables", "Celebrations & private parties"],
    image: `${R}/cabaret.webp`,
    gallery: [`${R}/cabaret.webp`, `${R}/bar.webp`, `${R}/dj.webp`],
    verification: "unconfirmed",
    website: "https://www.dallascabaretnorth.com/",
  },
  {
    slug: "roxys-showgirls",
    name: "Roxy's Showgirls",
    city: "Fort Worth, TX",
    status: "open",
    statusLabel: "Fort Worth",
    tagline: "Showgirls, spotlights, and a little old-school glamour.",
    summary: "Marquee-light energy in Fort Worth, part of the Pandora's family.",
    description: [
      "Roxy's Showgirls brings marquee-light showmanship to the Pandora's network in Fort Worth.",
      "Details are shown from public listings and would be confirmed with management before launch.",
    ],
    accent: "#e0475a",
    address: "1300 NE Loop 820, Fort Worth, TX",
    mapsQuery: "1300 NE Loop 820, Fort Worth, TX",
    hours: [],
    hoursNote: TBC,
    amenities: ["Stage shows", "VIP tables", "Celebrations & private parties"],
    image: `${R}/roxys.webp`,
    gallery: [`${R}/roxys.webp`, `${R}/confetti.webp`, `${R}/bokeh.webp`],
    verification: "listing",
    sourceUrl: "https://www.atly.com/location/TheRoxyShowgirls",
    website: "https://www.roxysshowgirls.com/",
  },
  {
    slug: "pandoras-euless",
    name: "Pandora's Fort Worth / Euless",
    city: "Euless, TX",
    status: "open",
    statusLabel: "Euless · Mid-Cities",
    tagline: "The party club of the Mid-Cities.",
    summary: "Six stages on the Tarrant County line, open every day of the year, with after-hours parties every Friday and Saturday until 4 AM.",
    description: [
      "Centrally located in Euless, right on the border of Tarrant County, Pandora's Fort Worth / Euless is the network's Mid-Cities party club.",
      "Six stages, a diverse line-up of entertainers, happy hour, and after-hours parties every Friday and Saturday night until 4 AM. It's open every day of the year, holidays included.",
      "Each month brings themed parties and special-guest appearances, and the club hosts birthdays, bachelor parties, game days, and private events.",
    ],
    accent: "#d4af37",
    address: "3929 FM157, Euless, TX 76040",
    mapsQuery: "3929 FM157, Euless, TX 76040",
    phone: "817-355-8824",
    hours: [
      { days: "Sunday – Thursday", open: "11 AM", close: "2 AM" },
      { days: "Friday & Saturday", open: "11 AM", close: "4 AM" },
    ],
    amenities: ["Six stages", "Open 365 days", "After-hours Fri & Sat until 4 AM", "Happy hour", "Monthly themed parties", "Private events"],
    vipPackages: ["VIP Main Floor Table", "VIP Party Table Package", "Club Drink Package"],
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/pandoras_euless/" },
      { label: "Facebook", href: "https://www.facebook.com/pandorasfortworth" },
      { label: "X", href: "https://x.com/pandoraseuless" },
    ],
    image: `${R}/euless.webp`,
    gallery: [`${R}/euless.webp`, `${R}/champagne.webp`, `${R}/crowd.webp`, `${R}/dj.webp`],
    verification: "official",
    sourceUrl: "https://pandorasfortworth.com/contact/",
    website: "https://pandorasfortworth.com/",
  },
  {
    slug: "pandoras-south",
    name: "Pandora's South Fort Worth",
    city: "Fort Worth, TX",
    status: "open",
    statusLabel: "South Fort Worth",
    tagline: "South Fort Worth's BYOB party club.",
    summary: "Six stages and the BYOB party South Fort Worth knows, open every day with after-hours Fridays and Saturdays until 4 AM.",
    description: [
      "On the south side of Tarrant County, Pandora's South is the network's BYOB party club.",
      "Six stages, a diverse line-up of entertainers, happy hour, and after-hours parties every Friday and Saturday until 4 AM. It's open every day of the year, holidays included.",
      "Monthly themed parties, special-guest appearances, and celebrations of every kind: birthdays, bachelor parties, game days, and private events.",
    ],
    accent: "#b8862b",
    address: "8701 South Fwy, Fort Worth, TX 76140",
    mapsQuery: "8701 South Fwy, Fort Worth, TX 76140",
    phone: "940-331-6833",
    hours: [
      { days: "Sunday – Thursday", open: "4 PM", close: "2 AM" },
      { days: "Friday & Saturday", open: "4 PM", close: "4 AM" },
    ],
    amenities: ["Six stages", "BYOB", "Open 365 days", "After-hours Fri & Sat until 4 AM", "Happy hour", "Monthly themed parties"],
    vipPackages: ["VIP Main Floor Table", "VIP BYOB Party Table Package"],
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/pandoras_south/" },
      { label: "Facebook", href: "https://www.facebook.com/pandorassouth" },
      { label: "X", href: "https://x.com/PandorasSouth" },
    ],
    image: `${R}/south.webp`,
    gallery: [`${R}/south.webp`, `${R}/bar.webp`, `${R}/confetti.webp`, `${R}/champagne.webp`],
    verification: "official",
    sourceUrl: "https://pandorassouth.com/contact/",
    website: "https://pandorassouth.com/",
  },
  {
    slug: "pandoras-lakeside",
    name: "Pandora's Lakeside",
    city: "DFW, TX",
    status: "open",
    statusLabel: "Lakeside",
    tagline: "The Pandora's experience, by the water.",
    summary: "One of the seven Pandora's brands. Location details to be confirmed.",
    description: [
      "Pandora's Lakeside is listed among the seven Pandora's Clubs brands.",
      "Its address and hours couldn't be verified for this concept and are left as placeholders until management confirms them.",
    ],
    accent: "#7fa7b8",
    hours: [],
    hoursNote: "Address and hours to be confirmed with management.",
    amenities: ["VIP tables", "Celebrations & private parties"],
    image: `${R}/lakeside.webp`,
    gallery: [`${R}/lakeside.webp`, `${R}/bokeh.webp`, `${R}/chandelier.webp`],
    verification: "unconfirmed",
    website: "https://www.pandoraslakeside.com/",
  },
];
