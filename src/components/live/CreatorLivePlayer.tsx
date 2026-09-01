"use client";

import type { Entertainer, LiveRoom } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { formatCount } from "@/lib/format";

interface CreatorLivePlayerProps {
  room: LiveRoom;
  girl: Entertainer;
}

/**
 * Player surface for an entertainer's own stream.
 *
 *   CreatorLivePlayer
 *       ↓
 *   Mock stream today
 *       ↓
 *   LiveKit / Mux / AWS IVS later
 *
 * INTEGRATION BOUNDARY: replace the <MockStream> block below with the real
 * provider's player element, keyed off room.streamProvider + room.playbackId.
 * The chrome (badges, viewer count, title bar) stays as-is.
 */
export default function CreatorLivePlayer({ room, girl }: CreatorLivePlayerProps) {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="relative aspect-video w-full bg-black">
        {/* MockStream — swap for provider player */}
        <MockImage
          hue={girl.hue}
          label={girl.name}
          className="drift h-full w-full"
          dim={!room.isLive}
        >
          {room.isLive ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-black/40 pl-1 text-2xl text-gold backdrop-blur">
                ▶
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <p className="text-sm uppercase tracking-[0.3em] text-bone/50">
                Stream offline
              </p>
              <p className="text-xs text-bone/40">
                Check {girl.name}&apos;s schedule to catch her next one
              </p>
            </div>
          )}
        </MockImage>

        <div className="absolute left-4 top-4 flex items-center gap-2">
          {room.isLive ? (
            <Badge variant="live" pulse>
              Live
            </Badge>
          ) : (
            <Badge variant="muted">Offline</Badge>
          )}
          {room.isLive ? (
            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
              {formatCount(room.viewerCount)} watching
            </span>
          ) : null}
        </div>

        {room.isLive ? (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-sm font-bold text-white">{room.title}</p>
            <p className="text-[11px] text-white/60">{girl.name}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
