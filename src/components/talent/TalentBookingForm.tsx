"use client";

import { useState } from "react";
import { newId } from "@/lib/format";
import { useApp } from "@/lib/store";
import type { TalentBooking } from "@/types";
import Button from "@/components/ui/Button";

const PERFORMANCE_TYPES = [
  "Photo Shoot",
  "Music Video",
  "Live Performance",
  "Brand Campaign",
  "Club Appearance",
];

export default function TalentBookingForm() {
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
    const booking: TalentBooking = {
      id: newId("booking"),
      type: "talent",
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      phoneNumber: parseInt(formData.get("phoneNumber") as string, 10),
      estimatedBudget: parseFloat(formData.get("estimatedBudget") as string),
      performanceType: Array.from(checkedTypes),
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
        <p className="font-display text-2xl text-bone">Inquiry submitted</p>
        <p className="mt-2 text-sm text-muted">
          We'll review your request and get back to you shortly.
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-muted">
          Demo inquiry — no one was actually booked
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8">
      <p className="eyebrow mb-6">Booking Inquiry</p>

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
          step="100"
          min="0"
          required
          className="w-full rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
        />

        {/* Performance types checkboxes */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-bone/80">
            Type of work
          </p>
          {PERFORMANCE_TYPES.map((type) => (
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
          placeholder="Additional details or requirements"
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-ink/50 px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 transition focus:border-gold/50 focus:outline-none"
        />
      </div>

      {/* Submit button */}
      <Button type="submit" className="mt-6 w-full">
        Submit Inquiry
      </Button>

      <p className="mt-4 text-center text-[10px] uppercase tracking-wider text-muted">
        We typically respond within 24 hours
      </p>
    </form>
  );
}
