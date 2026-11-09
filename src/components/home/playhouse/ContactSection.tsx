import { AtSign, Clock, ExternalLink, Info, Mail, MapPin, Phone } from "lucide-react";
import { content, venue } from "@/config/venue";
import { FadeIn, SectionTitle } from "@/components/ui/motion";
import { BookButton } from "./shared";

/** Contact & social: only what's public, with sources; everything else "to be confirmed". */
export default function ContactSection() {
  const facts = content.playhouse?.facts;
  const mapsUrl = venue.directionsUrl;
  return (
    <section id="contact" aria-labelledby="contact-title">
      <SectionTitle
        id="contact-title"
        eyebrow="Contact & Social"
        title={
          <>
            Find <span className="pl-gold-text italic">Bibs.</span>
          </>
        }
        body="Booking inquiries go through the form above, or reach the team directly."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        <FadeIn className="rounded-3xl border border-white/10 bg-ink-2/80 p-6 lg:col-span-2 lg:p-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-3 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Location
              </p>
              <p className="font-display text-2xl leading-snug text-bone">{venue.address}</p>
              {facts ? (
                <a href={facts.addressSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs text-bone/50 hover:text-gold">
                  {facts.addressSourceLabel}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              ) : null}
              {mapsUrl ? (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex w-fit items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-ink">
                  Open in Maps
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
            <div className="space-y-6">
              <div>
                <p className="eyebrow mb-3 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  Hours
                </p>
                {venue.hours.length ? (
                  <ul className="space-y-1.5 text-sm text-bone/75">
                    {venue.hours.map((h) => (
                      <li key={h.days} className="flex justify-between gap-4 border-b border-white/5 pb-1.5">
                        <span>{h.days}</span>
                        <span className="text-gold">
                          {h.open} – {h.close}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div>
                <p className="eyebrow mb-3 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  Phone &amp; email
                </p>
                {venue.phone ? (
                  <a href={`tel:${venue.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-sm text-bone/80 hover:text-gold">
                    <Phone className="h-3.5 w-3.5 text-bone/40" aria-hidden />
                    {venue.phone}
                  </a>
                ) : null}
                {venue.email ? (
                  <a href={`mailto:${venue.email}`} className="mt-1.5 flex items-center gap-2 text-sm text-bone/80 hover:text-gold">
                    <Mail className="h-3.5 w-3.5 text-bone/40" aria-hidden />
                    {venue.email}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/5 pt-6">
            <BookButton>Start a Booking Inquiry</BookButton>
            <p className="flex items-center gap-2 text-xs text-bone/45">
              <Info className="h-3.5 w-3.5" aria-hidden />
              Demo form. Nothing is sent.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-accent-2/30 via-ink-2 to-ink-2 p-6 lg:p-8">
          <p className="eyebrow mb-4 flex items-center gap-2">
            <AtSign className="h-3.5 w-3.5" aria-hidden />
            Follow
          </p>
          <ul className="space-y-3">
            {venue.socialLinks.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-bone transition hover:border-gold/50">
                  {s.label}
                  <ExternalLink className="h-4 w-4 text-bone/40 transition group-hover:text-gold" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-bone/50">
            Promoter Mike DaPromoter posts Bibs Playhouse nights. Official venue accounts: to be confirmed.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
