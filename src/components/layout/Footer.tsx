import Link from "next/link";
import { venue } from "@/config/venue";
import Wordmark from "./Wordmark";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Wordmark />
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted">
              {venue.tagline}
              {venue.established ? ` · ${venue.established}` : ""}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {venue.address}
              <br />
              {venue.phone}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Hours</p>
            {venue.hours.length ? (
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
            ) : (
              <p className="text-xs text-bone/60">{venue.hoursNote}</p>
            )}
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
              {venue.features.jobs ? (
                <li>
                  <Link href="/jobs" className="text-bone/70 transition hover:text-gold">
                    Join the team
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="hairline my-8" />
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted">
          {venue.demo.footerNote}
        </p>
      </div>
    </footer>
  );
}
