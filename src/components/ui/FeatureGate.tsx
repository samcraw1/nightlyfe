import Link from "next/link";
import type { ReactNode } from "react";
import { venue } from "@/config/venue";
import type { VenueFeatures } from "@/clubs/types";

/**
 * Route-level feature flag. Used from segment layouts so a disabled module's
 * pages never render (or prerender) for clubs that turned it off.
 */
export default function FeatureGate({
  feature,
  name,
  children,
}: {
  feature: keyof VenueFeatures;
  name: string;
  children: ReactNode;
}) {
  if (venue.features[feature]) return <>{children}</>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="eyebrow mb-3">Not enabled</p>
      <p className="font-display text-3xl text-bone">{name} isn&apos;t available at {venue.name}.</p>
      <p className="mt-3 text-sm text-muted">This module is switched off in the club&apos;s platform configuration.</p>
      <Link href="/" className="mt-8 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-gold">
        ← Home
      </Link>
    </div>
  );
}
