"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Clapperboard } from "lucide-react";
import { content } from "@/config/venue";
import { EASE, FadeIn } from "@/components/ui/motion";
import { BookButton, StatusBadge } from "./shared";

/** "YOUR VISION. OUR STAGE." Cinematic asymmetric gallery of production concepts. */
export default function ProductionShowcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);
  const data = content.playhouse?.production;
  if (!data) return null;
  const [lead, ...rest] = data.tiles;

  return (
    <section
      ref={ref}
      id="production"
      aria-labelledby="production-title"
      className="relative -mx-5 overflow-hidden rounded-none border-y border-white/5 bg-black px-5 py-20 sm:-mx-8 sm:rounded-[2.5rem] sm:border sm:px-10 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-40 top-0 h-[40rem] w-[40rem] rounded-full bg-accent-2/25 blur-[140px]" aria-hidden />
      <div className="pl-grain" aria-hidden />

      <div className="relative grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <FadeIn>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <Clapperboard className="h-4 w-4" aria-hidden />
            Music Video &amp; Photoshoot Production
          </p>
          <h2 id="production-title" className="font-display text-5xl font-medium leading-[0.95] text-bone sm:text-7xl">
            Your vision.
            <br />
            <span className="pl-gold-text italic">Our stage.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-bone/65 sm:text-lg">
            A club built for the camera: dramatic light, deep shadow and a room that already looks like the video. Proposed production services for artists, directors, photographers and brands.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookButton type="music-video">Book a Production</BookButton>
            <BookButton type="photoshoot" variant="ghost">
              Book a Photoshoot
            </BookButton>
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-bone/40">{data.note}</p>
        </FadeIn>

        <motion.div style={{ y: drift }} className="grid grid-cols-2 gap-3 sm:gap-4">
          <motion.figure
            initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            className="group relative col-span-2 aspect-[16/10] overflow-hidden rounded-3xl border border-white/10"
          >
            <Image src={lead.image} alt="" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover transition duration-[1.6s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" aria-hidden />
            <StatusBadge status="proposed" className="absolute left-4 top-4" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p className="font-display text-2xl text-bone sm:text-3xl">{lead.title}</p>
              <p className="mt-1 max-w-md text-sm text-bone/70">{lead.blurb}</p>
            </figcaption>
          </motion.figure>
          {rest.map((t, i) => (
            <FadeIn key={t.title} delay={0.08 * i} className={i === rest.length - 1 && rest.length % 2 ? "col-span-2" : ""}>
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 sm:aspect-[4/4.2]">
                <Image src={t.image} alt="" fill sizes="(min-width:1024px) 28vw, 50vw" className="object-cover transition duration-[1.6s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" aria-hidden />
                <div className="absolute inset-0 opacity-0 mix-blend-color transition duration-700 group-hover:opacity-100" style={{ background: "color-mix(in srgb, var(--accent-2) 50%, transparent)" }} aria-hidden />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="font-display text-lg leading-tight text-bone sm:text-2xl">{t.title}</p>
                  <p className="mt-1 hidden text-xs leading-relaxed text-bone/65 sm:block">{t.blurb}</p>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
