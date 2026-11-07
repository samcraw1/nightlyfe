import FeatureGate from "@/components/ui/FeatureGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureGate feature="messaging" name="Messaging">
      {children}
    </FeatureGate>
  );
}
