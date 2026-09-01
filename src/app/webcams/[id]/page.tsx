import { notFound } from "next/navigation";
import Link from "next/link";
import { getWebcam, webcams } from "@/data/webcams";
import LivePlayer from "@/components/live/LivePlayer";
import WebcamCard from "@/components/live/WebcamCard";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";

export function generateStaticParams() {
  return webcams.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cam = getWebcam((await params).id);
  return { title: cam ? `${cam.name} Cam` : "Webcam" };
}

export default async function WebcamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cam = getWebcam((await params).id);
  if (!cam) notFound();

  const others = webcams.filter((c) => c.id !== cam.id && c.live);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="fade-up pt-8 sm:pt-12">
        <Link
          href="/webcams"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold-bright"
        >
          ← All webcams
        </Link>
        <h1 className="gold-text mt-3 mb-6 font-display text-4xl sm:text-5xl">
          {cam.name}
        </h1>
      </div>

      <LivePlayer
        title={`${cam.name} Camera`}
        subtitle={cam.live ? "Streaming live" : "Currently offline"}
        live={cam.live}
        viewers={cam.viewers}
        hue={cam.hue}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/reserve">Reserve a Table</Button>
        <Button href="/live" variant="outline">
          Main Stream
        </Button>
      </div>

      {others.length > 0 ? (
        <section className="mt-14">
          <SectionHeader eyebrow="Switch angles" title="Other Cameras" />
          <div className="grid gap-5 sm:grid-cols-2">
            {others.slice(0, 4).map((c) => (
              <WebcamCard key={c.id} cam={c} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
