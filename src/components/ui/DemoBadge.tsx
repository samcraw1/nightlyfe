import { venue } from "@/config/venue";
import Badge from "./Badge";

/**
 * Marks fictional / sample content when the active club is a demo build.
 * Renders nothing for clubs with real content.
 */
export default function DemoBadge({
  kind,
  label: labelOverride,
  className = "",
}: {
  kind: "performer" | "sample" | "simulated";
  /** Custom wording, e.g. "Placeholder profile" or "Demo event". */
  label?: string;
  className?: string;
}) {
  const on = kind === "performer" ? venue.demo.fictionalPerformers : venue.demo.sampleContent;
  if (!on) return null;
  const label = labelOverride ?? (kind === "performer" ? "Demo profile" : kind === "simulated" ? "Simulated" : "Sample");
  return (
    <Badge variant="demo" className={className}>
      {label}
    </Badge>
  );
}
