"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkle, Star, UserPlus } from "lucide-react";
import { InstagramIcon } from "@/components/layout/icons";
import { entertainers } from "@/data/entertainers";
import { applyLineup, useClubOverrides } from "@/lib/club-overrides";
import MockImage from "@/components/ui/MockImage";
import DemoBadge from "@/components/ui/DemoBadge";
import type { Entertainer } from "@/types";
import { EASE, FadeIn, SectionTitle } from "./motion";

/**
 * Entertainer showcase. Fully data-driven from the club's roster
 * (src/clubs/<slug>/content/entertainers.ts, plus /admin "featured" toggles),
 * so management adds or removes performers without touching this component.
 */
export default function EntertainerShowcase() {
  const reduce = useReducedMotion();
  const { overrides } = useClubOverrides();
  const roster = applyLineup(entertainers, overrides);
  const featured = roster.filter((e) => e.featured);
  const spotlight = featured[0] ?? roster[0];
  const rest = roster.filter((e) => e.id !== spotlight?.id);

  if (!spotlight) return null;

  return (
    <section id="entertainers" aria-labelledby="entertainers-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionTitle
          id="entertainers-title"
          eyebrow="Featured Entertainers"
          title={
            <>
              The faces of the <span className="ph-pink-text italic">house</span>.
            </>
          }
          body="Profiles below are placeholders that show how featured talent would appear once real performers and authorized photography are provided."
        />
        <FadeIn delay={0.1}>
          <Link
            href="/girls"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone transition hover:border-gold hover:text-gold-bright"
          >
            Full roster <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </FadeIn>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_1.4fr]">
        {/* spotlight */}
        <FadeIn>
          <Link
            href={`/girls/${spotlight.id}`}
            className="group relative block h-full min-h-[30rem] overflow-hidden rounded-[1.75rem] border border-white/10"
          >
            <MockImage hue={spotlight.hue} label={spotlight.name} className="absolute inset-0 h-full w-full transition duration-[1.2s] group-hover:scale-105" />
            <div className="absolute inset-0 opacity-60 mix-blend-screen" style={{ background: `radial-gradient(70% 55% at 50% 0%, hsl(${spotlight.hue} 90% 55% / 0.35), transparent 70%)` }} aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                <Star className="h-3 w-3 fill-current" aria-hidden /> Spotlight
              </span>
              <DemoBadge kind="performer" label="Placeholder profile" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="eyebrow mb-2">Featured</p>
              <h3 className="font-display text-5xl italic text-bone sm:text-6xl">{spotlight.name}</h3>
              <p className="mt-2 max-w-sm text-sm text-bone/70">{spotlight.tagline}</p>
              <div className="mt-5 flex items-center gap-3">
                <SocialChip e={spotlight} />
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-bright">
                  View profile <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </div>
            </div>
          </Link>
        </FadeIn>

        {/* grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {rest.slice(0, 5).map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
            >
              <Link
                href={`/girls/${e.id}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 transition hover:border-gold/50"
              >
                <MockImage hue={e.hue} label={e.name} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 opacity-60 mix-blend-screen" style={{ background: `radial-gradient(70% 55% at 50% 0%, hsl(${e.hue} 90% 55% / 0.35), transparent 70%)` }} aria-hidden />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <DemoBadge kind="performer" label="Placeholder" className="absolute left-3 top-3" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl italic text-bone">{e.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-bone/50">Stage name</p>
                  </div>
                  <SocialChip e={e} small />
                </div>
              </Link>
            </motion.div>
          ))}
          <FadeIn delay={0.4}>
            <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gold/35 bg-gold/[0.04] p-4 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold-bright">
                <UserPlus className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-semibold text-bone">Add a performer</p>
              <p className="text-[11px] leading-relaxed text-bone/50">
                Management adds or removes profiles from one roster file or the admin dashboard.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/** Instagram badge when a verified handle exists; otherwise a muted "pending" chip. */
function SocialChip({ e, small }: { e: Entertainer; small?: boolean }) {
  const handle = e.socials?.instagram;
  const size = small ? "h-8 w-8" : "h-10 w-10";
  if (handle) {
    // Rendered inside a card link, so this is a label, not a second link;
    // the profile page carries the real social links.
    return (
      <span
        title={`@${handle}`}
        className={`flex ${size} items-center justify-center rounded-full border border-white/20 bg-black/40 text-bone backdrop-blur`}
      >
        <InstagramIcon className="h-4 w-4" />
        <span className="sr-only">On Instagram as @{handle}</span>
      </span>
    );
  }
  return (
    <span
      title="Social link added when the performer is confirmed"
      className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 text-bone/35 backdrop-blur`}
    >
      {small ? <Sparkle className="h-3.5 w-3.5" aria-hidden /> : <InstagramIcon className="h-4 w-4" />}
      <span className="sr-only">Social link pending</span>
    </span>
  );
}
