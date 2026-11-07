import Link from "next/link";
import { venue } from "@/config/venue";
import type { WeeklySpecial } from "@/clubs/types";
import DemoBadge from "@/components/ui/DemoBadge";
import SectionHeader from "@/components/ui/SectionHeader";

/** "Every week at the club" grid, fed by `content.weeklySpecials`. */
export default function WeeklySpecials({ specials }: { specials: WeeklySpecial[] }) {
  if (!specials.length) return null;
  return (
    <section>
      <SectionHeader eyebrow={`Every week at ${venue.shortName}`} title="Weekly Lineup" href="/events" linkLabel="All events" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {specials.map((s, i) => (
          <Link
            key={s.id}
            href="/events"
            className="special-card glass group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/50"
            style={{ ["--special-hue" as string]: s.hue, animationDelay: `${i * 0.9}s` }}
          >
            <div className="special-glow" aria-hidden />
            <span className="absolute right-4 top-4">
              <DemoBadge kind="sample" />
            </span>
            <p className="relative text-[11px] font-bold uppercase tracking-[0.25em] text-gold">{s.when}</p>
            <h3 className="relative mt-1 font-display text-3xl uppercase leading-none text-bone">{s.title}</h3>
            <p className="relative mt-2 text-xs leading-relaxed text-bone/70">{s.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
