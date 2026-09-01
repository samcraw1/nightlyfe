"use client";

import Link from "next/link";
import type { Entertainer } from "@/types";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import { HeartIcon } from "@/components/layout/icons";
import { useApp } from "@/lib/store";
import { formatCount } from "@/lib/format";

export default function GirlCard({ girl }: { girl: Entertainer }) {
  const { isFavorite, toggleFavorite, hydrated } = useApp();
  const fav = hydrated && isFavorite(girl.id);

  return (
    <article className="glass group relative overflow-hidden rounded-3xl transition duration-300 hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(212,169,78,0.12)]">
      <Link href={`/girls/${girl.id}`} className="block">
        <MockImage
          hue={girl.hue}
          label={girl.name}
          className="aspect-[3/4] w-full transition duration-500 group-hover:scale-[1.03]"
        >
          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {girl.workingTonight ? (
              <Badge variant="tonight" pulse>
                Tonight
              </Badge>
            ) : null}
            {girl.featured ? <Badge variant="gold">Featured</Badge> : null}
          </div>
        </MockImage>
      </Link>

      <button
        aria-label={fav ? `Remove ${girl.name} from favorites` : `Add ${girl.name} to favorites`}
        aria-pressed={fav}
        onClick={() => toggleFavorite(girl.id)}
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition ${
          fav
            ? "bg-blood/90 text-white"
            : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
        }`}
      >
        <HeartIcon className="h-4.5 w-4.5" filled={fav} />
      </button>

      <div className="relative -mt-14 px-4 pb-4">
        <h3 className="font-display text-xl text-bone drop-shadow">
          {girl.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-bone/70">
          {girl.tagline}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
          {formatCount(girl.followers)} followers
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/girls/${girl.id}`}
            className="flex-1 rounded-full border border-gold/40 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-gold transition hover:bg-gold/10"
          >
            Profile
          </Link>
          <Link
            href={`/messages/conv-${girl.id}`}
            className="flex-1 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep py-2 text-center text-[11px] font-bold uppercase tracking-wider text-ink transition hover:brightness-110"
          >
            Message
          </Link>
        </div>
      </div>
    </article>
  );
}
