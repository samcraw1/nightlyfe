import type { PlayhouseBookingOption, PlayhouseExperience } from "@/clubs/types";
import { img } from "./sources";

/*
 * "promoted" = the promoter's public posts advertise it (late-night parties,
 * live dancers, kitchen menu, sections). "proposed" = a concept offering this
 * site suggests; Bibs Playhouse has not confirmed it.
 */
export const experiences: PlayhouseExperience[] = [
  {
    id: "nightlife",
    title: "Nightlife & Entertainment",
    blurb: "Late nights, live dancers, music and a full kitchen menu. The energy Bibs is already known for.",
    image: img("room"),
    status: "promoted",
    bookingType: "general",
  },
  {
    id: "private-events",
    title: "Private Events",
    blurb: "Birthdays, celebrations and buyouts, with the room styled around your night.",
    image: img("birthday"),
    status: "proposed",
    bookingType: "private-event",
  },
  {
    id: "music-video",
    title: "Music Video Productions",
    blurb: "A ready-made club set for artists and directors. Lights, atmosphere and a crowd when you need one.",
    image: img("video-camera"),
    status: "proposed",
    bookingType: "music-video",
  },
  {
    id: "photoshoots",
    title: "Professional Photoshoots",
    blurb: "Neon, shadow and texture for editorials, album art, brand campaigns and content days.",
    image: img("neon-portrait"),
    status: "proposed",
    bookingType: "photoshoot",
  },
  {
    id: "exclusive",
    title: "Exclusive Experiences",
    blurb: "Reserved sections, bottle presentations and hosted nights for groups who want the best seat in the house.",
    image: img("champagne"),
    status: "proposed",
    bookingType: "private-event",
  },
];

export const bookingOptions: PlayhouseBookingOption[] = [
  { id: "private-event", label: "Private Event", blurb: "Birthdays, celebrations, buyouts", status: "proposed" },
  { id: "music-video", label: "Music Video Shoot", blurb: "Artists, directors, crews", status: "proposed" },
  { id: "photoshoot", label: "Photoshoot", blurb: "Editorial, brand, album art", status: "proposed" },
  { id: "venue-rental", label: "Venue Rental", blurb: "Hourly or full-night use", status: "proposed" },
  { id: "general", label: "General Inquiry", blurb: "Sections, nights, anything else", status: "promoted" },
];
