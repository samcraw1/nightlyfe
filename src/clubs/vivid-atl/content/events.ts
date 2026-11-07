import type { WeeklySpecial } from "@/clubs/types";
import type { ClubEvent } from "@/types";

/*
 * Weekly night NAMES are taken from Vivide Atlanta's own Instagram flyers
 * (@vivideatlanta, 2026): Dinero Lunes, Passport Tuesday, Wet Wednesday,
 * Celebrity Thursday, 4Play Friday, Vivide on Saturday. No Sunday night was
 * seen. Descriptions, dates, times, and prices are SAMPLE content and are
 * badged as such. Event formats (celebrity-hosted nights, themed parties,
 * birthday celebrations, contests) mirror what the club promotes, but no
 * real guest names are used.
 */



export const weeklySpecials: WeeklySpecial[] = [
  { id: "dinero-lunes", when: "Mondays", title: "Dinero Lunes", description: `Start the week with money on the floor.`, hue: 48 },
  { id: "passport-tuesday", when: "Tuesdays", title: "Passport Tuesday", description: `A night with an international theme.`, hue: 205 },
  { id: "wet-wednesday", when: "Wednesdays", title: "Wet Wednesday", description: `Midweek, turned all the way up.`, hue: 190 },
  { id: "celebrity-thursday", when: "Thursdays", title: "Celebrity Thursday", description: `Hosted nights with special guests.`, hue: 38 },
  { id: "4play-friday", when: "Fridays", title: "4Play Friday", description: `The weekend starts here.`, hue: 0 },
  { id: "vivide-saturday", when: "Saturdays", title: "Vivide on Saturday", description: `The flagship night: full roster, VIP sections at their busiest.`, hue: 268 },
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
    id: "vivide-on-saturday",
    title: "Vivide on Saturday",
    date: next(6),
    doors: "TBC",
    description:
      "Sample event. The flagship night — full entertainer roster, the main stage all night, and VIP sections that go first. Times, cover, and host: confirm with management.",
    gaPrice: 20,
    vipFromPrice: 500,
    parkingPrice: 0,
    featured: true,
    hue: 268,
  },
  {
    id: "celebrity-thursday",
    title: "Celebrity Thursday: Hosted Night",
    date: next(4),
    doors: "TBC",
    description:
      "Sample event. A celebrity-hosted night, the format Vivide promotes on Instagram. Guest name, set times, and VIP specials would be announced by the club.",
    gaPrice: 20,
    vipFromPrice: 400,
    parkingPrice: 0,
    featured: true,
    hue: 38,
  },
  {
    id: "4play-friday",
    title: "4Play Friday",
    date: next(5),
    doors: "TBC",
    description: "Sample event. Friday nights at Vivide. Lineup and specials: confirm with management.",
    gaPrice: 20,
    vipFromPrice: 400,
    parkingPrice: 0,
    featured: false,
    hue: 0,
  },
  {
    id: "birthday-celebration",
    title: "Birthday Celebration Night",
    date: next(3, 1),
    doors: "TBC",
    description:
      "Sample event. A birthday-takeover format: reserved sections, a hosted entrance, and bottle presentations. Book a celebration from the Celebrations page.",
    gaPrice: 20,
    vipFromPrice: 350,
    parkingPrice: 0,
    featured: false,
    hue: 320,
  },
  {
    id: "contest-night",
    title: "Saturday Contest Night",
    date: next(6, 1),
    doors: "TBC",
    description:
      "Sample event. A competition-style night with guest judges, as promoted on the club's flyers. Prizes and rules: confirm with management.",
    gaPrice: 25,
    vipFromPrice: 500,
    parkingPrice: 0,
    featured: false,
    hue: 15,
  },
];
