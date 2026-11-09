import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { FadeIn, SectionTitle } from "@/components/ui/motion";
import NetworkHero from "./NetworkHero";
import ClubShowcase from "./ClubShowcase";
import EventsBoard from "./EventsBoard";
import VipInquiryForm from "./VipInquiryForm";
import PerformerGrid from "./PerformerGrid";
import NetworkLive from "./NetworkLive";
import PlatformBenefits from "./PlatformBenefits";

const MARQUEE = ["Dallas", "Fort Worth", "Euless", "Seven Clubs", "VIP Experiences", "After-Hours Fri & Sat", "Open 365 Days"];

/** Home page for multi-location brands (`home.layout: "network"`). */
export default function NetworkHome() {
  return (
    <div>
      <NetworkHero />

      <div className="border-y border-white/10 bg-black py-4" aria-hidden>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-12">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-12">
                {MARQUEE.map((item) => (
                  <span key={item} className="flex items-center gap-12 text-[11px] font-semibold uppercase tracking-[0.4em] text-bone/65">
                    {item}
                    <span className="text-gold">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-28 px-5 pt-20 sm:space-y-36 sm:px-8 sm:pt-28">
        <ClubShowcase />

        <section id="events" aria-labelledby="events-title">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle
              id="events-title"
              eyebrow="Events & Promotions"
              title={
                <>
                  What&rsquo;s on <span className="lx-gold-text italic">across DFW</span>.
                </>
              }
              body="Weekly promotions as published by the clubs, plus labelled demo events. Filter by club."
            />
            <FadeIn delay={0.1}>
              <Link href="/events" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone hover:border-gold hover:text-gold">
                All events <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </FadeIn>
          </div>
          <FadeIn className="mt-10">
            <EventsBoard limit={3} />
          </FadeIn>
        </section>

        <section id="vip" aria-labelledby="vip-title" className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
            <Image src="/clubs/pandoras-dfw/bokeh.webp" alt="" fill sizes="100vw" className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/90 to-ink/60" />
            <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:p-14">
              <div>
                <SectionTitle
                  id="vip-title"
                  eyebrow="VIP Experiences"
                  title={
                    <>
                      Your night, <span className="lx-gold-text italic">handled</span>.
                    </>
                  }
                  body="Choose a club, a date, and your party size. A VIP host would follow up personally. The clubs publish packages such as the VIP Main Floor Table and VIP Party Table Package; pricing is confirmed by each club."
                />
                <FadeIn delay={0.1} className="mt-8 space-y-3">
                  {["One request form for all seven clubs", "Birthdays, bachelor parties, and game days", "Inquiries land in one management inbox"].map((t) => (
                    <p key={t} className="flex items-center gap-3 text-sm text-bone/75">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/40 text-gold">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      {t}
                    </p>
                  ))}
                </FadeIn>
              </div>
              <FadeIn delay={0.1}>
                <VipInquiryForm />
              </FadeIn>
            </div>
          </div>
        </section>

        <section id="entertainers" aria-labelledby="entertainers-title">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle
              id="entertainers-title"
              eyebrow="Entertainer Showcase"
              title={
                <>
                  Featured <span className="lx-gold-text italic">appearances</span>.
                </>
              }
              body="Reusable profile cards with club affiliation. All profiles shown are demo placeholders. Real profiles would only be added with each performer's consent and authorized photography."
            />
            <FadeIn delay={0.1}>
              <Link href="/girls" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone hover:border-gold hover:text-gold">
                Full roster <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </FadeIn>
          </div>
          <div className="mt-10">
            <PerformerGrid />
          </div>
        </section>

        <NetworkLive />

        <PlatformBenefits />
      </div>
    </div>
  );
}
