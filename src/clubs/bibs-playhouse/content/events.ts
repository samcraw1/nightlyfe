import type { PlayhouseEvent } from "@/clubs/types";
import { APRIL_POST, PROMOTER_THREADS, img } from "./sources";

/** A date `days` from today as YYYY-MM-DD, so sample events never look stale. */
function inDays(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/*
 * Two events are VERIFIED from the promoter's public posts (both already
 * past). Everything else is SAMPLE content that shows how the venue could
 * list its nights; the UI badges it as a demonstration.
 */
export const events: PlayhouseEvent[] = [
  {
    id: "scorpios-after-dark",
    title: "Scorpios After Dark",
    date: "2026-11-07",
    time: "10 PM – 3 AM",
    kind: "upcoming",
    description: "Scorpio season party, billed “only at Bibs”. As promoted: BYOB, live dancers, kitchen menu, sections available.",
    tags: ["BYOB", "Live dancers", "Sections"],
    image: img("beams"),
    source: "verified",
    sourceLabel: "Posted by @mike_da_promoter",
    sourceUrl: PROMOTER_THREADS,
  },
  {
    id: "bibs-april-25",
    title: "Bibs Playhouse",
    date: "2026-04-25",
    time: "10 PM – 4 AM",
    kind: "upcoming",
    description: "Late-night party at Bibs Playhouse. BYOB, as promoted.",
    tags: ["BYOB"],
    image: img("room"),
    source: "verified",
    sourceLabel: "Posted by @mike_da_promoter",
    sourceUrl: APRIL_POST,
  },
  {
    id: "sample-saturday-takeover",
    title: "Saturday Night Takeover",
    date: inDays(5),
    time: "10 PM – Late",
    kind: "upcoming",
    description: "Sample listing. A headline Saturday with a guest DJ, host and reserved sections.",
    tags: ["Guest DJ", "Sections"],
    image: img("hero"),
    featured: true,
    source: "sample",
  },
  {
    id: "sample-birthday-bash",
    title: "Birthday Bash Night",
    date: inDays(12),
    time: "10 PM – Late",
    kind: "upcoming",
    description: "Sample listing. Every birthday guest of the month celebrated together, with a group-section inquiry.",
    tags: ["Birthdays", "Groups"],
    image: img("confetti"),
    source: "sample",
  },
  {
    id: "sample-special-guest",
    title: "Special Guest Appearance",
    date: inDays(19),
    time: "11 PM – Late",
    kind: "upcoming",
    description: "Sample listing. How a celebrity host or artist appearance would be announced. No guest has been booked.",
    tags: ["Appearance"],
    image: img("singer"),
    source: "sample",
  },
  {
    id: "sample-friday",
    title: "Friday Night Playhouse",
    recurring: "Every Friday",
    time: "10 PM – Late",
    kind: "weekly",
    description: "Sample weekly night. The house party format: DJs, dancers, kitchen open late.",
    image: img("purple-portrait"),
    source: "sample",
  },
  {
    id: "sample-sunday",
    title: "Sunday Social",
    recurring: "Every Sunday",
    time: "8 PM – Late",
    kind: "weekly",
    description: "Sample weekly night. A slower, social night built around the kitchen menu and sections.",
    image: img("lounge"),
    source: "sample",
  },
  {
    id: "sample-section-promo",
    title: "Section Night Promotion",
    recurring: "Limited time",
    time: "All night",
    kind: "promotion",
    description: "Sample promotion. Book a section for your group and get a dedicated host. Terms would be set by management.",
    image: img("champagne"),
    source: "sample",
  },
  {
    id: "sample-creator-day",
    title: "Creator Content Day",
    recurring: "Monthly",
    time: "Daytime",
    kind: "promotion",
    description: "Sample promotion. Short studio-style sessions for photographers and creators while the club is closed.",
    image: img("studio"),
    source: "sample",
  },
];
