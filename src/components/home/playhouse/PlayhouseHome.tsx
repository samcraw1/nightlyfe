import PlayhouseHero from "./PlayhouseHero";
import ExperienceGrid from "./ExperienceGrid";
import BookingWizard from "./BookingWizard";
import ProductionShowcase from "./ProductionShowcase";
import EventsSection from "./EventsSection";
import VipSection from "./VipSection";
import Gallery from "./Gallery";
import ContactSection from "./ContactSection";
import MobileBookBar from "./MobileBookBar";

const MARQUEE = ["Bibs Playhouse", "Little Rock, Arkansas", "Nightlife & Entertainment", "Private Events", "Music Videos", "Photoshoots", "VIP Sections"];

/** Home page for clubs with `home.layout: "playhouse"`: one long, anchor-navigable page. */
export default function PlayhouseHome() {
  return (
    <div>
      <PlayhouseHero />

      <div className="border-y border-gold/15 bg-black py-4" aria-hidden>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-10">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-10">
                {MARQUEE.map((item) => (
                  <span key={item} className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.4em] text-bone/70">
                    {item}
                    <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="mx-auto max-w-7xl space-y-28 px-5 pt-20 sm:space-y-36 sm:px-8 sm:pt-28">
        <ExperienceGrid />
        <BookingWizard />
        <ProductionShowcase />
        <EventsSection />
        <VipSection />
        <Gallery />
        <ContactSection />
      </div>

      <MobileBookBar />
    </div>
  );
}
