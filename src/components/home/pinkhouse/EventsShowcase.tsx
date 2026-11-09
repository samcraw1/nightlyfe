"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock, Crown } from "lucide-react";
import { events, formatEventDate } from "@/data/events";
import { applyEvents, useClubOverrides } from "@/lib/club-overrides";
import DemoBadge from "@/components/ui/DemoBadge";
import { EASE, FadeIn, SectionTitle } from "@/components/ui/motion";

const FLYERS = [
  "/clubs/pinkhouse-memphis/truss.webp",
  "/clubs/pinkhouse-memphis/beams.webp",
  "/clubs/pinkhouse-memphis/crowd.webp",
  "/clubs/pinkhouse-memphis/confetti.webp",
];

export default function EventsShowcase() {
  const reduce = useReducedMotion();
  const { overrides } = useClubOverrides();
  const list = applyEvents(events, overrides).filter((e) => !e.hidden);
  const featured = list.find((e) => e.featured) ?? list[0];
  const others = list.filter((e) => e.id !== featured?.id);

  if (!featured) return null;

  return (
    <section id="events" aria-labelledby="events-title">
      <SectionTitle
        id="events-title"
        eyebrow="Events & Promotions"
        title={
          <>
            Nights worth <span className="ph-pink-text italic">planning</span> around.
          </>
        }
        body="Demo events show how announcements, flyers, and VIP inquiries would work. Pinkhouse Memphis hasn't announced any events or an opening date yet."
      />

      {/* featured */}
      <FadeIn className="mt-12">
        <article className="group relative grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-2 lg:grid-cols-[1.25fr_1fr]">
          <div className="relative aspect-[16/11] lg:aspect-auto lg:min-h-[26rem]">
            <Image
              src={FLYERS[0]}
              alt=""
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition duration-[1.4s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink-2" />
            <div className="absolute left-5 top-5 flex gap-2">
              <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">Featured</span>
              <DemoBadge kind="sample" label="Demo event" />
            </div>
            <p className="ph-wordmark font-script absolute bottom-6 left-6 text-6xl sm:text-7xl" aria-hidden>
              {featured.title.split(" ")[0]}
            </p>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <EventMeta date={featured.date} doors={featured.doors} />
            <h3 className="mt-4 font-display text-4xl text-bone sm:text-5xl">{featured.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-bone/65">{featured.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#vip"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white"
              >
                <Crown className="h-4 w-4" aria-hidden /> VIP Inquiry
              </a>
              <Link
                href={`/events/${featured.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone hover:border-gold hover:text-gold-bright"
              >
                Details <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      </FadeIn>

      {/* others */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((e, i) => (
          <motion.article
            key={e.id}
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-2 transition hover:border-gold/40"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={FLYERS[(i + 1) % FLYERS.length]}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 opacity-50 mix-blend-color" style={{ background: "var(--gold)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-2 to-transparent" />
              <DemoBadge kind="sample" label="Demo event" className="absolute left-4 top-4" />
            </div>
            <div className="p-5 sm:p-6">
              <EventMeta date={e.date} doors={e.doors} />
              <h3 className="mt-3 font-display text-2xl text-bone">{e.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bone/55">{e.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <a href="#vip" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-bright hover:text-bone">
                  <Crown className="h-3.5 w-3.5" aria-hidden /> VIP Inquiry
                </a>
                <Link href={`/events/${e.id}`} aria-label={`${e.title} details`} className="text-bone/50 hover:text-gold-bright">
                  <ArrowUpRight className="h-5 w-5" aria-hidden />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function EventMeta({ date, doors }: { date: string; doors: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/60">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5 text-gold-bright" aria-hidden />
        {formatEventDate(date)} <span className="text-bone/35">(sample)</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-gold-bright" aria-hidden />
        Doors {doors}
      </span>
    </p>
  );
}
