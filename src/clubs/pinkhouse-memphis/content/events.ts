import type { WeeklySpecial } from "@/clubs/types";
import type { ClubEvent } from "@/types";

/*
 * DEMO events. Pinkhouse Memphis has not announced any events or an opening
 * date, so every entry here is fictional. Each one is badged "Demo event",
 * dates are relative so they never look stale, and times/prices read "TBA".
 */

/** A date `days` from today as YYYY-MM-DD. */
function inDays(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const weeklySpecials: WeeklySpecial[] = [];

export const events: ClubEvent[] = [
  {
    id: "grand-opening-preview",
    title: "Grand Opening Night",
    date: inDays(30),
    doors: "TBA",
    description:
      "Demo event. Shows how the opening night would be announced: a hero flyer, countdown, VIP section inquiries, and a featured lineup. No date has been announced.",
    gaPrice: 0,
    vipFromPrice: 0,
    parkingPrice: 0,
    featured: true,
    hue: 330,
  },
  {
    id: "houston-takeover",
    title: "Houston Takeover",
    date: inDays(37),
    doors: "TBA",
    description:
      "Demo event. A sample format for bringing Houston's afterhours energy to Memphis with guest DJs and hosts.",
    gaPrice: 0,
    vipFromPrice: 0,
    parkingPrice: 0,
    featured: false,
    hue: 320,
  },
  {
    id: "all-pink-affair",
    title: "The All-Pink Affair",
    date: inDays(44),
    doors: "TBA",
    description: "Demo event. A sample themed night with a pink dress code and VIP section packages.",
    gaPrice: 0,
    vipFromPrice: 0,
    parkingPrice: 0,
    featured: false,
    hue: 335,
  },
  {
    id: "after-dark-sundays",
    title: "After Dark Sundays",
    date: inDays(49),
    doors: "TBA",
    description: "Demo event. A sample recurring night card.",
    gaPrice: 0,
    vipFromPrice: 0,
    parkingPrice: 0,
    featured: false,
    hue: 300,
  },
];
