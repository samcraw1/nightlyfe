"use client";

import Image from "next/image";
import { Cake, Crown, GlassWater, Sparkles, Users } from "lucide-react";
import { content } from "@/config/venue";
import { FadeIn } from "@/components/ui/motion";
import { BookButton, StatusBadge } from "./shared";

const ICONS = [Crown, GlassWater, Cake, Users, Sparkles];

/** "MAKE EVERY NIGHT EXCLUSIVE." VIP and private experiences (proposed). */
export default function VipSection() {
  const vip = content.playhouse?.vip;
  if (!vip) return null;
  return (
    <section id="vip" aria-labelledby="vip-title" className="relative overflow-hidden rounded-[2.5rem] border border-gold/20">
      <Image src={vip.image} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/40" aria-hidden />
      <div className="absolute inset-0 -z-10 mix-blend-color" style={{ background: "color-mix(in srgb, var(--accent-2) 30%, transparent)" }} aria-hidden />
      <div className="pl-grain" aria-hidden />

      <div className="relative grid gap-12 p-6 py-14 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:p-16">
        <FadeIn>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <Crown className="h-4 w-4" aria-hidden />
            VIP &amp; Private Experiences
          </p>
          <h2 id="vip-title" className="font-display text-5xl font-medium leading-[0.95] text-bone sm:text-7xl">
            Make every night <span className="pl-gold-text italic">exclusive.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-bone/70 sm:text-lg">
            Sections are already promoted for Bibs nights. This concept adds hosted packages for celebrations, groups and occasions, with pricing set by management.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookButton type="private-event">
              <Crown className="h-4 w-4" aria-hidden />
              Request VIP Experience
            </BookButton>
            <StatusBadge status="proposed" />
          </div>
        </FadeIn>

        <div className="grid gap-3 sm:grid-cols-2">
          {vip.tiles.map((t, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <FadeIn key={t.title} delay={i * 0.06} className={i === 0 ? "sm:col-span-2" : ""}>
                <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-md transition hover:border-gold/40 hover:bg-black/60">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-xl text-bone">{t.title}</span>
                      {i === 0 ? <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gold">Sections · as promoted</span> : null}
                    </span>
                    <span className="mt-1 block text-sm text-bone/60">{t.blurb}</span>
                  </span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
