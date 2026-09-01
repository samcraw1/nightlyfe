"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import MockImage from "@/components/ui/MockImage";
import { formatCount } from "@/lib/format";

interface LivePlayerProps {
  title: string;
  subtitle?: string;
  live: boolean;
  viewers: number;
  hue: number;
}

/**
 * Demo stream player. To integrate a real provider (Mux, LiveKit, IVS…),
 * replace the <MockStream> block with the provider's <video> surface —
 * the chrome (badge, viewers, controls) stays as-is.
 */
export default function LivePlayer({
  title,
  subtitle,
  live,
  viewers,
  hue,
}: LivePlayerProps) {
  const [muted, setMuted] = useState(true);

  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="relative aspect-video w-full bg-black">
        {/* MockStream — swap for the real player element */}
        <MockImage hue={hue} className="drift h-full w-full" dim={!live}>
          {live ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-black/40 pl-1 text-2xl text-gold backdrop-blur">
                  ▶
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.3em] text-bone/60 sm:block">
                  Demo stream
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm uppercase tracking-[0.3em] text-bone/50">
                Stream offline
              </p>
            </div>
          )}
        </MockImage>

        {/* overlay chrome */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {live ? (
            <Badge variant="live" pulse>
              Live
            </Badge>
          ) : (
            <Badge variant="muted">Offline</Badge>
          )}
          {live ? (
            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
              {formatCount(viewers)} watching
            </span>
          ) : null}
        </div>

        {live ? (
          <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
            <div>
              <p className="text-sm font-bold text-white">{title}</p>
              {subtitle ? (
                <p className="text-[11px] text-white/60">{subtitle}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute" : "Mute"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm text-white backdrop-blur transition hover:bg-white/20"
              >
                {muted ? "🔇" : "🔊"}
              </button>
              <button
                aria-label="Fullscreen"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm text-white backdrop-blur transition hover:bg-white/20"
              >
                ⛶
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
