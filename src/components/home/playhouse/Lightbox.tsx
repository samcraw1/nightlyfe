"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/clubs/types";
import { EASE } from "@/components/ui/motion";

const LABELS: Record<GalleryItem["category"], string> = {
  venue: "The Venue",
  events: "Events",
  productions: "Productions",
  vip: "VIP Experiences",
};

/** Full-screen photo viewer: arrows / swipe to move, Escape or backdrop to close. */
export default function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: GalleryItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null && !!items[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onIndex((index + d + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus?.();
    };
  }, [open, onClose, step]);

  const item = open ? items[index!] : null;

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex flex-col bg-black/95 backdrop-blur-xl"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-bone/60">
              <span className="text-gold">{LABELS[item.category]}</span> · {index! + 1} / {items.length}
            </p>
            <button ref={closeRef} onClick={onClose} aria-label="Close viewer" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone transition hover:border-gold hover:text-gold">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="pointer-events-none absolute inset-4 sm:inset-x-24 sm:inset-y-2"
              >
                <Image src={item.src} alt={item.alt} fill unoptimized={item.src.startsWith("http")} sizes="100vw" className="object-contain" />
              </motion.div>
            </AnimatePresence>
            <button onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-bone transition hover:border-gold hover:text-gold sm:flex">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button onClick={() => step(1)} aria-label="Next photo" className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-bone transition hover:border-gold hover:text-gold sm:flex">
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 px-4 py-5 sm:px-8">
            <button onClick={() => step(-1)} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone sm:hidden">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <p className="flex-1 text-center text-sm text-bone/75">
              {item.alt}
              <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-bone/35">Stand-in photo (Unsplash) · not Bibs Playhouse</span>
            </p>
            <button onClick={() => step(1)} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone sm:hidden">
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
