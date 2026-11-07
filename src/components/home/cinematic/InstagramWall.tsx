import { venue } from "@/config/venue";
import MockImage from "@/components/ui/MockImage";
import Button from "@/components/ui/Button";

const tiles = [
  { hue: 42, label: "Saturday" },
  { hue: 268, label: "Twist" },
  { hue: 0, label: "Friday" },
  { hue: 205, label: "Passport" },
  { hue: 38, label: "Celebrity" },
  { hue: 48, label: "Dinero" },
];

/**
 * Instagram feed preview. Placeholder tiles until the club connects its
 * account (Instagram Graph API); the follow button links to the real profile.
 */
export default function InstagramWall() {
  const ig = venue.instagram;
  if (!ig) return null;
  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">@{ig.handle}</p>
          <h2 className="font-display text-3xl font-semibold text-bone sm:text-5xl">From the Feed</h2>
          <p className="mt-3 max-w-lg text-sm text-muted">
            Feed preview — placeholder tiles. Connected to Instagram, the club&apos;s latest flyers would appear here automatically.
          </p>
        </div>
        <Button href={ig.url} variant="outline">
          Follow on Instagram
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
        {tiles.map((t) => (
          <a
            key={t.label}
            href={ig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cine-card group relative block overflow-hidden rounded-xl border border-white/10 sm:rounded-2xl"
            aria-label={`Open @${ig.handle} on Instagram`}
          >
            <MockImage hue={t.hue} label={t.label} className="cine-zoom aspect-square w-full" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-bold uppercase tracking-[0.25em] text-bone opacity-0 transition group-hover:opacity-100">
              View
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
