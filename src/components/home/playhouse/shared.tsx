"use client";

import type { ReactNode } from "react";
import { BadgeCheck, Lightbulb } from "lucide-react";
import type { BookingCategory, OfferingStatus } from "@/clubs/types";

const BOOK_EVENT = "playhouse:book";

/** Scrolls to the booking form and preselects a category. */
export function openBooking(type?: BookingCategory) {
  if (type) window.dispatchEvent(new CustomEvent<BookingCategory>(BOOK_EVENT, { detail: type }));
  document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function onBookingRequest(cb: (type: BookingCategory) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<BookingCategory>).detail);
  window.addEventListener(BOOK_EVENT, handler);
  return () => window.removeEventListener(BOOK_EVENT, handler);
}

/** A link-styled button that jumps to the booking form with a category chosen. */
export function BookButton({
  type,
  children,
  variant = "gold",
  className = "",
}: {
  type?: BookingCategory;
  children: ReactNode;
  variant?: "gold" | "ghost" | "text";
  className?: string;
}) {
  const styles = {
    gold: "pl-btn-gold rounded-full px-7 py-3.5 text-[11px] font-bold uppercase hover:brightness-110",
    ghost:
      "rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-bone backdrop-blur-md hover:border-gold hover:text-gold",
    text: "text-[11px] font-bold uppercase tracking-[0.2em] text-gold hover:text-gold-bright",
  }[variant];
  return (
    <a
      href="#book"
      onClick={(e) => {
        e.preventDefault();
        openBooking(type);
      }}
      className={`inline-flex items-center justify-center gap-2 transition active:scale-[0.98] ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

/** "As promoted" (from public posts) vs "Proposed offering" (concept only). */
export function StatusBadge({ status, className = "" }: { status: OfferingStatus; className?: string }) {
  const promoted = status === "promoted";
  const Icon = promoted ? BadgeCheck : Lightbulb;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur-md ${
        promoted ? "border-gold/50 bg-black/50 text-gold" : "border-white/20 bg-black/50 text-bone/80"
      } ${className}`}
      title={promoted ? "Advertised in public promoter posts" : "Concept offering, not confirmed by Bibs Playhouse"}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {promoted ? "As promoted" : "Proposed offering"}
    </span>
  );
}

export function SampleBadge({ label = "Sample", className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-bone/75 backdrop-blur-md ${className}`}>
      {label}
    </span>
  );
}
