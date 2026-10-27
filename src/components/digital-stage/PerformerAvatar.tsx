import MockImage from "@/components/ui/MockImage";
import type { StageEntertainer } from "@/lib/digital-stage/types";

/** Photo when the venue has uploaded one, placeholder art otherwise. */
export default function PerformerAvatar({ entertainer, className = "" }: { entertainer: StageEntertainer; className?: string }) {
  if (entertainer.profileImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={entertainer.profileImageUrl} alt={entertainer.stageName} className={`object-cover ${className}`} />
    );
  }
  return <MockImage hue={entertainer.hue ?? 42} label={entertainer.stageName} className={className} />;
}
