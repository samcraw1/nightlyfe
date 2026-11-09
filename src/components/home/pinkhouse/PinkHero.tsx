"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Crown, Sparkles } from "lucide-react";
import { venue } from "@/config/venue";
import { useClubOverrides } from "@/lib/club-overrides";
import { EASE } from "@/components/ui/motion";

/**
 * Full-screen hero: photo plate with slow parallax, sweeping pink light
 * beams, neon script wordmark, editorial headline, and a "Coming Soon"
 * indicator (no date — none has been announced).
 */
export default function PinkHero() {
  const reduce = useReducedMotion();
  const { overrides } = useClubOverrides();
  const { scrollY } = useScroll();
  const plateY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 140]);
  const fade = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0.2]);

  const body = overrides.heroBody || venue.home.heroBody;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      {/* plate */}
      <motion.div className="absolute inset-0" style={{ y: plateY }} aria-hidden>
        <Image
          src="/clubs/pinkhouse-memphis/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_20%,rgba(8,8,8,0.85)_75%)]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-ink" aria-hidden />
      <div
        className="absolute inset-0 mix-blend-color"
        style={{ background: "color-mix(in srgb, var(--gold) 28%, transparent)" }}
        aria-hidden
      />

      {/* light sweeps */}
      {!reduce ? (
        <div className="absolute inset-0" aria-hidden>
          {[
            { left: "8%", rotate: [-18, 10], dur: 9 },
            { left: "52%", rotate: [14, -12], dur: 11 },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="ph-beam"
              style={{ left: b.left }}
              initial={{ rotate: b.rotate[0], opacity: 0 }}
              animate={{ rotate: b.rotate, opacity: [0, 0.9, 0.6] }}
              transition={{ duration: b.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: i * 1.2 }}
            />
          ))}
        </div>
      ) : null}
      <div className="ph-grain" aria-hidden />

      <motion.div
        style={{ opacity: fade }}
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pb-28 pt-16 text-center sm:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-black/50 px-4 py-2 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-bright opacity-70 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-bone">Coming Soon</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
          className="ph-wordmark ph-flicker font-script text-[5.5rem] leading-[0.8] sm:text-[9rem] lg:text-[11rem]"
          aria-hidden
        >
          {venue.theme.wordmark}
        </motion.p>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 24, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.22em" }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.45 }}
          className="mt-4 pl-[0.22em] font-display text-[1.65rem] font-semibold uppercase text-bone sm:text-5xl lg:text-6xl"
        >
          {venue.home.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.75 }}
          className="ph-silver-text mt-5 pl-[0.3em] text-[10px] font-semibold uppercase tracking-[0.3em] sm:text-sm"
        >
          Houston&rsquo;s Energy.<br className="sm:hidden" /> Memphis&rsquo; Next Experience.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.95 }}
          className="mt-6 max-w-md font-display text-lg italic text-bone/80 sm:text-2xl"
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.15 }}
          className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <a
            href="#experience"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Explore the Experience
          </a>
          <a
            href="#vip"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-bone backdrop-blur-md transition hover:border-gold-bright hover:text-gold-bright active:scale-[0.98]"
          >
            <Crown className="h-4 w-4" aria-hidden />
            VIP Inquiries
          </a>
        </motion.div>
      </motion.div>

      {overrides.announcement ? (
        <p className="relative mx-auto mb-6 w-fit max-w-[90%] rounded-full border border-gold/40 bg-black/60 px-4 py-2 text-center text-xs text-bone backdrop-blur">
          {overrides.announcement}
        </p>
      ) : null}

      <a
        href="#experience"
        className="relative mx-auto mb-8 flex flex-col items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.4em] text-bone/50 transition hover:text-gold-bright"
        aria-label="Scroll to The Experience"
      >
        Scroll
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </a>
    </section>
  );
}
