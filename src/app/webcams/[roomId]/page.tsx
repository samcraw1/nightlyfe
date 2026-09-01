"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntertainer } from "@/data/entertainers";
import CreatorLivePlayer from "@/components/live/CreatorLivePlayer";
import LiveChat, { type ChatMessage } from "@/components/live/LiveChat";
import LiveRoomCard from "@/components/live/LiveRoomCard";
import TipModal from "@/components/live/TipModal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import MockImage from "@/components/ui/MockImage";
import { HeartIcon } from "@/components/layout/icons";
import { useApp } from "@/lib/store";
import { formatCount, newId } from "@/lib/format";

/** An entertainer's live room: stream, chat, tips, and quick actions. */
export default function LiveRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const { liveRooms, isFavorite, toggleFavorite, hydrated } = useApp();
  const [tipOpen, setTipOpen] = useState(false);
  const [chatEvents, setChatEvents] = useState<ChatMessage[]>([]);

  const room = liveRooms.find((r) => r.id === roomId);
  const girl = room ? getEntertainer(room.entertainerId) : undefined;
  if (!room || !girl) notFound();

  const fav = hydrated && isFavorite(girl.id);
  const otherLive = liveRooms
    .filter((r) => r.isLive && r.id !== room.id)
    .map((r) => ({ room: r, girl: getEntertainer(r.entertainerId) }))
    .filter((x) => x.girl)
    .slice(0, 3);

  const announceTip = (amount: number) => {
    setChatEvents((prev) => [
      ...prev,
      {
        id: newId("tip"),
        user: "you",
        text: `You tipped ${girl.name} ${amount} credits`,
        isTip: true,
      },
    ]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="fade-up pt-8 sm:pt-10">
        <Link
          href="/webcams"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold-bright"
        >
          ← All webcams
        </Link>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-5">
          <CreatorLivePlayer room={room} girl={girl} />

          {/* entertainer bar + actions */}
          <div className="glass rounded-3xl p-5">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/girls/${girl.id}`}
                className="flex items-center gap-3"
              >
                <MockImage
                  hue={girl.hue}
                  label={girl.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-display text-xl leading-tight text-bone">
                    {girl.name}
                  </p>
                  <p className="text-xs text-muted">
                    {room.isLive
                      ? `${formatCount(room.viewerCount)} watching`
                      : "Currently offline"}
                  </p>
                </div>
              </Link>
              {girl.workingTonight ? (
                <Badge variant="tonight" pulse>
                  Working tonight
                </Badge>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Button
                size="sm"
                variant={fav ? "blood" : "outline"}
                onClick={() => toggleFavorite(girl.id)}
                aria-pressed={fav}
              >
                <HeartIcon className="h-4 w-4" filled={fav} />
                {fav ? "Favorited" : "Favorite"}
              </Button>
              <Button size="sm" href={`/messages/conv-${girl.id}`}>
                Message
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTipOpen(true)}
                disabled={!room.isLive}
              >
                Tip
              </Button>
              <Button size="sm" variant="ghost" href="/reserve">
                Reserve a Table →
              </Button>
            </div>
          </div>
        </div>

        {/* chat: sidebar on desktop, below on mobile */}
        {room.isLive ? (
          <LiveChat className="h-96 lg:h-auto" events={chatEvents} />
        ) : (
          <div className="glass flex flex-col items-center justify-center rounded-3xl p-8 text-center">
            <p className="font-display text-xl text-bone">
              {girl.name} isn&apos;t live
            </p>
            <p className="mt-2 text-xs text-muted">
              Send her a message or check her schedule for tonight.
            </p>
            <Button
              size="sm"
              className="mt-5"
              href={`/messages/conv-${girl.id}`}
            >
              Message {girl.name}
            </Button>
          </div>
        )}
      </div>

      {otherLive.length > 0 ? (
        <section className="mt-14">
          <SectionHeader
            eyebrow="Keep watching"
            title="Also Live Now"
            href="/webcams"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherLive.map(({ room: r, girl: g }) => (
              <LiveRoomCard key={r.id} room={r} girl={g!} />
            ))}
          </div>
        </section>
      ) : null}

      <TipModal
        open={tipOpen}
        onClose={() => setTipOpen(false)}
        entertainerName={girl.name}
        onTip={announceTip}
      />
    </div>
  );
}
