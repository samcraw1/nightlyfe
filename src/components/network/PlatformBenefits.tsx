import Link from "next/link";
import { ArrowUpRight, Building2, HandCoins, Sparkles } from "lucide-react";
import { FadeIn, SectionTitle } from "@/components/ui/motion";

const BENEFITS = [
  {
    Icon: Building2,
    title: "Centralization",
    body: "Seven clubs, one system. Locations, hours, events, entertainers, and VIP inquiries are managed from a single dashboard, with each club still able to look and feel like itself.",
  },
  {
    Icon: Sparkles,
    title: "Customer Experience",
    body: "Guests find the right club, see what's on tonight, and request VIP in a few taps, on any phone, without hopping between seven different websites.",
  },
  {
    Icon: HandCoins,
    title: "Revenue Opportunities",
    body: "Every page leads to a VIP inquiry. Events get promoted network-wide, and live previews open a new way to bring guests through the door.",
  },
];

/** Pitch section: the three business benefits, linking to the dashboard demo. */
export default function PlatformBenefits() {
  return (
    <section id="platform" aria-labelledby="platform-title">
      <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-br from-ink-2 via-ink to-ink-2 p-6 sm:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
          aria-hidden
        />
        <SectionTitle
          id="platform-title"
          eyebrow="One platform"
          title={
            <>
              Built to run the <span className="lx-gold-text italic">whole network</span>.
            </>
          }
          body="This concept is more than a website. It's one platform behind every Pandora's club."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {BENEFITS.map(({ Icon, title, body }, i) => (
            <FadeIn key={title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-black/30 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">0{i + 1}</p>
                <h3 className="mt-1 font-display text-3xl text-bone">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/60">{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.2} className="mt-8">
          <Link
            href="/admin-demo"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-7 py-3.5 text-[11px] font-bold uppercase"
          >
            Explore the management dashboard <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
