import type { Metadata } from "next";
import FeatureGate from "@/components/ui/FeatureGate";
import { venue } from "@/config/venue";

export const metadata: Metadata = { title: "Management Dashboard (Demo)", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  // Single-venue clubs get their own dashboard; network clubs the multi-location one.
  const feature = venue.features.venueDashboard ? "venueDashboard" : "network";
  return (
    <FeatureGate feature={feature} name="The management dashboard">
      {children}
    </FeatureGate>
  );
}
