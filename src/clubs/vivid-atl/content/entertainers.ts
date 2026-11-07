import type { Entertainer } from "@/types";

/*
 * FICTIONAL demo roster. Invented stage names with generated placeholder
 * art — not real Vivide entertainers, and not the guest hosts seen on the
 * club's flyers. Real profiles would only be added with each performer's
 * consent.
 */

const weekend = [
  { day: "Friday", hours: "4Play Friday" },
  { day: "Saturday", hours: "Vivide on Saturday" },
];
const midweek = [
  { day: "Wednesday", hours: "Wet Wednesday" },
  { day: "Thursday", hours: "Celebrity Thursday" },
];
const early = [
  { day: "Monday", hours: "Dinero Lunes" },
  { day: "Tuesday", hours: "Passport Tuesday" },
];

export const entertainers: Entertainer[] = [
  {
    type: "performer",
    id: "onyxia",
    name: "Onyxia",
    tagline: "Saturday headliner. Black-label energy.",
    bio: "Sample profile. Onyxia is a fictional headliner used to show how featured entertainer pages work: bio, weekly schedule, gallery, favorites, and a one-tap path to a VIP section.",
    workingTonight: true,
    featured: true,
    followers: 12400,
    schedule: weekend,
    galleryCount: 6,
    hue: 42,
  },
  {
    type: "performer",
    id: "amethyst",
    name: "Amethyst",
    tagline: "The twist. Pole artistry and showstopper sets.",
    bio: "Sample profile. Amethyst is a fictional entertainer showing how athletic stage acts can be featured on the homepage and in the Digital Stage rotation.",
    workingTonight: true,
    featured: true,
    followers: 9800,
    schedule: [...midweek, ...weekend],
    galleryCount: 6,
    hue: 268,
  },
  {
    type: "performer",
    id: "dinero",
    name: "Dinero",
    tagline: "Monday money. Every week.",
    bio: "Sample profile. Dinero is a fictional entertainer used to demonstrate tying performers to the club's themed nights.",
    workingTonight: true,
    featured: true,
    followers: 7600,
    schedule: [...early, { day: "Saturday", hours: "Vivide on Saturday" }],
    galleryCount: 5,
    hue: 50,
  },
  {
    type: "performer",
    id: "passport",
    name: "Paris Blu",
    tagline: "Passport Tuesday regular. Worldly and unbothered.",
    bio: "Sample profile. Paris Blu is a fictional entertainer used for demo purposes only.",
    workingTonight: false,
    featured: true,
    followers: 6100,
    schedule: [{ day: "Tuesday", hours: "Passport Tuesday" }, ...midweek],
    galleryCount: 5,
    hue: 205,
  },
  {
    type: "performer",
    id: "chrome",
    name: "Chrome",
    tagline: "Silver everything. Late-night closer.",
    bio: "Sample profile. Chrome is a fictional entertainer used for demo purposes only.",
    workingTonight: true,
    featured: false,
    followers: 4300,
    schedule: weekend,
    galleryCount: 4,
    hue: 220,
  },
  {
    type: "performer",
    id: "cartier",
    name: "Cartier",
    tagline: "Celebrity Thursday's main attraction.",
    bio: "Sample profile. Cartier is a fictional entertainer used for demo purposes only.",
    workingTonight: false,
    featured: false,
    followers: 5200,
    schedule: [{ day: "Thursday", hours: "Celebrity Thursday" }, ...weekend],
    galleryCount: 4,
    hue: 30,
  },
  {
    type: "performer",
    id: "nova-rae",
    name: "Nova Rae",
    tagline: "New face on the weekend lineup.",
    bio: "Sample profile. Nova Rae is a fictional entertainer. In the Digital Stage demo she has no broadcast consent on file, to show that the platform blocks streaming anyone who hasn't opted in.",
    workingTonight: true,
    featured: false,
    followers: 2100,
    schedule: weekend,
    galleryCount: 3,
    hue: 285,
  },
  {
    type: "performer",
    id: "goldie",
    name: "Goldie",
    tagline: "Day to late night — fifteen hours, no off switch.",
    bio: "Sample profile. Goldie is a fictional entertainer used for demo purposes only.",
    workingTonight: true,
    featured: false,
    followers: 3600,
    schedule: [...early, { day: "Friday", hours: "4Play Friday" }],
    galleryCount: 4,
    hue: 45,
  },
];
