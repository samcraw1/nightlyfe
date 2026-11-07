import FeatureGate from "@/components/ui/FeatureGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureGate feature="webcams" name="The performer webcam studio">
      {children}
    </FeatureGate>
  );
}
