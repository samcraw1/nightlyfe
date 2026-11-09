import type { Entertainer } from "@/types";

/*
 * DEMO roster: invented stage names with generated art, each assigned to a
 * club to show cross-location profiles. These are not real Pandora's
 * entertainers. No social handles are set, so nothing links to a real
 * person.
 */

const p = (
  id: string,
  name: string,
  locationSlug: string,
  hue: number,
  featured = false,
): Entertainer => ({
  type: "performer",
  id,
  name,
  locationSlug,
  tagline: "Demo profile.",
  bio: "Demo profile. Shows how a performer's profile, club affiliation, schedule, and featured appearances would be presented once real profiles are added with consent.",
  workingTonight: featured,
  featured,
  followers: 0,
  schedule: [{ day: "Featured appearances", hours: "TBA" }],
  galleryCount: 3,
  hue,
});

export const entertainers: Entertainer[] = [
  p("aurelia", "Aurelia", "platinum-dallas", 45, true),
  p("scarlett", "Scarlett", "roxys-showgirls", 355, true),
  p("onyx", "Onyx", "pandoras-euless", 30, true),
  p("valentina", "Valentina", "pandoras-south", 20, true),
  p("ivory", "Ivory", "pandoras-dallas", 40),
  p("ruby", "Ruby", "dallas-cabaret", 350),
  p("sienna", "Sienna", "pandoras-lakeside", 200),
  p("goldie", "Goldie", "pandoras-euless", 48),
];
