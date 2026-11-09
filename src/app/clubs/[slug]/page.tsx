import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { venue } from "@/config/venue";
import ClubPage from "@/components/network/ClubPage";

const locations = venue.locations ?? [];

export function generateStaticParams() {
  return venue.features.network ? locations.map((l) => ({ slug: l.slug })) : [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = locations.find((x) => x.slug === slug);
  if (!l) return { title: "Club" };
  return {
    title: l.name,
    description: l.summary,
    openGraph: { title: `${l.name} — ${venue.name}`, description: l.summary, images: l.image ? [{ url: l.image }] : undefined },
  };
}

export default async function ClubRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!locations.some((l) => l.slug === slug)) notFound();
  return <ClubPage slug={slug} />;
}
