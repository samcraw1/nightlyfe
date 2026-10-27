import type { Metadata } from "next";
import Link from "next/link";
import { venue } from "@/config/venue";
import { events } from "@/data/events";
import PageHeader from "@/components/ui/PageHeader";
import DigitalStage from "@/components/digital-stage/DigitalStage";
import { getStageRepository } from "@/lib/digital-stage/repository";
import { DEFAULT_VENUE_SLUG } from "@/lib/digital-stage/mode";

export const metadata: Metadata = { title: "Digital Stage" };
export const dynamic = "force-dynamic";

/**
 * The venue's Digital Stage: one shared livestream that entertainers rotate
 * through. Replaces the old static "Live from the Floor" mock page.
 */
export default async function LivePage() {
  if (!venue.features.liveStream) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-bone">The Digital Stage isn&apos;t available at this venue.</p>
      </div>
    );
  }

  const snapshot = await getStageRepository().getSnapshot(DEFAULT_VENUE_SLUG);
  if (!snapshot) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-bone">The stage isn&apos;t set up yet.</p>
        <p className="mt-3 text-sm text-muted">
          Supabase is configured but no venue with slug <code className="text-gold">{DEFAULT_VENUE_SLUG}</code> has a Digital Stage. See DIGITAL_STAGE_SETUP.md.
        </p>
        <Link href="/" className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-gold">← Home</Link>
      </div>
    );
  }

  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Digital Stage"
        title={`Live from ${snapshot.venue.name}`}
        description="One stage, every performer. Watch who's on right now, see who's up next, and grab a table before you head out."
      />
      <DigitalStage initial={snapshot} events={upcoming} visitNote={venue.digitalStage.visitNote} hours={venue.hours} phone={venue.phone} />
    </div>
  );
}
