"use client";


import { venue } from "@/config/venue";
import PageHeader from "@/components/ui/PageHeader";
import MockImage from "@/components/ui/MockImage";
import EventBookingForm from "@/components/talent/EventBookingForm";

export default function EventBookingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <PageHeader
        eyebrow="Private Events"
        title="Book Your Event"
        description={venue.eventsBooking.description}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Hero Image (Left) */}
        <MockImage
          hue={45}
          label="Event booking"
          className="aspect-[3/4] rounded-3xl"
        />

        {/* Booking Form (Right) */}
        <div>
          <EventBookingForm />
        </div>
      </div>
    </div>
  );
}
