"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { venue } from "@/config/venue";
import { entertainers } from "@/data/entertainers";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import GirlCard from "@/components/girls/GirlCard";
import { applyLineup, useClubOverrides } from "@/lib/club-overrides";

interface StageNames {
  active: { id: string; name: string } | null;
  next: { id: string; name: string } | null;
  live: boolean;
}

/**
 * "Tonight" block: the Digital Stage (current performer pulled from the
 * stage API, which runs a simulated stage in demo mode) next to a reel of
 * featured entertainers.
 */
export default function TonightStrip() {
  const { overrides } = useClubOverrides();
  const roster = applyLineup(entertainers, overrides);
  const featured = roster.filter((e) => e.featured);
  const tonightCount = roster.filter((e) => e.workingTonight).length;

  const order = venue.digitalStage.demo?.openingOrder ?? [];
  const fallback = order.map((id) => roster.find((e) => e.id === id)).filter((e) => e !== undefined);
  const [stage, setStage] = useState<StageNames | null>(null);

  useEffect(() => {
    if (!venue.features.liveStream) return;
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/digital-stage/${venue.slug}`, { cache: "no-store" });
        if (!res.ok) return;
        const s = await res.json();
        if (alive)
          setStage({
            active: s.active ? { id: s.active.slug ?? s.active.id, name: s.active.stageName ?? s.active.name } : null,
            next: s.next ? { id: s.next.slug ?? s.next.id, name: s.next.stageName ?? s.next.name } : null,
            live: s.stream?.state === "live" || Boolean(s.stage?.isLive),
          });
      } catch {
        // keep the static fallback
      }
    };
    void load();
    const t = setInterval(load, 10_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const onStageName = stage?.active?.name ?? fallback[0]?.name;
  const onStageHue = roster.find((e) => e.id === stage?.active?.id)?.hue ?? fallback[0]?.hue ?? venue.theme.heroHue;
  const nextName = stage?.next?.name ?? fallback[1]?.name;

  return (
    <section className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
      {venue.features.liveStream ? (
        <Link href="/live" className="cine-card glass-strong group relative block overflow-hidden rounded-[2rem]">
          <MockImage hue={onStageHue} label={onStageName} className="cine-zoom aspect-[4/5] h-full w-full lg:aspect-auto lg:min-h-[34rem]">
            <div className="stage-lights" aria-hidden />
          </MockImage>
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="live" pulse>
                Live
              </Badge>
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-bone/80 backdrop-blur">
                Simulated stream · demo
              </span>
            </div>
            <div>
              <p className="eyebrow mb-2">Digital Stage · on now</p>
              <p className="font-display text-4xl font-semibold text-bone drop-shadow sm:text-5xl">{onStageName ?? "Stage"}</p>
              {nextName ? (
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-bone/70">
                  Up next · <span className="text-gold">{nextName}</span>
                </p>
              ) : null}
              <span className="mt-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-bone">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/40 backdrop-blur transition group-hover:border-gold group-hover:text-gold">
                  ▶
                </span>
                Watch the stage
              </span>
            </div>
          </div>
        </Link>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">{tonightCount} on the lineup tonight</p>
            <h2 className="font-display text-3xl font-semibold text-bone sm:text-5xl">Featured {venue.labels.performers}</h2>
          </div>
          <Link href="/girls" className="text-xs font-semibold uppercase tracking-[0.2em] text-gold hover:text-gold-bright">
            Full roster →
          </Link>
        </div>
        <div className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          {featured.map((girl) => (
            <div key={girl.id} className="w-60 flex-shrink-0 snap-start sm:w-64">
              <GirlCard girl={girl} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/girls" variant="outline">
            Browse &amp; favorite
          </Button>
          <Button href="/dashboard/digital-stage" variant="ghost">
            Staff stage dashboard →
          </Button>
        </div>
      </div>
    </section>
  );
}
