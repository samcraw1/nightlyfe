import type { MetadataRoute } from "next";
import { venue } from "@/config/venue";

/** PWA manifest generated from the active club's config. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${venue.name} — ${venue.tagline}`,
    short_name: venue.shortName,
    description: venue.description,
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: venue.colors.ink,
    theme_color: venue.colors.ink,
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
