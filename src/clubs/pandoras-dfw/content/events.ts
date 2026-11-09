import type { WeeklySpecial } from "@/clubs/types";
import type { ClubEvent } from "@/types";

/*
 * "verified" items restate promotions published on the clubs' own sites
 * (pandorasfortworth.com, pandorassouth.com): after-hours parties every
 * Friday and Saturday until 4 AM, happy hour, and monthly themed parties.
 * No times beyond those, and no prices, are stated.
 *
 * "demo" items are fictional, badged "Demo event", with relative dates so
 * they never look stale.
 */

function inDays(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const base = { gaPrice: 0, vipFromPrice: 0, parkingPrice: 0 };

export const weeklySpecials: WeeklySpecial[] = [];

export const events: ClubEvent[] = [
  /* ---- verified recurring promotions ---- */
  {
    id: "euless-after-hours",
    locationSlug: "pandoras-euless",
    recurring: "Every Fri & Sat",
    source: "verified",
    title: "After-Hours Party",
    date: inDays(0),
    doors: "Until 4 AM",
    description: "Legendary after-hours parties every Friday and Saturday night until 4 AM.",
    featured: false,
    hue: 45,
    ...base,
  },
  {
    id: "south-after-hours",
    locationSlug: "pandoras-south",
    recurring: "Every Fri & Sat",
    source: "verified",
    title: "BYOB After-Hours",
    date: inDays(0),
    doors: "Until 4 AM",
    description: "South Fort Worth's after-hours BYOB party, every Friday and Saturday until 4 AM.",
    featured: false,
    hue: 38,
    ...base,
  },
  {
    id: "euless-happy-hour",
    locationSlug: "pandoras-euless",
    recurring: "Daily",
    source: "verified",
    title: "Happy Hour",
    date: inDays(0),
    doors: "Times TBA",
    description: "Happy hour deals, as promoted by the club. Times to be confirmed.",
    featured: false,
    hue: 50,
    ...base,
  },
  {
    id: "south-happy-hour",
    locationSlug: "pandoras-south",
    recurring: "Daily",
    source: "verified",
    title: "Happy Hour",
    date: inDays(0),
    doors: "Times TBA",
    description: "Happy hour deals, as promoted by the club. Times to be confirmed.",
    featured: false,
    hue: 40,
    ...base,
  },
  {
    id: "themed-parties",
    recurring: "Monthly",
    source: "verified",
    title: "Monthly Themed Parties",
    date: inDays(0),
    doors: "Dates TBA",
    description: "Each month brings themed parties and special-guest appearances at Pandora's Euless and South.",
    featured: false,
    hue: 0,
    ...base,
  },

  /* ---- fictional demo events ---- */
  {
    id: "black-and-gold-night",
    locationSlug: "platinum-dallas",
    source: "demo",
    title: "Black & Gold Night",
    date: inDays(9),
    doors: "TBA",
    description: "Demo event. A dress-code night showing how a flagship event would be promoted across the network.",
    featured: true,
    hue: 45,
    ...base,
  },
  {
    id: "showgirls-revue",
    locationSlug: "roxys-showgirls",
    source: "demo",
    title: "Showgirls Revue",
    date: inDays(13),
    doors: "TBA",
    description: "Demo event. A sample themed showcase card for Roxy's.",
    featured: false,
    hue: 355,
    ...base,
  },
  {
    id: "game-day-euless",
    locationSlug: "pandoras-euless",
    source: "demo",
    title: "Big Game Watch Party",
    date: inDays(5),
    doors: "TBA",
    description: "Demo event. A game-day format: the clubs promote watching the big game, but this specific event is a sample.",
    featured: false,
    hue: 210,
    ...base,
  },
  {
    id: "cabaret-crimson",
    locationSlug: "dallas-cabaret",
    source: "demo",
    title: "Crimson Cabaret",
    date: inDays(16),
    doors: "TBA",
    description: "Demo event. A sample cabaret-themed night.",
    featured: false,
    hue: 352,
    ...base,
  },
  {
    id: "lakeside-sunset",
    locationSlug: "pandoras-lakeside",
    source: "demo",
    title: "Lakeside Late Night",
    date: inDays(20),
    doors: "TBA",
    description: "Demo event. A sample event card for Lakeside.",
    featured: false,
    hue: 200,
    ...base,
  },
];
