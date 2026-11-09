"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Bell, Eye, Radio, ShieldCheck, Smartphone, Volume2, VolumeX } from "lucide-react";
import { entertainers } from "@/data/entertainers";
import { venue } from "@/config/venue";
import { FadeIn, SectionTitle } from "./motion";

/*
 * SIMULATED live preview. No video is streamed: the "player" is a photo
 * with slow camera motion plus overlay UI. It demonstrates what a Pinkhouse
 * live experience could look like. Pinkhouse does not currently stream.
 *
 * The real integration point is the platform's Digital Stage (/live), which
 * already supports a managed performer rotation and an AWS IVS player in
 * production mode (DIGITAL_STAGE_MODE=production).
 */

const SCHEDULE = [
  { when: "Fri · 11:30 PM", title: "Main room warm-up", note: "Sample slot" },
  { when: "Sat · 12:30 AM", title: "Featured performer set", note: "Sample slot" },
  { when: "Sat · 2:00 AM", title: "Afterhours peak", note: "Sample slot" },
];

export default function LiveExperience() {
  const reduce = useReducedMotion();
  const [viewers, setViewers] = useState(1284);
  const [muted, setMuted] = useState(true);
  const lineup = entertainers.slice(0, 3);
  const [onStage, setOnStage] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setViewers((v) => Math.max(900, v + Math.round((Math.random() - 0.45) * 24)));
    }, 2200);
    const r = setInterval(() => setOnStage((i) => (i + 1) % Math.max(1, lineup.length)), 6000);
    return () => {
      clearInterval(t);
      clearInterval(r);
    };
  }, [reduce, lineup.length]);

  const performer = lineup[onStage];

  return (
    <section id="live" aria-labelledby="live-title" className="relative">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_auto]">
        <div>
          <SectionTitle
            id="live-title"
            eyebrow="Live Experience · Concept"
            title={
              <>
                The house, <span className="ph-pink-text italic">live</span> from anywhere.
              </>
            }
            body="A look at what a Pinkhouse live experience could be: featured performer streams, a live stage preview, and a schedule fans can follow. This is a simulated demonstration. Pinkhouse does not currently offer livestreaming."
          />

          <FadeIn delay={0.1} className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { Icon: Radio, t: "Live stage preview", d: "A managed performer rotation, built in." },
              { Icon: Smartphone, t: "Phone-first player", d: "Low-latency video in any mobile browser." },
              { Icon: ShieldCheck, t: "Age-gated & consent-based", d: "21+ gate; performers opt in to every stream." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="glass rounded-2xl p-5">
                <Icon className="h-5 w-5 text-gold-bright" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-bone">{t}</p>
                <p className="mt-1 text-xs leading-relaxed text-bone/55">{d}</p>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.2} className="mt-8">
            <p className="eyebrow mb-4">Upcoming streams · Sample schedule</p>
            <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
              {SCHEDULE.map((s) => (
                <li key={s.when} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright">{s.when}</p>
                    <p className="mt-0.5 text-sm text-bone">{s.title}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-bone/60">
                    <Bell className="h-3 w-3" aria-hidden /> {s.note}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>

          {venue.features.liveStream ? (
            <FadeIn delay={0.25} className="mt-8">
              <Link
                href="/live"
                className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-bright transition hover:bg-gold hover:text-white"
              >
                Open the Digital Stage demo <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </FadeIn>
          ) : null}
        </div>

        {/* simulated phone player */}
        <FadeIn delay={0.1} className="mx-auto w-full max-w-[20rem] sm:max-w-[22rem]">
          <div className="ph-glow relative aspect-[9/19] overflow-hidden rounded-[2.75rem] border-[6px] border-[#1d1b20] bg-black shadow-2xl">
            <motion.div
              className="absolute inset-0"
              animate={reduce ? undefined : { scale: [1.08, 1.18, 1.08], x: ["0%", "-4%", "0%"] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <Image src="/clubs/pinkhouse-memphis/beams.webp" alt="" fill sizes="352px" className="object-cover" />
            </motion.div>
            <div className="stage-lights" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" aria-hidden />

            {/* notch */}
            <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden />

            {/* top bar */}
            <div className="absolute inset-x-0 top-10 flex items-center justify-between px-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-blood px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" aria-hidden />
                Live
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold text-bone backdrop-blur" aria-live="off">
                <Eye className="h-3 w-3" aria-hidden />
                {viewers.toLocaleString()}
              </span>
            </div>
            <div className="absolute inset-x-4 top-[4.6rem] rounded-lg border border-gold/50 bg-black/60 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-bright backdrop-blur">
              Simulated demo · Not a real stream
            </div>

            {/* bottom */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              {performer ? (
                <motion.div
                  key={performer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bone/60">On stage now</p>
                  <p className="font-display text-3xl italic text-bone">{performer.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold-bright">Placeholder profile</p>
                </motion.div>
              ) : null}
              <div className="mt-3 flex gap-1" aria-hidden>
                {lineup.map((e, i) => (
                  <span key={e.id} className={`h-0.5 flex-1 rounded-full ${i === onStage ? "bg-gold-bright" : "bg-white/25"}`} />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-bone/50">Main room</span>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute (simulated)" : "Mute (simulated)"}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-bone backdrop-blur hover:bg-white/20"
                >
                  {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
                </button>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-bone/45">Simulated preview. No video is streamed.</p>
        </FadeIn>
      </div>
    </section>
  );
}
