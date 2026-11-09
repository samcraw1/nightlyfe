"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarHeart, Crown, Gem, Music2, Sparkles, type LucideIcon } from "lucide-react";
import { EASE, FadeIn, SectionTitle } from "./motion";

interface Pillar {
  title: string;
  blurb: string;
  image: string;
  Icon: LucideIcon;
}

/*
 * Aspirational copy only. Nothing here claims a specific service, amenity,
 * or policy that Pinkhouse hasn't announced.
 */
const pillars: Pillar[] = [
  {
    title: "Premium Nightlife",
    blurb: "The night doesn't end when everyone else's does. Pinkhouse is built for after dark.",
    image: "/clubs/pinkhouse-memphis/crowd.webp",
    Icon: Sparkles,
  },
  {
    title: "VIP Experiences",
    blurb: "Your section, your people, your night. The VIP treatment, Pinkhouse style.",
    image: "/clubs/pinkhouse-memphis/champagne.webp",
    Icon: Crown,
  },
  {
    title: "Music & Entertainment",
    blurb: "The sound, the lights, the energy that put Pinkhouse on the map in Houston.",
    image: "/clubs/pinkhouse-memphis/dj.webp",
    Icon: Music2,
  },
  {
    title: "Upscale Atmosphere",
    blurb: "Pink light, dark rooms, and a room full of people who came to be seen.",
    image: "/clubs/pinkhouse-memphis/lounge.webp",
    Icon: Gem,
  },
  {
    title: "Exclusive Events",
    blurb: "Nights you'll hear about the next day. Follow along so you're on the list first.",
    image: "/clubs/pinkhouse-memphis/confetti.webp",
    Icon: CalendarHeart,
  },
];

export default function Experience() {
  const reduce = useReducedMotion();
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative">
      <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
        <SectionTitle
          id="experience-title"
          eyebrow="The Experience"
          title={
            <>
              Houston&rsquo;s <span className="ph-pink-text italic">#1 afterhours</span> is coming to Memphis.
            </>
          }
        />
        <FadeIn delay={0.1}>
          <p className="text-base leading-relaxed text-bone/65 sm:text-lg">
            Pinkhouse earned its name after dark in Houston. Now the same energy is heading up I&#8209;40. One house, one
            color, one standard for the night. Memphis, get ready.
          </p>
        </FadeIn>
      </div>

      <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {pillars.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
            whileHover={reduce ? undefined : { y: -6 }}
            className={`group relative w-[78%] flex-shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-2 sm:w-auto ${
              i < 2 ? "lg:col-span-3" : "lg:col-span-2"
            }`}
          >
            <div className={`relative ${i < 2 ? "aspect-[4/5] sm:aspect-[16/11]" : "aspect-[4/5]"}`}>
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 80vw"
                className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div
                className="absolute inset-0 opacity-50 mix-blend-color transition-opacity duration-700 group-hover:opacity-70"
                style={{ background: "var(--gold)" }}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-gold-bright backdrop-blur">
                <p.Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
              <h3 className="font-display text-2xl text-bone sm:text-3xl">{p.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone/70">{p.blurb}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
