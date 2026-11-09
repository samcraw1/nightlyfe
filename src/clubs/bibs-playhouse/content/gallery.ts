import type { GalleryItem } from "@/clubs/types";
import { img } from "./sources";

/*
 * Stand-in Unsplash photography (see public/clubs/bibs-playhouse/CREDITS.md).
 * None of it shows Bibs Playhouse. Replace with the venue's own photos.
 */
export const gallery: GalleryItem[] = [
  { id: "g-hero", src: img("hero"), alt: "Silhouettes under purple stage light", category: "venue", w: 1600, h: 1067 },
  { id: "g-neon-sign", src: img("neon-sign"), alt: "Neon signage glowing in the dark", category: "venue", w: 1600, h: 2400 },
  { id: "g-confetti", src: img("confetti"), alt: "Crowd celebrating under falling confetti", category: "events", w: 1600, h: 1067 },
  { id: "g-video-camera", src: img("video-camera"), alt: "Cinema camera monitor lit red on set", category: "productions", w: 1600, h: 2400 },
  { id: "g-champagne", src: img("champagne"), alt: "Champagne poured into a tray of flutes", category: "vip", w: 1600, h: 1068 },
  { id: "g-beams", src: img("beams"), alt: "Purple light beams cutting through haze", category: "venue", w: 1600, h: 2134 },
  { id: "g-singer", src: img("singer"), alt: "Performer on stage under colored lights", category: "events", w: 1600, h: 1067 },
  { id: "g-studio", src: img("studio"), alt: "Photo studio with softboxes and a white cyc", category: "productions", w: 1600, h: 900 },
  { id: "g-lounge", src: img("lounge"), alt: "Dim lounge booth beneath a mural", category: "vip", w: 1600, h: 2126 },
  { id: "g-room", src: img("room"), alt: "Guests in a purple-lit room", category: "events", w: 1600, h: 1065 },
  { id: "g-neon-portrait", src: img("neon-portrait"), alt: "Portrait against a neon wall", category: "productions", w: 1600, h: 2416 },
  { id: "g-birthday", src: img("birthday"), alt: "Happy Birthday neon sign", category: "vip", w: 1600, h: 1067 },
  { id: "g-crew-dark", src: img("crew-dark"), alt: "Film crew working a night set", category: "productions", w: 1600, h: 1067 },
  { id: "g-chandelier", src: img("chandelier-bar"), alt: "Multi-level bar under glowing chandeliers", category: "venue", w: 1600, h: 2134 },
  { id: "g-purple-portrait", src: img("purple-portrait"), alt: "Guest in violet light", category: "events", w: 1600, h: 1067 },
  { id: "g-clapper", src: img("clapper"), alt: "Clapperboard held up on set", category: "productions", w: 1600, h: 1068 },
];
