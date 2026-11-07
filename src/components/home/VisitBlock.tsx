import { venue } from "@/config/venue";
import Button from "@/components/ui/Button";

/** Location, hours, and socials. Shows placeholders for unconfirmed details. */
export default function VisitBlock() {
  return (
    <section className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
      <div className="visit-glow" aria-hidden />
      <div className="relative grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow mb-2">Plan your visit</p>
          <h2 className="font-display text-4xl uppercase leading-none text-bone sm:text-5xl">
            {venue.city}
            {venue.established ? <span className="block text-gold">{venue.established}</span> : null}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/75">{venue.address}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {venue.directionsUrl ? (
              <Button href={venue.directionsUrl} variant="outline">
                Get Directions
              </Button>
            ) : null}
            <Button href="/reserve">Reserve VIP</Button>
          </div>
        </div>
        <dl className="grid gap-4 text-sm">
          <div>
            <dt className="eyebrow mb-1">Hours</dt>
            <dd className="text-bone/75">
              {venue.hours.length
                ? venue.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.open} – {h.close}
                    </span>
                  ))
                : venue.hoursNote}
            </dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Phone</dt>
            <dd className="text-bone/75">{venue.phone}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Know before you go</dt>
            <dd className="text-bone/75">{venue.digitalStage.visitNote}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">Follow</dt>
            <dd className="flex flex-wrap gap-3">
              {venue.socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-bright">
                  {s.label}
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
