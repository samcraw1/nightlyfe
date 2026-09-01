"use client";

import Link from "next/link";
import { getEntertainer } from "@/data/entertainers";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import LiveRoomCard from "@/components/live/LiveRoomCard";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { useApp } from "@/lib/store";

/** Creator livestream discovery — who's live right now, who's offline. */
export default function WebcamsPage() {
  const { liveRooms } = useApp();

  const live = liveRooms
    .filter((r) => r.isLive)
    .map((r) => ({ room: r, girl: getEntertainer(r.entertainerId) }))
    .filter((x) => x.girl)
    .sort((a, b) => b.room.viewerCount - a.room.viewerCount);

  const offline = liveRooms
    .filter((r) => !r.isLive)
    .map((r) => ({ room: r, girl: getEntertainer(r.entertainerId) }))
    .filter((x) => x.girl);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Watch your favorite entertainers live"
        title="Webcams"
        description="The girls stream from their own rooms — hang out, chat, and tip, wherever you are."
      />

      <section>
        <SectionHeader
          eyebrow={`${live.length} streaming`}
          title="Live Now"
        />
        {live.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {live.map(({ room, girl }) => (
              <LiveRoomCard key={room.id} room={room} girl={girl!} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="font-display text-xl text-bone">
              No one is live right now
            </p>
            <p className="mt-2 text-sm text-muted">
              Favorite the girls below and check back tonight.
            </p>
          </div>
        )}
      </section>

      <section className="mt-14">
        <SectionHeader
          eyebrow="Catch them next time"
          title="All Entertainers"
          href="/girls"
          linkLabel="Full roster"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {offline.map(({ room, girl }) => (
            <article
              key={room.id}
              className="glass overflow-hidden rounded-3xl opacity-90 transition hover:border-gold/40 hover:opacity-100"
            >
              <Link href={`/girls/${girl!.id}`} className="block">
                <MockImage
                  hue={girl!.hue}
                  label={girl!.name}
                  dim
                  className="aspect-square w-full"
                >
                  <div className="absolute left-3 top-3">
                    <Badge variant="muted">Offline</Badge>
                  </div>
                </MockImage>
              </Link>
              <div className="p-3.5">
                <h3 className="font-display text-lg text-bone">{girl!.name}</h3>
                <div className="mt-2.5 flex gap-2">
                  <Link
                    href={`/girls/${girl!.id}`}
                    className="flex-1 rounded-full border border-gold/40 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-gold transition hover:bg-gold/10"
                  >
                    Profile
                  </Link>
                  <Link
                    href={`/messages/conv-${girl!.id}`}
                    className="flex-1 rounded-full border border-white/15 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-bone/70 transition hover:border-gold/40 hover:text-gold"
                  >
                    Message
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
