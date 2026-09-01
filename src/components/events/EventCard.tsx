import Link from "next/link";
import type { ClubEvent } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { formatEventDate } from "@/data/events";
import { formatMoney } from "@/lib/format";
import { venue } from "@/config/venue";

export default function EventCard({ event }: { event: ClubEvent }) {
  return (
    <article className="glass group overflow-hidden rounded-3xl transition duration-300 hover:border-gold/40">
      <Link href={`/events/${event.id}`} className="block">
        <MockImage
          hue={event.hue}
          label={event.title}
          className="aspect-[16/9] w-full transition duration-500 group-hover:scale-[1.03]"
        >
          <div className="absolute left-4 top-4">
            {event.featured ? <Badge variant="tonight">Featured</Badge> : null}
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              {formatEventDate(event.date)} · Doors {event.doors}
            </p>
            <h3 className="font-display text-2xl text-bone drop-shadow">
              {event.title}
            </h3>
          </div>
        </MockImage>
      </Link>
      <div className="p-4">
        <p className="line-clamp-2 text-xs leading-relaxed text-muted">
          {event.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-bone/70">
            GA <span className="font-bold text-gold">{formatMoney(event.gaPrice)}</span>
            <span className="mx-2 text-muted">·</span>
            VIP from <span className="font-bold text-gold">{formatMoney(event.vipFromPrice)}</span>
            {venue.features.parking ? (
              <>
                <span className="mx-2 text-muted">·</span>
                Parking <span className="font-bold text-gold">{formatMoney(event.parkingPrice)}</span>
              </>
            ) : null}
          </div>
          <Link
            href={`/events/${event.id}`}
            className="rounded-full border border-gold/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold transition hover:bg-gold/10"
          >
            Tickets
          </Link>
        </div>
      </div>
    </article>
  );
}
