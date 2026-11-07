"use client";

import { useEffect, useState } from "react";
import { venue } from "@/config/venue";

const KEY = `${venue.slug}-demo-ribbon-hidden`;

/**
 * Slim "unofficial concept demo" notice pinned above the navbar. It can be
 * collapsed for the current browser session, but the footer disclaimer and
 * per-item demo badges stay visible regardless.
 */
export default function DemoRibbon() {
  const [hidden, setHidden] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem(KEY) === "1");
    } catch {
      // storage unavailable — keep the ribbon visible
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    document.documentElement.toggleAttribute("data-ribbon", venue.demo.ribbon && !hidden);
  }, [hidden]);

  if (!venue.demo.ribbon || hidden) return null;

  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-7 items-center justify-center gap-3 border-b border-white/10 bg-black/85 px-10 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-bone/75 backdrop-blur"
    >
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" aria-hidden />
      <span className="hidden truncate sm:inline">{venue.demo.ribbonText}</span>
      <span className="truncate tracking-[0.08em] sm:hidden">{venue.demo.ribbonTextShort ?? venue.demo.ribbonText}</span>
      <button
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        aria-label="Hide demo notice"
        className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full text-bone/60 hover:bg-white/10 hover:text-bone"
      >
        ×
      </button>
    </div>
  );
}
