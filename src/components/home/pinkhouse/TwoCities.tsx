"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/layout/icons";
import { venue } from "@/config/venue";
import { EASE, SectionTitle } from "@/components/ui/motion";

/**
 * Brand locations, rendered from `venue.locations`. Adding a city is one
 * entry in the club config; the primary location is shown first and larger.
 */
export default function TwoCities() {
  const reduce = useReducedMotion();
  const locations = [...(venue.locations ?? [])].sort((a, b) => Number(!!b.primary) - Number(!!a.primary));
  if (!locations.length) return null;

  return (
    <section id="cities" aria-labelledby="cities-title">
      <SectionTitle
        id="cities-title"
        align="center"
        eyebrow="Houston × Memphis"
        title={
          <>
            Two cities. <span className="ph-pink-text italic">One</span> Pinkhouse experience.
          </>
        }
        body="Born in Houston. Now coming to Memphis."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {locations.map((l, i) => {
          const soon = l.status === "coming-soon";
          return (
            <motion.article
              key={l.slug}
              initial={{ opacity: 0, y: reduce ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
              className={`group relative min-h-[26rem] overflow-hidden rounded-[1.75rem] border ${
                l.primary ? "ph-glow border-gold/50" : "border-white/10"
              }`}
            >
              {l.image ? (
                <Image
                  src={l.image}
                  alt={`${l.city} at night`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={`object-cover transition duration-[1.4s] group-hover:scale-105 ${l.primary ? "" : "grayscale-[60%]"}`}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
              {l.primary ? (
                <div className="absolute inset-0 opacity-40 mix-blend-color" style={{ background: "var(--gold)" }} />
              ) : null}

              <div className="relative flex h-full min-h-[26rem] flex-col justify-between p-6 sm:p-8">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] ${
                      soon ? "bg-gold text-white" : "border border-white/30 bg-black/40 text-bone backdrop-blur"
                    }`}
                  >
                    {soon ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" aria-hidden /> : null}
                    {l.statusLabel}
                  </span>
                  {l.primary ? (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-bone/60">This site</span>
                  ) : null}
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-bone/60">{l.city}</p>
                  <h3 className="mt-8 font-display text-4xl uppercase tracking-[0.06em] text-bone sm:text-5xl">
                    <span className="ph-wordmark font-script text-[1.15em] normal-case leading-none tracking-normal">Pinkhouse</span>
                    <br />
                    <span className="ph-silver-text">{l.city.split(",")[0]}</span>
                  </h3>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone/75">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold-bright" aria-hidden />
                      {l.address ?? "Location to be announced"}
                    </span>
                    {l.instagram ? (
                      <a
                        href={l.instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 transition hover:text-gold-bright"
                      >
                        <InstagramIcon className="h-4 w-4 text-gold-bright" />@{l.instagram.handle}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
