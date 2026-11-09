import type { BookingCategory, GalleryCategory, PlayhouseBooking } from "@/clubs/types";

export const CATEGORY_LABEL: Record<BookingCategory, string> = {
  "private-event": "Private Event",
  "music-video": "Music Video Shoot",
  photoshoot: "Photoshoot",
  "venue-rental": "Venue Rental",
  general: "General Inquiry",
};

export const GALLERY_LABEL: Record<GalleryCategory, string> = {
  venue: "The Venue",
  events: "Events",
  productions: "Productions",
  vip: "VIP Experiences",
};

export const STATUSES: PlayhouseBooking["status"][] = ["new", "contacted", "confirmed", "declined"];

export const TONE: Record<PlayhouseBooking["status"], string> = {
  new: "bg-gold/15 text-gold",
  contacted: "bg-sky-400/10 text-sky-300",
  confirmed: "bg-emerald-400/10 text-emerald-300",
  declined: "bg-white/5 text-bone/50",
};
