import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import BroadcasterDashboard from "@/components/digital-stage/dashboard/BroadcasterDashboard";
import { requireStaff } from "@/lib/digital-stage/auth";
import { DEFAULT_VENUE_SLUG } from "@/lib/digital-stage/mode";
import { getStageRepository } from "@/lib/digital-stage/repository";
import { StageError } from "@/lib/digital-stage/types";

export const metadata: Metadata = { title: "Digital Stage · Broadcaster" };
export const dynamic = "force-dynamic";

/**
 * Staff-only broadcaster console for the default venue. In production the
 * proxy sends signed-out users to /dashboard/login and requireStaff() checks
 * venue membership; in demo mode it is open and labelled as such.
 */
export default async function DigitalStageDashboardPage() {
  let actor;
  try {
    actor = await requireStaff(DEFAULT_VENUE_SLUG);
  } catch (error) {
    if (error instanceof StageError && error.status === 401) redirect("/dashboard/login?next=/dashboard/digital-stage");
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-bone">{error instanceof StageError ? error.message : "Something went wrong."}</p>
        <Link href="/dashboard/login" className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-gold">Sign in with a different account</Link>
      </div>
    );
  }

  const snapshot = await getStageRepository().getSnapshot(DEFAULT_VENUE_SLUG);
  if (!snapshot) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-bone">No Digital Stage found for &ldquo;{DEFAULT_VENUE_SLUG}&rdquo;.</p>
        <p className="mt-3 text-sm text-muted">Run the Supabase seed or onboard the venue (DIGITAL_STAGE_SETUP.md).</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <PageHeader eyebrow="Broadcaster dashboard" title="Digital Stage" description="Run tonight's stage from a phone or tablet: pick who's on, go live, swap performers without stopping the stream." />
      <BroadcasterDashboard initial={snapshot} actor={actor} />
    </div>
  );
}
