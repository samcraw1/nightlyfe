"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Crown, MapPinned } from "lucide-react";
import { venue } from "@/config/venue";
import { EASE } from "@/components/ui/motion";
import LocationSelector from "./LocationSelector";

export default function NetworkHero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const plateY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 120]);
  const count = venue.locations?.length ?? 0;

  return (
    <section aria-labelledby="hero-title" className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <motion.div className="absolute inset-0" style={{ y: plateY }} aria-hidden>
        <Image src="/clubs/pandoras-dfw/hero.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-75" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_35%,transparent_15%,rgba(8,8,8,0.9)_75%)]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-ink" aria-hidden />
      {!reduce ? (
        <motion.div
          className="lx-sweep"
          style={{ left: "30%" }}
          initial={{ rotate: -14, opacity: 0 }}
          animate={{ rotate: [-14, 12], opacity: [0, 0.8, 0.5] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          aria-hidden
        />
      ) : null}
      <div className="lx-grain" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pb-24 pt-16 text-center sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="eyebrow mb-6 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-gold" aria-hidden />
          {venue.home.eyebrow} · {count} clubs
          <span className="h-px w-8 bg-gold" aria-hidden />
        </motion.p>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(10px)" }}
          animate={{ opacity: 1, letterSpacing: "0.08em", filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.1 }}
          className="lx-gold-text max-w-full pl-[0.08em] font-script text-[2.05rem] font-semibold uppercase leading-tight min-[400px]:text-[2.4rem] sm:text-7xl lg:text-8xl"
        >
          {venue.home.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          className="lx-silver-text mt-6 pl-[0.3em] text-[10px] font-semibold uppercase tracking-[0.3em] sm:text-sm"
        >
          Seven Destinations.<br className="sm:hidden" /> One Unforgettable Experience.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
          className="mt-6 max-w-xl font-display text-xl italic text-bone/80 sm:text-3xl"
        >
          {venue.home.heroBody}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row"
        >
          <a
            href="#clubs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-8 py-4 text-xs font-semibold uppercase"
          >
            <MapPinned className="h-4 w-4" aria-hidden /> Explore Our Clubs
          </a>
          <a
            href="#vip"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-black/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-bone backdrop-blur-md transition hover:border-gold hover:text-gold"
          >
            <Crown className="h-4 w-4" aria-hidden /> VIP Experiences
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          className="mt-8 flex w-full justify-center"
        >
          <LocationSelector />
        </motion.div>
      </div>

      <a
        href="#clubs"
        className="relative mx-auto mb-8 flex flex-col items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.4em] text-bone/45 hover:text-gold"
        aria-label="Scroll to the clubs"
      >
        Scroll
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
          <ArrowDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </a>
    </section>
  );
}
