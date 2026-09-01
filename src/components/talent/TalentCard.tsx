"use client";

import Link from "next/link";
import type { Entertainer } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { formatCount } from "@/lib/format";

export default function TalentCard({ talent }: { talent: Entertainer }) {
  return (
    <article className="glass group relative overflow-hidden rounded-3xl transition duration-300 hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(212,169,78,0.12)]">
      <Link href={`/talent/${talent.id}`} className="block">
        <MockImage
          hue={talent.hue}
          label={talent.name}
          className="aspect-[3/4] w-full transition duration-500 group-hover:scale-[1.03]"
        >
          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {talent.featured ? <Badge variant="gold">Featured</Badge> : null}
          </div>
        </MockImage>
      </Link>

      <div className="relative -mt-14 px-4 pb-4">
        <h3 className="font-display text-xl text-bone drop-shadow">
          {talent.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-bone/70">
          {talent.tagline}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
          {formatCount(talent.followers)} followers
        </p>
        <Link
          href={`/talent/${talent.id}`}
          className="mt-3 block w-full rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep py-2 text-center text-[11px] font-bold uppercase tracking-wider text-ink transition hover:brightness-110"
        >
          View & Book
        </Link>
      </div>
    </article>
  );
}
