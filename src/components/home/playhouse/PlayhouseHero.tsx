"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, CalendarCheck, Sparkles } from "lucide-react";
import { venue } from "@/config/venue";
import { EASE } from "@/components/ui/motion";
import { openBooking } from "./shared";

/**
 * Full-screen hero: purple-lit photo plate with slow parallax and zoom,
 * sweeping violet light, gold-foil wordmark and two calls to action.
 */
export default function PlayhouseHero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const plateY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 160]);
  const fade = useTransform(scrollY, [0, 520], [1, reduce ? 1 : 0.15]);

  return (
    <section aria-labelledby="hero-title" className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <motion.div className="absolute inset-0" style={{ y: plateY }} aria-hidden>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: reduce ? 1 : 1.18 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 2.8, ease: EASE }}
        >
          <Image src="/clubs/bibs-playhouse/hero.webp" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-75" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_35%,transparent_15%,rgba(8,8,8,0.88)_78%)]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/5 to-ink" aria-hidden />
      <div className="absolute inset-0 mix-blend-color" style={{ background: "color-mix(in srgb, var(--accent-2) 32%, transparent)" }} aria-hidden />

      {!reduce ? (
        <div className="absolute inset-0" aria-hidden>
          {[
            { left: "4%", rotate: [-20, 8], dur: 10 },
            { left: "48%", rotate: [16, -14], dur: 12 },
            { left: "72%", rotate: [-8, 18], dur: 14 },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="pl-beam"
              style={{ left: b.left }}
              initial={{ rotate: b.rotate[0], opacity: 0 }}
              animate={{ rotate: b.rotate, opacity: [0, 0.85, 0.55] }}
              transition={{ duration: b.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: i * 1.1 }}
            />
          ))}
        </div>
      ) : null}
      <div className="pl-grain" aria-hidden />

      <motion.div
        style={{ opacity: fade }}
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pb-24 pt-14 text-center sm:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold/40 bg-black/55 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.38em] text-bone backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
          {venue.home.eyebrow}
        </motion.p>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)", letterSpacing: "0.32em" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", letterSpacing: "0.12em" }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.1 }}
          className="pl-gold-text pl-[0.12em] font-script text-[2.6rem] font-semibold leading-[0.95] sm:text-7xl lg:text-[7.5rem]"
        >
          {venue.home.headline}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.6 }}
          className="pl-rule mt-7 w-40 sm:w-72"
          aria-hidden
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.75 }}
          className="pl-silver-text mt-6 pl-[0.3em] text-[11px] font-bold uppercase tracking-[0.3em] sm:text-base"
        >
          Where Entertainment Comes Alive.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.95 }}
          className="mt-6 max-w-xl font-display text-lg italic text-bone/80 sm:text-2xl"
        >
          {venue.home.heroBody}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.15 }}
          className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <a
            href="#experience"
            className="pl-btn-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-xs font-bold uppercase transition hover:brightness-110 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Explore the Experience
          </a>
          <a
            href="#book"
            onClick={(e) => {
              e.preventDefault();
              openBooking();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-bone backdrop-blur-md transition hover:border-gold hover:text-gold active:scale-[0.98]"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Booking Inquiries
          </a>
        </motion.div>
      </motion.div>

      <a
        href="#experience"
        className="relative mx-auto mb-8 flex flex-col items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-bone/50 transition hover:text-gold"
        aria-label="Scroll to The Experience"
      >
        Scroll
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </a>
    </section>
  );
}
