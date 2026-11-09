"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import type { GalleryCategory } from "@/clubs/types";
import { usePlayhouseGallery } from "@/lib/venue-dashboard-store";
import { EASE, SectionTitle } from "@/components/ui/motion";
import Lightbox from "./Lightbox";

const FILTERS: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "venue", label: "The Venue" },
  { id: "events", label: "Events" },
  { id: "productions", label: "Productions" },
  { id: "vip", label: "VIP Experiences" },
];

/** Masonry gallery with category filters and a full-screen viewer. */
export default function Gallery() {
  const all = usePlayhouseGallery();
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(() => (filter === "all" ? all : all.filter((p) => p.category === filter)), [all, filter]);

  return (
    <section id="gallery" aria-labelledby="gallery-title">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          id="gallery-title"
          eyebrow="Gallery"
          title={
            <>
              Inside <span className="pl-gold-text italic">the playhouse.</span>
            </>
          }
          body="Stand-in photography for this concept, ready to swap for the venue's own shots from nights, productions and private events."
        />
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0" role="group" aria-label="Filter photos">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`flex-shrink-0 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition ${
                filter === f.id ? "border-gold bg-gold text-ink" : "border-white/15 text-bone/70 hover:border-white/35 hover:text-bone"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-10 columns-2 gap-3 sm:gap-4 lg:columns-3 [&>*]:mb-3 sm:[&>*]:mb-4"
      >
          {items.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 text-left"
              style={{ aspectRatio: `${p.w} / ${p.h}` }}
              aria-label={`Open photo: ${p.alt}`}
            >
              <Image src={p.src} alt={p.alt} fill unoptimized={p.src.startsWith("http")} sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition duration-[1.2s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden />
              <div className="absolute inset-0 opacity-0 mix-blend-color transition duration-500 group-hover:opacity-100" style={{ background: "color-mix(in srgb, var(--accent-2) 40%, transparent)" }} aria-hidden />
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-bone opacity-0 backdrop-blur transition group-hover:opacity-100">
                <Expand className="h-4 w-4" aria-hidden />
              </span>
              <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-xs text-bone opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
                {p.alt}
              </span>
            </button>
          ))}
      </motion.div>

      <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </section>
  );
}
