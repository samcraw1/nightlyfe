import { venue } from "@/config/venue";
import PinkHero from "./PinkHero";
import Experience from "./Experience";
import VipRequest from "./VipRequest";
import EntertainerShowcase from "./EntertainerShowcase";
import EventsShowcase from "./EventsShowcase";
import LiveExperience from "./LiveExperience";
import TwoCities from "./TwoCities";
import ContactSocial from "./ContactSocial";

const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "vip", label: "VIP" },
  { id: "entertainers", label: "Entertainers" },
  { id: "events", label: "Events" },
  { id: "live", label: "Live" },
  { id: "cities", label: "Houston × Memphis" },
  { id: "contact", label: "Contact" },
];

const MARQUEE = ["Houston's #1 Afterhours", "Coming to Memphis", "VIP Experiences", "Pinkhouse Memphis", "Coming Soon"];

/** Home page for clubs with `home.layout: "pinkhouse"`: one long, anchor-navigable page. */
export default function PinkhouseHome() {
  return (
    <div>
      <PinkHero />

      <div className="border-y border-white/10 bg-black py-4" aria-hidden>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-10">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-10">
                {MARQUEE.map((item) => (
                  <span key={item} className="flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.4em] text-bone/70">
                    {item}
                    <span className="ph-wordmark font-script text-xl normal-case tracking-normal">p</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav
        aria-label="On this page"
        className="sticky top-16 z-30 border-b border-white/5 bg-ink/80 backdrop-blur-xl [html[data-ribbon]_&]:top-[5.75rem]"
      >
        <ul className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2 sm:justify-center sm:px-8">
          {SECTIONS.map((s) => (
            <li key={s.id} className="flex-shrink-0">
              <a
                href={`#${s.id}`}
                className="block rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-bone/60 transition hover:bg-gold/10 hover:text-gold-bright"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl space-y-28 px-5 pt-20 sm:space-y-36 sm:px-8 sm:pt-28">
        <Experience />
        <VipRequest />
        <EntertainerShowcase />
        <EventsShowcase />
        {venue.home.livePreview ? <LiveExperience /> : null}
        <TwoCities />
        <ContactSocial />
      </div>
    </div>
  );
}
