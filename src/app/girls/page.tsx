"use client";

import { useState } from "react";
import { entertainers } from "@/data/entertainers";
import PageHeader from "@/components/ui/PageHeader";
import GirlCard from "@/components/girls/GirlCard";
import { venue } from "@/config/venue";
import { applyLineup, useClubOverrides } from "@/lib/club-overrides";

type Tab = "tonight" | "all" | "featured";

const tabs: { id: Tab; label: string }[] = [
  { id: "tonight", label: "Working Tonight" },
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
];

export default function GirlsPage() {
  const [tab, setTab] = useState<Tab>("tonight");

  const { overrides } = useClubOverrides();
  const filtered = applyLineup(entertainers, overrides).filter((e) => {
    if (tab === "tonight") return e.workingTonight;
    if (tab === "featured") return e.featured;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="The roster"
        title={`Meet the ${venue.labels.performers.replace(/^The /i, "")}`}
        description={
          venue.demo.fictionalPerformers
            ? "Sample roster for this concept demo. Every name and profile here is fictional — real performer profiles would be added only with each entertainer's consent."
            : `World-class entertainers, every night of the week. Favorite the ones you love${venue.features.messaging ? " and message them directly" : ""}.`
        }
      />

      <div
        role="tablist"
        aria-label="Filter entertainers"
        className="mb-8 flex gap-2 overflow-x-auto no-scrollbar"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition ${
              tab === t.id
                ? "bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink"
                : "border border-white/10 text-bone/60 hover:border-gold/40 hover:text-gold"
            }`}
          >
            {t.label}
            {t.id === "tonight" ? (
              <span className="ml-2 opacity-70">
                {entertainers.filter((e) => e.workingTonight).length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {filtered.map((girl) => (
          <GirlCard key={girl.id} girl={girl} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">
          No one matches this filter right now — check the full roster.
        </p>
      ) : null}
    </div>
  );
}
