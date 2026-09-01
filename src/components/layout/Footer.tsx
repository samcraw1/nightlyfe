import Link from "next/link";
import { venue } from "@/config/venue";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="gold-text font-display text-2xl">{venue.name}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted">
              {venue.tagline}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {venue.address}
              <br />
              {venue.phone}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Hours</p>
            <ul className="space-y-1.5 text-xs text-bone/70">
              {venue.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span className="text-gold">
                    {h.open} – {h.close}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Follow</p>
            <ul className="space-y-1.5 text-xs">
              {venue.socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bone/70 transition hover:text-gold"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/jobs" className="text-bone/70 transition hover:text-gold">
                  Join the team
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="hairline my-8" />
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted">
          21+ · Valid ID required · Demo template — all people and content are fictional
        </p>
      </div>
    </footer>
  );
}
