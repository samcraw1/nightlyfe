"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Clock, Crown, ExternalLink, MapPin, Phone, Sparkles } from "lucide-react";
import { useLocation } from "@/lib/network-store";
import { EASE, FadeIn, SectionTitle } from "@/components/ui/motion";
import { VerificationBadge, accentStyle } from "./bits";
import EventsBoard from "./EventsBoard";
import PerformerGrid from "./PerformerGrid";
import VipInquiryForm from "./VipInquiryForm";

/**
 * One club's landing page, generated from its location record (plus any
 * /admin-demo edits in this browser). Every club shares this layout; its
 * accent color, photos, and copy make it its own.
 */
export default function ClubPage({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const l = useLocation(slug);
  if (!l) return null;

  const sections = [
    ["about", "About"],
    ["events", "Events"],
    ["vip", "VIP"],
    ["gallery", "Gallery"],
    ["contact", "Contact"],
  ];

  return (
    <div style={accentStyle(l)}>
      {/* HERO */}
      <section aria-labelledby="club-title" className="relative -mt-16 flex min-h-[86svh] flex-col justify-end overflow-hidden pt-16">
        {l.image ? (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: EASE }}
            aria-hidden
          >
            <Image src={l.image} alt="" fill priority sizes="100vw" className="object-cover opacity-80" />
          </motion.div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-ink" aria-hidden />
        <div
          className="absolute inset-0 opacity-40 mix-blend-color"
          style={{ background: "var(--loc-accent)" }}
          aria-hidden
        />
        <div className="lx-grain" aria-hidden />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 sm:pb-20">
          <Link href="/clubs" className="mb-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone/60 hover:text-gold">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All clubs
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE }}>
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow flex items-center gap-2" style={{ color: "var(--loc-accent)" }}>
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {l.city}
              </p>
              <VerificationBadge level={l.verification} />
            </div>
            <h1 id="club-title" className="mt-4 font-display text-5xl leading-[0.95] text-bone sm:text-7xl lg:text-8xl">
              {l.name}
            </h1>
            <p className="mt-4 max-w-xl font-display text-xl italic text-bone/80 sm:text-2xl">{l.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#vip" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-7 py-3.5 text-xs font-semibold uppercase">
                <Crown className="h-4 w-4" aria-hidden /> VIP Inquiry
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-bone backdrop-blur hover:border-gold hover:text-gold">
                <MapPin className="h-4 w-4" aria-hidden /> Location & Hours
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <nav aria-label="On this page" className="sticky top-16 z-30 border-y border-white/5 bg-ink/85 backdrop-blur-xl [html[data-ribbon]_&]:top-[5.75rem]">
        <ul className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2 sm:px-8">
          {sections.map(([id, label]) => (
            <li key={id} className="flex-shrink-0">
              <a href={`#${id}`} className="block rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-bone/60 hover:bg-white/5 hover:text-gold">
                {label}
              </a>
            </li>
          ))}
          <li className="ml-auto hidden flex-shrink-0 sm:block">
            <span className="lx-accent-bar mt-4 block h-px w-24" aria-hidden />
          </li>
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl space-y-24 px-5 pt-16 sm:space-y-32 sm:px-8 sm:pt-24">
        {/* ABOUT */}
        <section id="about" aria-labelledby="about-title" className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionTitle id="about-title" eyebrow="About the club" title={<>{l.tagline}</>} />
            <FadeIn delay={0.1} className="mt-6 space-y-4 text-base leading-relaxed text-bone/70 sm:text-lg">
              {(l.description ?? [l.summary]).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            <div className="glass rounded-2xl p-6">
              <p className="eyebrow mb-4">Atmosphere & amenities</p>
              <ul className="grid gap-2.5">
                {(l.amenities ?? []).map((a) => (
                  <li key={a} className="flex items-center gap-3 text-sm text-bone/80">
                    <Sparkles className="h-4 w-4 flex-shrink-0" style={{ color: "var(--loc-accent)" }} aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
              {l.verification !== "official" ? (
                <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-bone/45">
                  Amenities for this club are general to the Pandora&rsquo;s network and would be confirmed with management.
                </p>
              ) : null}
            </div>
          </FadeIn>
        </section>

        {/* EVENTS */}
        <section id="events" aria-labelledby="club-events-title">
          <SectionTitle id="club-events-title" eyebrow="Events & promotions" title={<>Coming up at {l.name}</>} />
          <FadeIn className="mt-10">
            <EventsBoard club={l.slug} showFilter={false} />
          </FadeIn>
          <div className="mt-16">
            <p className="eyebrow mb-5">Featured entertainment</p>
            <PerformerGrid club={l.slug} limit={4} />
          </div>
        </section>

        {/* VIP */}
        <section id="vip" aria-labelledby="club-vip-title" className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <SectionTitle
              id="club-vip-title"
              eyebrow="VIP"
              title={
                <>
                  The VIP experience at <span className="lx-gold-text italic">{l.name}</span>
                </>
              }
              body="Tell us the date and the size of your party. A VIP host would confirm availability, packages, and pricing directly."
            />
            {l.vipPackages?.length ? (
              <FadeIn delay={0.1} className="mt-8">
                <p className="eyebrow mb-3">Packages published by the club</p>
                <ul className="space-y-2">
                  {l.vipPackages.map((p) => (
                    <li key={p} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-bone">
                      {p}
                      <span className="text-[11px] uppercase tracking-[0.16em] text-bone/40">Pricing via host</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ) : null}
          </div>
          <FadeIn delay={0.1}>
            <VipInquiryForm defaultClub={l.slug} />
          </FadeIn>
        </section>

        {/* GALLERY */}
        <section id="gallery" aria-labelledby="gallery-title">
          <SectionTitle id="gallery-title" eyebrow="Gallery" title="Inside the night" body="Atmosphere photography for this concept (Unsplash). It would be replaced with the club's own authorized photos." />
          <div className="mt-10 grid auto-rows-[12rem] grid-cols-2 gap-3 sm:auto-rows-[16rem] md:grid-cols-4">
            {(l.gallery ?? []).map((src, i) => (
              <FadeIn key={src} delay={i * 0.06} className={`relative overflow-hidden rounded-2xl border border-white/10 ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                <Image src={src} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-1000 hover:scale-105" />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" aria-labelledby="contact-title" className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionTitle id="contact-title" eyebrow="Visit" title="Location & hours" />
            <FadeIn delay={0.1} className="mt-8 space-y-6">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/50">
                  <MapPin className="h-3.5 w-3.5" aria-hidden /> Address
                </p>
                <p className="text-lg text-bone">{l.address ?? "Address to be confirmed with management."}</p>
                <VerificationBadge level={l.verification} className="mt-2" />
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/50">
                  <Clock className="h-3.5 w-3.5" aria-hidden /> Hours
                </p>
                {l.hours?.length ? (
                  <ul className="space-y-1.5">
                    {l.hours.map((h) => (
                      <li key={h.days} className="flex max-w-sm justify-between gap-6 text-bone">
                        <span className="text-bone/70">{h.days}</span>
                        <span className="text-gold">
                          {h.open} – {h.close}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-bone/60">{l.hoursNote ?? "Hours to be confirmed."}</p>
                )}
              </div>
              {l.phone ? (
                <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-bone hover:text-gold">
                  <Phone className="h-4 w-4 text-gold" aria-hidden /> {l.phone}
                </a>
              ) : null}
              {l.socials?.length ? (
                <div className="flex flex-wrap gap-2">
                  {l.socials.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone/75 hover:border-gold hover:text-gold">
                      {s.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  ))}
                </div>
              ) : null}
              {l.website ? (
                <p className="text-xs text-bone/45">
                  Current club website:{" "}
                  <a href={l.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-bone/65 underline-offset-4 hover:text-gold hover:underline">
                    {l.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </p>
              ) : null}
            </FadeIn>
          </div>
          <FadeIn delay={0.1}>
            {l.mapsQuery ? (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title={`Map of ${l.name}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(l.mapsQuery)}&output=embed`}
                  className="h-[22rem] w-full grayscale-[85%] invert-[92%] hue-rotate-180 sm:h-[26rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-ink-2 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-bone"
                >
                  Get directions <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            ) : (
              <div className="flex h-[22rem] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-8 text-center">
                <MapPin className="h-8 w-8 text-bone/30" aria-hidden />
                <p className="mt-4 font-display text-2xl text-bone">Map available once the address is confirmed</p>
                <p className="mt-2 max-w-xs text-sm text-bone/50">The map and directions appear automatically when a verified address is added in the dashboard.</p>
              </div>
            )}
          </FadeIn>
        </section>
      </div>
    </div>
  );
}
