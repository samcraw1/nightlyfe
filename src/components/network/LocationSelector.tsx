"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { useLocations } from "@/lib/network-store";
import { EASE } from "@/components/ui/motion";

/**
 * Premium location picker: a disclosure button that opens a list of club
 * links. Plain links keep it accessible and crawlable. Esc or an outside
 * click closes it.
 */
export default function LocationSelector({ className = "" }: { className?: string }) {
  const locations = useLocations();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative w-full max-w-md ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="glass-strong flex w-full items-center gap-3 rounded-full py-2.5 pl-3 pr-5 text-left transition hover:border-gold/50"
      >
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
          <MapPin className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-bone/50">Find your club</span>
          <span className="block truncate text-sm font-medium text-bone">Choose from {locations.length} locations</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-gold transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="glass-strong absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 max-h-[60vh] overflow-y-auto rounded-2xl p-2 text-left shadow-2xl"
          >
            <ul>
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/clubs/${l.slug}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5"
                  >
                    <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: l.accent ?? "var(--gold)" }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-bone group-hover:text-gold">{l.name}</span>
                      <span className="block text-[11px] text-bone/50">{l.city}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-bone/30 transition group-hover:text-gold" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
