import { venue } from "@/config/venue";
import Reveal from "@/components/ui/Reveal";
import VisitBlock from "@/components/home/VisitBlock";
import CinematicHero from "./CinematicHero";
import NightRail from "./NightRail";
import TonightStrip from "./TonightStrip";
import InsideVivide from "./InsideVivide";
import VipShowcase from "./VipShowcase";
import CinematicEvents from "./CinematicEvents";
import BeyondInstagram from "./BeyondInstagram";
import InstagramWall from "./InstagramWall";

const marquee = [
  venue.tagline,
  "15 hours a day",
  ...(venue.highlights ?? []).map((h) => h.title),
  "VIP sections",
  "Digital Stage",
];

/** Home page for clubs with `home.layout: "cinematic"`. */
export default function CinematicHome() {
  return (
    <div>
      <CinematicHero />

      <div className="border-y border-white/10 bg-black py-4" aria-hidden>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-12">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-12">
                {marquee.map((item) => (
                  <span
                    key={item}
                    className="font-wide flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.45em] text-bone/70"
                  >
                    {item}
                    <span className="text-gold">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-24 px-5 pt-20 sm:space-y-32 sm:px-8 sm:pt-28">
        <Reveal>
          <NightRail />
        </Reveal>
        <Reveal>
          <TonightStrip />
        </Reveal>
        <Reveal>
          <InsideVivide />
        </Reveal>
        <Reveal>
          <VipShowcase />
        </Reveal>
        <Reveal>
          <CinematicEvents />
        </Reveal>
        <Reveal>
          <BeyondInstagram />
        </Reveal>
        <Reveal>
          <InstagramWall />
        </Reveal>
        {venue.home.visitBlock ? (
          <Reveal>
            <VisitBlock />
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
