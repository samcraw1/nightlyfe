"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Bell, Eye, Radio, ShieldCheck, Smartphone } from "lucide-react";
import { useLocations, useNetworkPerformers } from "@/lib/network-store";
import { FadeIn, SectionTitle } from "@/components/ui/motion";

/*
 * SIMULATED, PROPOSED feature. No video is streamed: each "stream" is a
 * club photo with slow camera motion and overlay UI. Pandora's does not
 * currently offer livestreaming.
 *
 * Integration point: the platform's Digital Stage (/live) already models a
 * managed performer rotation with an AWS IVS player in production mode.
 * A network build would key stages by location slug.
 */

const SCHEDULE = [
  { when: "Fri · 10:00 PM", what: "Main stage preview" },
  { when: "Sat · 12:00 AM", what: "Featured performer stream" },
  { when: "Sat · 2:00 AM", what: "After-hours live" },
];

function seededViewers(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 997;
  return 600 + h;
}

export default function NetworkLive() {
  const reduce = useReducedMotion();
  const locations = useLocations();
  const performers = useNetworkPerformers();
  const [active, setActive] = useState(locations[0]?.slug ?? "");
  const loc = locations.find((l) => l.slug === active) ?? locations[0];
  const onStage = useMemo(() => performers.find((p) => p.locationSlug === loc?.slug), [performers, loc?.slug]);
  // Simulated count: a stable per-club base plus a small random drift.
  const [drift, setDrift] = useState(0);
  const viewers = Math.max(200, seededViewers(loc?.slug ?? active) + drift);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setDrift((d) => d + Math.round((Math.random() - 0.45) * 18)), 2000);
    return () => clearInterval(t);
  }, [reduce]);

  if (!loc) return null;

  return (
    <section id="live" aria-labelledby="live-title">
      <SectionTitle
        id="live-title"
        eyebrow="Live Entertainment Preview · Proposed feature"
        title={
          <>
            Every club, <span className="lx-gold-text italic">live</span>, in one tap.
          </>
        }
        body="A concept for location-based live previews: pick a club, see the room, follow featured performers, and plan your night. This is a simulated demonstration. Pandora's does not currently offer livestreaming."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* min-w-0: the scrolling tab row must not widen the grid track on phones */}
        <FadeIn className="min-w-0">
          <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={loc.slug}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: [1.06, 1.14, 1.06] }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.6 }, scale: { duration: 16, repeat: Infinity, ease: "easeInOut" } }}
                aria-hidden
              >
                {loc.image ? <Image src={loc.image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" /> : null}
              </motion.div>
            </AnimatePresence>
            <div className="stage-lights" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85" aria-hidden />

            <div className="absolute inset-x-4 top-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-blood px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" aria-hidden /> Live
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10px] font-semibold text-bone backdrop-blur">
                  <Eye className="h-3 w-3" aria-hidden /> {viewers.toLocaleString()}
                </span>
              </div>
              <span className="rounded-md border border-gold/50 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold backdrop-blur">
                Simulated · proposed feature
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bone/60">{loc.city}</p>
                <p className="font-display text-3xl text-bone sm:text-4xl">{loc.name}</p>
                {onStage ? (
                  <p className="mt-1 text-xs text-bone/70">
                    On stage: <span className="italic text-gold">{onStage.name}</span> <span className="text-bone/40">(demo profile)</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div role="tablist" aria-label="Choose a club stream" className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {locations.map((l) => (
              <button
                key={l.slug}
                role="tab"
                aria-selected={l.slug === loc.slug}
                onClick={() => {
                  setActive(l.slug);
                  setDrift(0);
                }}
                className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                  l.slug === loc.slug ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-bone/60 hover:text-bone"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.accent }} aria-hidden />
                {l.name}
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="flex min-w-0 flex-col gap-4">
          {[
            { Icon: Radio, t: "Location-based streams", d: "Each club gets its own stage feed, selectable from any page." },
            { Icon: Smartphone, t: "Mobile playback", d: "Low-latency video in any phone browser, no app required." },
            { Icon: ShieldCheck, t: "Age-gated & consent-based", d: "21+ gate, and performers opt in to every stream." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="glass flex items-start gap-4 rounded-2xl p-5">
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-bone">{t}</p>
                <p className="mt-1 text-xs leading-relaxed text-bone/55">{d}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-white/10 p-5">
            <p className="eyebrow mb-3">Sample stream schedule · {loc.name}</p>
            <ul className="space-y-2.5">
              {SCHEDULE.map((s) => (
                <li key={s.when} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-bone/80">{s.what}</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gold">
                    <Bell className="h-3 w-3" aria-hidden /> {s.when}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/live" className="inline-flex items-center gap-2 self-start text-[11px] font-bold uppercase tracking-[0.2em] text-gold hover:text-bone">
            Open the Digital Stage demo <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
