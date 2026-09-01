"use client";

import { useState } from "react";
import { newId } from "@/lib/format";
import { useApp } from "@/lib/store";
import type { EventBooking } from "@/types";
import Button from "@/components/ui/Button";

const EVENT_TYPES = [
  "Private Party",
  "Corporate Event",
  "Wedding",
  "Grand Opening",
  "Festival",
];

export default function EventBookingForm() {
  const { addBookingRequest } = useApp();
  const [done, setDone] = useState(false);
  const [checkedTypes, setCheckedTypes] = useState<Set<string>>(new Set());

  const handleTypeChange = (type: string) => {
    setCheckedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const booking: EventBooking = {
      id: newId("booking"),
      type: "event",
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      phoneNumber: parseInt(formData.get("phoneNumber") as string, 10),
      estimatedBudget: parseFloat(formData.get("estimatedBudget") as string),
      eventType: Array.from(checkedTypes),
      additionalNotes: formData.get("additionalNotes") as string,
    };

    addBookingRequest(booking);
    setDone(true);
  };

  if (done) {
    return (
      <div className="glass rounded-3xl p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
          ✓
        </div>
        <p className="font-display text-2xl text-bone">Event inquiry submitted</p>
        <p className="mt-2 text-sm text-muted">
          Our events team will review your details and contact you soon.
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-muted">
          Demo inquiry — no bookings were made
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8">
      <p className="eyebrow mb-6">Event Booking Request</p>

      <div className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            required
            className="rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            required
            className="rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
          />
        </div>

        {/* Company */}
        <input
          type="text"
          name="company"
          placeholder="Company / Organization"
          required
          className="w-full rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
        />

        {/* Email & Phone row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone"
            required
            className="rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
          />
        </div>

        {/* Budget */}
        <input
          type="number"
          name="estimatedBudget"
          placeholder="Estimated budget ($)"
          step="500"
          min="0"
          required
          className="w-full rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
        />

        {/* Event type checkboxes */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-bone/80">
            Event type
          </p>
          {EVENT_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checkedTypes.has(type)}
                onChange={() => handleTypeChange(type)}
                className="h-4 w-4 rounded border border-gold/40 bg-ink/50 accent-gold"
              />
              <span className="text-sm text-bone/80">{type}</span>
            </label>
          ))}
        </div>

        {/* Notes */}
        <textarea
          name="additionalNotes"
          placeholder="Tell us about your event — date, expected guests, special requests, etc."
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
        />
      </div>

      {/* Submit button */}
      <Button type="submit" className="mt-6 w-full">
        Submit Event Request
      </Button>

      <p className="mt-4 text-center text-[10px] uppercase tracking-wider text-muted">
        We'll respond within 48 hours with pricing and availability
      </p>
    </form>
  );
}
