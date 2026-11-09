"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, ExternalLink, Repeat } from "lucide-react";
import type { PlayhouseEvent } from "@/clubs/types";
import { usePlayhouseEvents } from "@/lib/venue-dashboard-store";
import { EASE, SectionTitle } from "@/components/ui/motion";
import { BookButton, SampleBadge } from "./shared";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "weekly", label: "Weekly" },
  { id: "promotion", label: "Promotions" },
] as const;

function fmt(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    long: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
  };
}

/** Reusable event card: verified items cite their source; sample items say so. */
export function PlayhouseEventCard({ event, past }: { event: PlayhouseEvent; past?: boolean }) {
  const date = event.date ? fmt(event.date) : null;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-2/80 transition duration-500 hover:-translate-y-1 hover:border-gold/40">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={event.image} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className={`object-cover transition duration-[1.4s] group-hover:scale-105 ${past ? "grayscale-[60%]" : ""}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-black/10 to-transparent" aria-hidden />
        {date ? (
          <div className="absolute left-4 top-4 flex flex-col items-center rounded-2xl border border-gold/40 bg-black/70 px-3 py-2 leading-none backdrop-blur-md">
            <span className="text-[9px] font-bold tracking-[0.2em] text-gold">{date.month}</span>
            <span className="mt-1 font-display text-2xl text-bone">{date.day}</span>
          </div>
        ) : (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold backdrop-blur-md">
            <Repeat className="h-3 w-3" aria-hidden />
            {event.recurring}
          </div>
        )}
        <div className="absolute right-4 top-4 flex flex-col items-end gap-1.5">
          {event.source === "verified" ? (
            <span className="rounded-full border border-gold/50 bg-black/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-gold backdrop-blur-md">Posted by promoter</span>
          ) : (
            <SampleBadge label="Sample · Demo" />
          )}
          {past ? <SampleBadge label="Past event" /> : null}
          {event.featured ? <span className="rounded-full bg-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink">Featured</span> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-2xl leading-tight text-bone">{event.title}</h3>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-bone/55">
          {date ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden />
              {date.long}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gold" aria-hidden />
            {event.time}
          </span>
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-bone/70">{event.description}</p>
        {event.tags?.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {event.tags.map((t) => (
              <li key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-bone/70">
                {t}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
          {event.sourceUrl ? (
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-bone/55 hover:text-gold">
              Source
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.16em] text-bone/35">Demonstration listing</span>
          )}
          {past ? null : (
            <BookButton type="general" variant="text">
              Inquire →
            </BookButton>
          )}
        </div>
      </div>
    </article>
  );
}

/** Events & Nightlife: tabs for upcoming / weekly / promotions, plus recently posted verified nights. */
export default function EventsSection() {
  const events = usePlayhouseEvents();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("upcoming");
  const today = new Date().toISOString().slice(0, 10);

  const { list, past } = useMemo(() => {
    const isPast = (e: PlayhouseEvent) => !!e.date && e.date < today;
    const list = events
      .filter((e) => e.kind === tab && !isPast(e))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || (a.date ?? "").localeCompare(b.date ?? ""));
    const past = events.filter((e) => e.source === "verified" && isPast(e)).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    return { list, past };
  }, [events, tab, today]);

  return (
    <section id="events" aria-labelledby="events-title">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          id="events-title"
          eyebrow="Events & Nightlife"
          title={
            <>
              Every night is <span className="pl-gold-text italic">a show.</span>
            </>
          }
          body="Upcoming nights, weekly entertainment, promotions and special appearances. Promoter-posted nights link to their source; everything else is sample content showing how listings would look."
        />
        <div role="tablist" aria-label="Event type" className="flex gap-1 self-start rounded-full border border-white/10 bg-white/[0.03] p-1 lg:self-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`relative rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition sm:px-5 ${tab === t.id ? "text-ink" : "text-bone/65 hover:text-bone"}`}
            >
              {tab === t.id ? <motion.span layoutId="ev-tab" className="absolute inset-0 rounded-full bg-gold" transition={{ duration: 0.4, ease: EASE }} /> : null}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {list.map((e) => (
          <PlayhouseEventCard key={e.id} event={e} />
        ))}
        {list.length === 0 ? <p className="text-sm text-bone/50">Nothing listed here yet.</p> : null}
      </motion.div>

      {past.length ? (
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-4">
            <p className="eyebrow">Recently posted at Bibs</p>
            <span className="pl-rule flex-1" aria-hidden />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <PlayhouseEventCard key={e.id} event={e} past />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
