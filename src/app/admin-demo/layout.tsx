import type { Metadata } from "next";
import FeatureGate from "@/components/ui/FeatureGate";

export const metadata: Metadata = { title: "Management Dashboard (Demo)", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureGate feature="network" name="The multi-location dashboard">
      {children}
    </FeatureGate>
  );
}
