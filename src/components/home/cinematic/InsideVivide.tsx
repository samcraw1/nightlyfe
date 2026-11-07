import Link from "next/link";
import { venue } from "@/config/venue";
import MockImage from "@/components/ui/MockImage";

/** Signature offerings (the club's Instagram story highlights) as large tiles. */
export default function InsideVivide() {
  const items = venue.highlights ?? [];
  if (!items.length) return null;
  return (
    <section>
      <div className="mb-8 text-center">
        <p className="eyebrow mb-3">Inside {venue.shortName}</p>
        <h2 className="font-display text-3xl font-semibold text-bone sm:text-5xl">
          {items.map((h) => h.title).join(" · ")}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((h, i) => (
          <Link
            key={h.title}
            href={h.href ?? "/"}
            className="cine-card glass group relative overflow-hidden rounded-[1.75rem]"
          >
            <MockImage hue={h.hue} label={h.title} className="cine-zoom aspect-[3/4] w-full" dim />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <span className="font-wide text-[10px] font-bold tracking-[0.3em] text-bone/50">0{i + 1}</span>
              <div>
                <h3 className="font-wide text-lg font-bold uppercase tracking-[0.2em] text-bone sm:text-xl">{h.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-bone/70">{h.blurb}</p>
                <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-gold transition group-hover:translate-x-1">
                  Explore →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
