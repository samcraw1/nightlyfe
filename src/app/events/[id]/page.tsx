import { notFound } from "next/navigation";
import Link from "next/link";
import { events, formatEventDate, getEvent } from "@/data/events";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import TicketCheckout from "@/components/events/TicketCheckout";
import { formatMoney } from "@/lib/format";
import { venue } from "@/config/venue";

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const event = getEvent((await params).id);
  return { title: event ? event.title : "Event" };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  return (
    <div>
      <section className="relative -mt-16 pt-16">
        <MockImage
          hue={event.hue}
          label={event.title}
          className="h-[42svh] min-h-72 w-full"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="fade-up relative -mt-20 pb-2">
          <Link
            href="/events"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold-bright"
          >
            ← All events
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="tonight">
              {formatEventDate(event.date)} · Doors {event.doors}
            </Badge>
            {event.featured ? <Badge variant="gold">Featured</Badge> : null}
          </div>
          <h1 className="gold-text mt-3 font-display text-4xl sm:text-6xl">
            {event.title}
          </h1>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-bone/80 sm:text-base">
              {event.description}
            </p>
            <div className="glass grid grid-cols-3 gap-4 rounded-3xl p-5 text-center">
              <div>
                <p className="font-display text-2xl text-gold">
                  {formatMoney(event.gaPrice)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted">
                  General
                </p>
              </div>
              <div>
                <p className="font-display text-2xl text-gold">
                  {formatMoney(event.vipFromPrice)}+
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted">
                  VIP tables
                </p>
              </div>
              <div>
                <p className="font-display text-2xl text-gold">
                  {venue.features.parking ? formatMoney(event.parkingPrice) : "—"}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted">
                  Parking
                </p>
              </div>
            </div>
            <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
              <div>
                <p className="font-display text-lg text-bone">
                  Want the VIP treatment?
                </p>
                <p className="text-xs text-muted">
                  Reserve a section for this night instead.
                </p>
              </div>
              <Button href="/reserve" variant="outline">
                Reserve a Table
              </Button>
            </div>
          </div>

          <TicketCheckout event={event} />
        </div>
      </div>
    </div>
  );
}
