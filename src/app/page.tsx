import Link from "next/link";
import { venue } from "@/config/venue";
import { entertainers } from "@/data/entertainers";
import { events, formatEventDate } from "@/data/events";
import { liveRooms } from "@/data/liveRooms";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import MockImage from "@/components/ui/MockImage";
import GirlCard from "@/components/girls/GirlCard";
import EventCard from "@/components/events/EventCard";
import { formatMoney } from "@/lib/format";

const tonightCount = entertainers.filter((e) => e.workingTonight).length;
const liveViewers = liveRooms.reduce((sum, r) => sum + r.viewerCount, 0);
const featuredEvent = events.find((e) => e.featured) ?? events[0];
const featuredGirls = entertainers.filter((e) => e.featured);

const tickerItems = [
  "Doors open 8PM",
  `${tonightCount} girls working tonight`,
  "DJ Smooth on the decks",
  `Kitchen open until 2:30AM`,
  `Next up · ${featuredEvent.title}`,
  `${liveViewers.toLocaleString()} watching live`,
];

interface ModuleCard {
  href: string;
  title: string;
  blurb: string;
  hue: number;
  feature?: keyof typeof venue.features;
}

const modules: ModuleCard[] = [
  { href: "/girls", title: "Meet the Girls", blurb: "The full roster — see who's working tonight.", hue: 330 },
  { href: "/live", title: "Watch Live", blurb: "The main stage stream, live from the floor.", hue: 350, feature: "liveStream" },
  { href: "/webcams", title: "Webcams", blurb: "Your favorite entertainers, streaming live.", hue: 270, feature: "webcams" },
  { href: "/messages", title: "Messages", blurb: "Talk directly with your favorite entertainers.", hue: 210, feature: "messaging" },
  { href: "/reserve", title: "Reserve a Table", blurb: "VIP sections, bottle packages, stage-side seats.", hue: 42 },
  { href: "/events", title: "Events & Parking", blurb: "Tickets, guest DJs, and pre-paid parking.", hue: 190 },
  { href: "/kitchen", title: "The Kitchen", blurb: "Lemon pepper wet until 2:30AM. Enough said.", hue: 25, feature: "kitchen" },
  { href: "/jobs", title: "Join the Team", blurb: "Entertainers, bar, floor, kitchen, security.", hue: 150, feature: "jobs" },
  { href: "/shop", title: "Shop Merch", blurb: "Wear the crest. Tees, hats, and hoodies.", hue: 45, feature: "merch" },
];

export default function HomePage() {
  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative -mt-16 flex min-h-[92svh] items-end overflow-hidden pt-16">
        <div className="absolute inset-0">
          <MockImage hue={40} className="drift h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 60% at 50% 100%, rgba(193,20,48,0.12), transparent 60%)",
            }}
          />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <p className="fade-up eyebrow mb-3">
            Tonight at the club · {venue.city}
          </p>
          <h1 className="fade-up fade-up-1 gold-text font-display text-6xl leading-none sm:text-8xl">
            {venue.name}
          </h1>
          <p className="fade-up fade-up-2 mt-4 max-w-xl text-sm leading-relaxed text-bone/80 sm:text-base">
            {venue.description}
          </p>
          <div className="fade-up fade-up-3 mt-8 flex flex-wrap gap-3">
            <Button href="/girls" size="lg">
              Meet the Girls
            </Button>
            {venue.features.liveStream ? (
              <Button href="/live" variant="outline" size="lg">
                <span className="pulse-live inline-block h-2 w-2 rounded-full bg-blood" />
                Watch Live
              </Button>
            ) : null}
            <Button href="/reserve" variant="ghost" size="lg">
              Reserve a Table →
            </Button>
          </div>
        </div>
      </section>

      {/* ---- TONIGHT TICKER (signature) ---- */}
      <div className="border-y border-line bg-ink-2/60 py-3">
        <div className="relative overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-10">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex items-center gap-10"
              >
                {tickerItems.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-gold"
                  >
                    <span className="text-gold-deep">✦</span>
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-14 sm:px-6">
        {/* ---- FEATURED EVENT ---- */}
        <section>
          <SectionHeader
            eyebrow="Don't miss it"
            title="Featured Event"
            href="/events"
          />
          <Link
            href={`/events/${featuredEvent.id}`}
            className="glass group block overflow-hidden rounded-3xl transition hover:border-gold/40"
          >
            <div className="grid md:grid-cols-2">
              <MockImage
                hue={featuredEvent.hue}
                label={featuredEvent.title}
                className="aspect-[16/9] w-full transition duration-500 group-hover:scale-[1.02] md:aspect-auto md:min-h-72"
              />
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <Badge variant="tonight" className="w-fit">
                  {formatEventDate(featuredEvent.date)} · Doors {featuredEvent.doors}
                </Badge>
                <h3 className="mt-4 font-display text-3xl text-bone sm:text-4xl">
                  {featuredEvent.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {featuredEvent.description}
                </p>
                <div className="mt-6 flex items-center gap-6 text-sm">
                  <span className="text-bone/70">
                    GA{" "}
                    <span className="font-bold text-gold">
                      {formatMoney(featuredEvent.gaPrice)}
                    </span>
                  </span>
                  <span className="text-bone/70">
                    VIP from{" "}
                    <span className="font-bold text-gold">
                      {formatMoney(featuredEvent.vipFromPrice)}
                    </span>
                  </span>
                  <span className="ml-auto text-xs font-bold uppercase tracking-wider text-gold group-hover:text-gold-bright">
                    Get tickets →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* ---- FEATURED ENTERTAINERS ---- */}
        <section>
          <SectionHeader
            eyebrow={`${tonightCount} working tonight`}
            title="Featured Entertainers"
            href="/girls"
            linkLabel="Full roster"
          />
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {featuredGirls.map((girl) => (
              <div
                key={girl.id}
                className="w-64 flex-shrink-0 snap-start sm:w-auto"
              >
                <GirlCard girl={girl} />
              </div>
            ))}
          </div>
        </section>

        {/* ---- MODULES ---- */}
        <section>
          <SectionHeader eyebrow="The full experience" title="Everything Inside" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {modules
              .filter((m) => !m.feature || venue.features[m.feature])
              .map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="glass group relative overflow-hidden rounded-3xl p-5 transition duration-300 hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(212,169,78,0.1)] sm:p-6"
                >
                  <div
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
                    style={{ background: `hsl(${m.hue} 60% 45%)` }}
                  />
                  <h3 className="font-display text-lg text-bone sm:text-xl">
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {m.blurb}
                  </p>
                  <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-gold transition group-hover:translate-x-1 group-hover:text-gold-bright">
                    Enter →
                  </span>
                </Link>
              ))}
          </div>
        </section>

        {/* ---- UPCOMING EVENTS ---- */}
        <section>
          <SectionHeader
            eyebrow="Plan your week"
            title="Upcoming Events"
            href="/events"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {events.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* ---- RESERVE BANNER ---- */}
        <section className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(70% 100% at 50% 0%, rgba(212,169,78,0.14), transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="eyebrow mb-2">The best seat in the house</p>
            <h2 className="gold-text font-display text-3xl sm:text-5xl">
              Reserve Your Table Tonight
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              Stage-side sections, bottle packages, and a host who knows your
              name. Walk past the line every time.
            </p>
            <div className="mt-7 flex justify-center">
              <Button href="/reserve" size="lg">
                Reserve a Table
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
