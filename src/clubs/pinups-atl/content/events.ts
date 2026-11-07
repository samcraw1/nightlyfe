import type { WeeklySpecial } from "@/clubs/types";
import type { ClubEvent } from "@/types";

/*
 * Night names (Dayshift, Saturday, New Sundays) and hookah come from the
 * club's own site. Descriptions, dates and prices are SAMPLE content, badged
 * as such in the UI. Real details: confirm with management.
 */

export const weeklySpecials: WeeklySpecial[] = [
  {
    id: "dayshift",
    when: "Daytime",
    title: "Dayshift",
    description: "The daytime lineup for an afternoon off the clock. Days and hours: confirm with management.",
    hue: 25,
  },
  {
    id: "saturday",
    when: "Saturdays",
    title: "Saturday Nights",
    description: "The full weekend roster on the main stage and VIP sections at their busiest. Book ahead.",
    hue: 325,
  },
  {
    id: "new-sundays",
    when: "Sundays",
    title: "New Sundays",
    description: "Sunday nights, reimagined. Lineup and specials: confirm with management.",
    hue: 280,
  },
  {
    id: "hookah",
    when: "Lounge",
    title: "Hookah",
    description: "Hookah service to your table. Flavors and pricing: confirm with management.",
    hue: 195,
  },
];

/** Next occurrence (today or later) of a weekday, as YYYY-MM-DD, so sample dates never look stale. */
function next(weekday: number, weeksAhead = 0): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7) + weeksAhead * 7);
  return d.toISOString().slice(0, 10);
}

export const events: ClubEvent[] = [
  {
    id: "saturday-nights",
    title: "Saturday Nights",
    date: next(6),
    doors: "TBC",
    description:
      "Sample event. The weekend's biggest night — full entertainer roster, main stage all night, and VIP sections that sell out early. Times and cover: confirm with management.",
    gaPrice: 20,
    vipFromPrice: 300,
    parkingPrice: 0,
    featured: true,
    hue: 325,
  },
  {
    id: "new-sundays",
    title: "New Sundays",
    date: next(0),
    doors: "TBC",
    description:
      "Sample event. Sunday nights with a fresh lineup. Details shown here are placeholders for the club's real Sunday program.",
    gaPrice: 15,
    vipFromPrice: 250,
    parkingPrice: 0,
    featured: true,
    hue: 280,
  },
  {
    id: "dayshift",
    title: "Dayshift",
    date: next(3),
    doors: "TBC",
    description:
      "Sample event. The daytime lineup, mid-week. Use this slot to promote dayshift specials once confirmed.",
    gaPrice: 10,
    vipFromPrice: 200,
    parkingPrice: 0,
    featured: false,
    hue: 25,
  },
  {
    id: "saturday-nights-2",
    title: "Saturday Nights",
    date: next(6, 1),
    doors: "TBC",
    description:
      "Sample event. Next weekend's Saturday — showing how recurring nights roll forward automatically on the events calendar.",
    gaPrice: 20,
    vipFromPrice: 300,
    parkingPrice: 0,
    featured: false,
    hue: 335,
  },
];
