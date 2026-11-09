"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { content } from "@/config/venue";
import { EASE, FadeIn, SectionTitle } from "@/components/ui/motion";
import { StatusBadge, openBooking } from "./shared";

/** "The Experience": five photo cards, each labeled promoted vs proposed. */
export default function ExperienceGrid() {
  const reduce = useReducedMotion();
  const items = content.playhouse?.experiences ?? [];
  const amenities = content.playhouse?.facts.amenities ?? [];

  return (
    <section id="experience" aria-labelledby="experience-title">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          id="experience-title"
          eyebrow="The Experience"
          title={
            <>
              More than a night out. <span className="pl-gold-text italic">A playhouse.</span>
            </>
          }
          body="Bibs Playhouse is a late-night entertainment destination in Little Rock. This concept shows how the venue could grow into private events, productions and premium experiences."
        />
        <FadeIn className="max-w-sm">
          <p className="eyebrow mb-3">As promoted for Bibs nights</p>
          <ul className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <li key={a} className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-[11px] font-semibold text-bone/85">
                {a}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((x, i) => (
          <motion.button
            key={x.id}
            type="button"
            onClick={() => openBooking(x.bookingType)}
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: EASE }}
            className={`group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 p-6 text-left transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_30px_80px_-30px_rgba(106,13,173,0.9)] ${
              i < 2 ? "lg:col-span-3 lg:min-h-[28rem]" : i === 4 ? "sm:col-span-2 lg:col-span-2" : "lg:col-span-2"
            }`}
          >
            <Image
              src={x.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
              className="-z-10 object-cover transition duration-[1.4s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/55 to-black/10" aria-hidden />
            <div className="absolute inset-0 -z-10 opacity-0 mix-blend-color transition duration-700 group-hover:opacity-100" style={{ background: "color-mix(in srgb, var(--accent-2) 45%, transparent)" }} aria-hidden />
            <StatusBadge status={x.status} className="absolute left-5 top-5" />
            <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-bone backdrop-blur transition group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
            <p className="font-display text-3xl leading-tight text-bone sm:text-4xl">{x.title}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/70">{x.blurb}</p>
            <span className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-gold">Inquire →</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
