import type { Metadata } from "next";
import { webcams } from "@/data/webcams";
import PageHeader from "@/components/ui/PageHeader";
import WebcamCard from "@/components/live/WebcamCard";

export const metadata: Metadata = { title: "Webcams" };

export default function WebcamsPage() {
  const liveCount = webcams.filter((c) => c.live).length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow={`${liveCount} cameras live`}
        title="Webcams"
        description="Every room in the building, streaming live. Pick an angle and pull up a front-row seat from anywhere."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {webcams.map((cam) => (
          <WebcamCard key={cam.id} cam={cam} />
        ))}
      </div>
    </div>
  );
}
