import { notFound } from "next/navigation";
import { entertainers, getEntertainer } from "@/data/entertainers";
import MockImage from "@/components/ui/MockImage";
import Badge from "@/components/ui/Badge";
import TalentBookingForm from "@/components/talent/TalentBookingForm";
import { formatCount } from "@/lib/format";

export function generateStaticParams() {
  return entertainers
    .filter((e) => e.type === "model" || e.type === "dj")
    .map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const talent = getEntertainer((await params).id);
  return { title: talent ? talent.name : "Talent" };
}

export default async function TalentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const talent = getEntertainer((await params).id);

  if (!talent || (talent.type !== "model" && talent.type !== "dj")) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery (Left) */}
        <div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {Array.from({ length: talent.galleryCount }, (_, i) => (
              <MockImage
                key={i}
                hue={(talent.hue + i * 24) % 360}
                label={talent.name}
                className="aspect-[3/4] rounded-2xl"
              />
            ))}
          </div>
        </div>

        {/* Details & Form (Right) */}
        <div className="space-y-6">
          {/* Name & Featured Badge */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              {talent.featured ? (
                <Badge variant="gold">Featured</Badge>
              ) : null}
            </div>
            <h1 className="gold-text font-display text-4xl sm:text-5xl">
              {talent.name}
            </h1>
            <p className="mt-2 text-sm text-bone/80">{talent.tagline}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted">
              {formatCount(talent.followers)} followers
            </p>
          </div>

          {/* Details Card */}
          <div className="glass rounded-3xl p-6">
            <p className="eyebrow mb-4">
              {talent.type === "model" ? "Measurements" : "Specifications"}
            </p>
            <ul className="space-y-2.5 text-sm">
              {talent.dimensions && talent.type === "model" ? (
                <>
                  <li className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-bone/80">Height</span>
                    <span className="font-semibold text-gold">
                      {talent.dimensions.height}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-bone/80">Bust</span>
                    <span className="font-semibold text-gold">
                      {talent.dimensions.bust}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-bone/80">Waist</span>
                    <span className="font-semibold text-gold">
                      {talent.dimensions.waist}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-bone/80">Hips</span>
                    <span className="font-semibold text-gold">
                      {talent.dimensions.hips}
                    </span>
                  </li>
                  <li className="flex justify-between pb-2.5">
                    <span className="text-bone/80">Credits</span>
                    <span className="font-semibold text-gold">
                      {talent.dimensions.credits}
                    </span>
                  </li>
                </>
              ) : talent.djSpecs && talent.type === "dj" ? (
                <>
                  <li className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-bone/80">Genres</span>
                    <span className="font-semibold text-gold">
                      {talent.djSpecs.genres.join(", ")}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-bone/80">Years Experience</span>
                    <span className="font-semibold text-gold">
                      {talent.djSpecs.yearsExp}
                    </span>
                  </li>
                  <li className="flex justify-between pb-2.5">
                    <span className="text-bone/80">Equipment</span>
                    <span className="text-right font-semibold text-gold">
                      {talent.djSpecs.equipment.join(", ")}
                    </span>
                  </li>
                </>
              ) : null}
            </ul>
          </div>

          {/* Booking Form */}
          <TalentBookingForm />
        </div>
      </div>
    </div>
  );
}
