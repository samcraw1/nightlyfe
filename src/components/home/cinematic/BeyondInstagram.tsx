import { venue } from "@/config/venue";
import Button from "@/components/ui/Button";

const rows: { today: string; platform: string }[] = [
  { today: "Flyers scroll away in the feed", platform: "A permanent weekly lineup and event calendar" },
  { today: "VIP by phone call or DM", platform: "Self-serve VIP sections and packages, 24/7" },
  { today: "Followers can't see who's on tonight", platform: "Live entertainer lineup, profiles, and favorites" },
  { today: "Content limited by platform rules", platform: "Your own Digital Stage livestream preview" },
  { today: "Instagram owns the audience", platform: "You own guest contacts, bookings, and analytics" },
  { today: "Hiring posts get buried", platform: "A standing careers page with applications" },
];

/** Pitch section: what a dedicated platform adds beyond an Instagram page. */
export default function BeyondInstagram() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 p-6 sm:p-10 lg:p-14">
      <div className="cine-sweep opacity-60" aria-hidden />
      <div className="relative">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">Beyond the feed</p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-bone sm:text-5xl">
            {venue.shortName} already has the audience.
            <span className="chrome-text block">Now give it a home.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-bone/70">
            Instagram is where people discover {venue.shortName}. A dedicated platform turns that attention into bookings, repeat
            visits, and guest relationships the club owns.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
          <p className="bg-ink-2 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted">On Instagram today</p>
          <p className="hidden bg-ink-2 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-gold sm:block">
            With your own platform
          </p>
          {rows.map((r) => (
            <div key={r.today} className="contents">
              <p className="bg-ink px-5 py-4 text-sm text-bone/50 line-through decoration-white/20">{r.today}</p>
              <p className="flex items-start gap-3 bg-ink px-5 py-4 text-sm text-bone">
                <span className="twist-dot mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                {r.platform}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {venue.features.adminPreview ? (
            <Button href="/admin">See the Admin Preview</Button>
          ) : null}
          <Button href="/reserve" variant="outline">
            Try a VIP Booking
          </Button>
        </div>
      </div>
    </section>
  );
}
