"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Plus } from "lucide-react";
import { useLocations } from "@/lib/network-store";
import { EASE, SectionTitle } from "@/components/ui/motion";
import { VerificationBadge, accentStyle } from "./bits";

/** All clubs as cards. Data-driven from `venue.locations`. */
export default function ClubShowcase({ heading = true }: { heading?: boolean }) {
  const reduce = useReducedMotion();
  const locations = useLocations();

  return (
    <section id="clubs" aria-labelledby={heading ? "clubs-title" : undefined}>
      {heading ? (
        <SectionTitle
          id="clubs-title"
          eyebrow="The Clubs"
          title={
            <>
              Seven rooms. <span className="lx-gold-text italic">One standard.</span>
            </>
          }
          body="From Dallas to Fort Worth and the Mid-Cities in between, every Pandora's club has its own character and the same night-out standard."
        />
      ) : null}

      <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${heading ? "mt-12" : ""}`}>
        {locations.map((l, i) => (
          <motion.article
            key={l.slug}
            initial={{ opacity: 0, y: reduce ? 0 : 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE }}
            style={accentStyle(l)}
            className={`lx-card group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-2 ${
              i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
            }`}
          >
            <Link href={`/clubs/${l.slug}`} className="block">
              <div className={`relative ${i === 0 ? "aspect-[16/10] lg:aspect-[16/8]" : "aspect-[4/3]"} overflow-hidden`}>
                {l.image ? (
                  <Image
                    src={l.image}
                    alt=""
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                    className="object-cover transition duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-black/30 to-transparent" />
                <div className="absolute left-4 top-4">
                  <VerificationBadge level={l.verification} />
                </div>
              </div>
              <div className="relative p-5 sm:p-6">
                <span className="lx-accent-bar absolute inset-x-6 top-0 h-px" aria-hidden />
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone/55">
                  <MapPin className="h-3.5 w-3.5" style={{ color: "var(--loc-accent)" }} aria-hidden />
                  {l.city}
                </p>
                <h3 className="mt-2 font-display text-3xl text-bone">{l.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bone/60">{l.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                  View Club
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
        <Link
          href="/admin-demo"
          className="group flex min-h-[16rem] flex-col items-start justify-end rounded-[1.5rem] border border-dashed border-gold/30 bg-gold/[0.03] p-6 transition hover:border-gold/60"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
            <Plus className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-5 font-display text-2xl text-bone">Add a location</p>
          <p className="mt-1 text-sm leading-relaxed text-bone/55">
            Every club page is generated from one location record. Add, edit, or retire a club from the management dashboard.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            Open dashboard demo <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </Link>
      </div>
    </section>
  );
}
