"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { locationName, useLocations, useNetworkPerformers } from "@/lib/network-store";
import MockImage from "@/components/ui/MockImage";
import { InstagramIcon } from "@/components/layout/icons";
import { EASE } from "@/components/ui/motion";
import type { Entertainer } from "@/types";
import { DemoTag } from "./bits";

/**
 * Reusable entertainer profile cards. Network-wide by default, or one club's
 * roster via `club`. Profiles are demo data until real performers are added.
 */
export default function PerformerGrid({ club, limit = 8 }: { club?: string; limit?: number }) {
  const reduce = useReducedMotion();
  const list = useNetworkPerformers()
    .filter((e) => !club || e.locationSlug === club)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);

  if (!list.length) {
    return <p className="rounded-2xl border border-white/10 p-6 text-sm text-bone/55">No profiles assigned to this club yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((e, i) => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: EASE }}
        >
          <PerformerCard e={e} />
        </motion.div>
      ))}
    </div>
  );
}

export function PerformerCard({ e }: { e: Entertainer }) {
  const loc = useLocations().find((l) => l.slug === e.locationSlug);
  const ig = e.socials?.instagram;
  return (
    <Link
      // Profiles added in /admin-demo have no static page; send them to their club.
      href={e.id.startsWith("admin-") ? `/clubs/${e.locationSlug ?? ""}` : `/girls/${e.id}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 transition hover:border-gold/50"
    >
      <MockImage hue={e.hue} label={e.name} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
      <div
        className="absolute inset-0 opacity-70 mix-blend-screen"
        style={{ background: `radial-gradient(70% 50% at 50% 0%, ${loc?.accent ?? "#d4af37"}55, transparent 70%)` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
      <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
        <DemoTag>Demo profile</DemoTag>
        {e.featured ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-ink" title="Featured">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
            <span className="sr-only">Featured</span>
          </span>
        ) : null}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-display text-2xl italic text-bone">{e.name}</p>
        <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: loc?.accent ?? "var(--gold)" }}>
          <MapPin className="h-3 w-3" aria-hidden /> {locationName(e.locationSlug)}
        </p>
        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-bone/45">
          <span className="flex items-center gap-1.5" title={ig ? `@${ig}` : "Social links added once the performer is confirmed"}>
            <InstagramIcon className="h-3.5 w-3.5" />
            {ig ? `@${ig}` : "Pending"}
          </span>
          <ArrowUpRight className="h-4 w-4 text-bone/40 transition group-hover:text-gold" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
