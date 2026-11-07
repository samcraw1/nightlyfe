import FeatureGate from "@/components/ui/FeatureGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureGate feature="merch" name="The shop">
      {children}
    </FeatureGate>
  );
}
