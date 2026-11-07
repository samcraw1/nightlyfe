import Link from "next/link";
import { venue } from "@/config/venue";
import { entertainers } from "@/data/entertainers";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

/**
 * Home-page teaser for the Digital Stage. Static on purpose (no stream
 * connection on the home page); clearly labelled as a simulated preview.
 */
export default function LivePreview() {
  if (!venue.features.liveStream) return null;
  const order = venue.digitalStage.demo?.openingOrder ?? [];
  const rotation = [
    ...order.map((id) => entertainers.find((e) => e.id === id)).filter((e) => e !== undefined),
    ...entertainers.filter((e) => e.workingTonight && !order.includes(e.id)),
  ].slice(0, 4);
  const [onStage, ...upNext] = rotation;

  return (
    <section className="glass-strong relative overflow-hidden rounded-[2rem]">
      <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Link href="/live" className="group relative block">
          <MockImage hue={onStage?.hue ?? venue.theme.heroHue} label={onStage?.name} className="aspect-video h-full w-full lg:aspect-auto lg:min-h-[24rem]">
            <div className="stage-lights" aria-hidden />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Badge variant="live" pulse>Live</Badge>
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-bone/80 backdrop-blur">
                Simulated preview
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white backdrop-blur transition group-hover:scale-110 group-hover:border-gold">
                ▶
              </span>
            </div>
            {onStage ? (
              <div className="absolute bottom-4 left-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">On the Digital Stage</p>
                <p className="font-display text-3xl text-bone drop-shadow">{onStage.name}</p>
              </div>
            ) : null}
          </MockImage>
        </Link>
        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8">
          <div>
            <p className="eyebrow mb-2">Digital Stage</p>
            <h2 className="font-display text-3xl uppercase leading-none text-bone sm:text-4xl">
              Watch the stage <span className="text-gold">from anywhere</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              One club livestream with a managed performer rotation. Staff pick who&apos;s on and who&apos;s next from a
              dashboard; fans see it update instantly, then book a table to see it in person.
            </p>
          </div>
          {upNext.length ? (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Up next in rotation</p>
              <ul className="flex flex-wrap gap-2">
                {upNext.map((e) => (
                  <li key={e.id} className="rounded-full border border-white/10 px-3 py-1 text-xs text-bone/80">
                    {e.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button href="/live">Open the Stage</Button>
            <Button href="/dashboard/digital-stage" variant="outline">Staff Dashboard</Button>
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
            Demo: video is simulated · performers are fictional
          </p>
        </div>
      </div>
    </section>
  );
}
