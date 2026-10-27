import Link from "next/link";
import Button from "@/components/ui/Button";
import type { StageEntertainer, StageVenue } from "@/lib/digital-stage/types";
import PerformerAvatar from "./PerformerAvatar";

interface VenueInfoProps {
  venue: StageVenue;
  featured: StageEntertainer[];
  visitNote: string;
  hours: { days: string; open: string; close: string }[];
  phone: string;
}

/** Where the club is, who's on tonight, and how to get a table. */
export default function VenueInfo({ venue, featured, visitNote, hours, phone }: VenueInfoProps) {
  const mapsHref = venue.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}` : null;

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Tonight at</p>
          <p className="font-display text-2xl text-bone">{venue.name}</p>
          {venue.address ? <p className="mt-1 text-sm text-muted">{venue.address}</p> : venue.city ? <p className="mt-1 text-sm text-muted">{venue.city}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/reserve" size="sm">Reserve VIP</Button>
          {mapsHref ? (
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-gold/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gold transition hover:bg-gold/10"
            >
              Directions
            </a>
          ) : null}
        </div>
      </div>

      {featured.length > 0 ? (
        <div className="mt-5">
          <p className="eyebrow mb-3">Featured entertainers tonight</p>
          <ul className="flex flex-wrap gap-3">
            {featured.map((e) => (
              <li key={e.id}>
                <Link href={`/girls/${e.slug}`} className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-3 text-xs text-bone transition hover:border-gold/40 hover:text-gold">
                  <PerformerAvatar entertainer={e} className="h-7 w-7 rounded-full" />
                  {e.stageName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 border-t border-white/5 pt-4 text-sm sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-2">Hours</p>
          <ul className="space-y-1 text-bone/80">
            {hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-muted">{h.open} – {h.close}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-2">Visiting</p>
          <p className="text-bone/80">{visitNote}</p>
          <p className="mt-2 text-muted">{phone}</p>
        </div>
      </div>
    </div>
  );
}
