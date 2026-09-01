import type { ClubEvent } from "@/types";

export const events: ClubEvent[] = [
  {
    id: "gold-rush-saturdays",
    title: "Gold Rush Saturdays",
    date: "2026-09-05",
    doors: "10PM",
    description:
      "The flagship Saturday night. Full entertainer roster, live DJ sets until 4AM, and the midnight Gold Rush showcase on the main stage. Bottle specials before 11PM.",
    gaPrice: 20,
    vipFromPrice: 350,
    parkingPrice: 15,
    featured: true,
    hue: 42,
  },
  {
    id: "labor-day-blackout",
    title: "Labor Day Blackout",
    date: "2026-09-07",
    doors: "9PM",
    description:
      "Holiday takeover with a special guest DJ, extended hours, and a blackout dress code. All-black everything — gold accents encouraged.",
    gaPrice: 30,
    vipFromPrice: 500,
    parkingPrice: 20,
    featured: true,
    hue: 270,
  },
  {
    id: "throwback-thursdays",
    title: "Throwback Thursdays",
    date: "2026-09-10",
    doors: "9PM",
    description:
      "2000s hip-hop and R&B all night. Half-price wings until midnight and no cover before 10PM.",
    gaPrice: 10,
    vipFromPrice: 250,
    parkingPrice: 10,
    featured: false,
    hue: 190,
  },
  {
    id: "red-light-friday",
    title: "Red Light Friday",
    date: "2026-09-11",
    doors: "10PM",
    description:
      "The room goes red. Amateur showcase at 11PM, cash prize for the crowd favorite, and the full Friday lineup after.",
    gaPrice: 20,
    vipFromPrice: 300,
    parkingPrice: 15,
    featured: false,
    hue: 350,
  },
  {
    id: "industry-sundays",
    title: "Industry Sundays",
    date: "2026-09-13",
    doors: "9PM",
    description:
      "Service-industry night. Show a paystub or badge for free entry, drink specials all night, and a laid-back lounge vibe.",
    gaPrice: 10,
    vipFromPrice: 200,
    parkingPrice: 10,
    featured: false,
    hue: 150,
  },
];

export function getEvent(id: string): ClubEvent | undefined {
  return events.find((e) => e.id === id);
}

export function formatEventDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
