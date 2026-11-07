import type { Metadata } from "next";
import FeatureGate from "@/components/ui/FeatureGate";

export const metadata: Metadata = { title: "Admin Preview", robots: { index: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureGate feature="adminPreview" name="The admin preview">
      {children}
    </FeatureGate>
  );
}
