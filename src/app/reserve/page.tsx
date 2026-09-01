import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ReservationForm from "@/components/reserve/ReservationForm";
import { venue } from "@/config/venue";

export const metadata: Metadata = { title: "Reserve a Table" };

export default function ReservePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Skip the line"
        title="Reserve a Table"
        description={`Pick your night, your section, and your package — a ${venue.name} host takes care of the rest.`}
      />
      <ReservationForm />
    </div>
  );
}
