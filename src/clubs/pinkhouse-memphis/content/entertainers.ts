import type { Entertainer } from "@/types";

/*
 * PLACEHOLDER roster. These are invented stage names with generated art.
 * They are not Pinkhouse entertainers. Each one is badged "Placeholder
 * profile" in the UI.
 * No social handles are set, so no link points at a real person's account.
 *
 * To add a real performer later: append an entry (with their consent and
 * authorized photos), set `featured` to pin them to the home spotlight, and
 * add `socials.instagram` with their handle. To remove one, delete the entry.
 */

const weekend = [
  { day: "Friday", hours: "Late night — TBA" },
  { day: "Saturday", hours: "Late night — TBA" },
];

export const entertainers: Entertainer[] = [
  {
    type: "performer",
    id: "rose",
    name: "Rosé",
    tagline: "Featured headliner placeholder.",
    bio: "Placeholder profile. Shows how a featured entertainer is presented: spotlight placement, bio, schedule, gallery, and social links once authorized.",
    workingTonight: true,
    featured: true,
    followers: 0,
    schedule: weekend,
    galleryCount: 6,
    hue: 330,
  },
  {
    type: "performer",
    id: "velvet",
    name: "Velvet",
    tagline: "Stage name placeholder.",
    bio: "Placeholder profile. Real profiles would be added by management with each performer's consent and approved photography.",
    workingTonight: true,
    featured: true,
    followers: 0,
    schedule: weekend,
    galleryCount: 4,
    hue: 320,
  },
  {
    type: "performer",
    id: "nova",
    name: "Nova",
    tagline: "Stage name placeholder.",
    bio: "Placeholder profile used to demonstrate the roster layout.",
    workingTonight: true,
    featured: true,
    followers: 0,
    schedule: weekend,
    galleryCount: 4,
    hue: 300,
  },
  {
    type: "performer",
    id: "cashmere",
    name: "Cashmere",
    tagline: "Stage name placeholder.",
    bio: "Placeholder profile used to demonstrate the roster layout.",
    workingTonight: false,
    featured: false,
    followers: 0,
    schedule: weekend,
    galleryCount: 3,
    hue: 345,
  },
  {
    type: "performer",
    id: "sapphire",
    name: "Sapphire",
    tagline: "Stage name placeholder.",
    bio: "Placeholder profile used to demonstrate the roster layout.",
    workingTonight: true,
    featured: false,
    followers: 0,
    schedule: weekend,
    galleryCount: 3,
    hue: 285,
  },
  {
    type: "performer",
    id: "bella",
    name: "Bella",
    tagline: "Stage name placeholder.",
    bio: "Placeholder profile used to demonstrate the roster layout.",
    workingTonight: false,
    featured: false,
    followers: 0,
    schedule: weekend,
    galleryCount: 3,
    hue: 335,
  },
];
