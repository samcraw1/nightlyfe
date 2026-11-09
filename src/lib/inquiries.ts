/**
 * Inquiry submission: the single integration point for VIP and general
 * contact forms.
 *
 * DEMO BUILD: nothing leaves the browser. No network request is made. For
 * multi-location ("network") and single-venue dashboard ("playhouse") clubs
 * a copy is kept in this browser's localStorage only, so the /admin-demo
 * inbox can show it. To go live, replace `submitInquiry` with a call to an
 * approved backend (e.g. a Route Handler that writes to the venue's
 * database and notifies the VIP host). Forms don't need to change.
 */

import { venue } from "@/config/venue";
import { recordInquiry } from "@/lib/network-store";
import { recordBooking } from "@/lib/venue-dashboard-store";
import type { BookingCategory } from "@/clubs/types";

export type InquiryKind = "vip" | "general" | "booking";

export interface VipInquiry {
  kind: "vip";
  /** Network clubs: location slug the guest picked. */
  club?: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  partySize: string;
  requests?: string;
}

export interface GeneralInquiry {
  kind: "general";
  name: string;
  email: string;
  message: string;
}

/** Booking inquiry from a "playhouse" club's multi-step booking form. */
export interface BookingInquiry {
  kind: "booking";
  category: BookingCategory;
  name: string;
  phone: string;
  email: string;
  date: string;
  guests: string;
  details: string;
  requests?: string;
}

export type Inquiry = VipInquiry | GeneralInquiry | BookingInquiry;

export interface InquiryResult {
  ok: boolean;
  /** Reference shown to the guest. */
  reference: string;
  demo: boolean;
}

export async function submitInquiry(inquiry: Inquiry): Promise<InquiryResult> {
  // Simulated latency so the UI's sending state is visible in the demo.
  await new Promise((r) => setTimeout(r, 900));
  const prefix = inquiry.kind === "vip" ? "VIP" : inquiry.kind === "booking" ? "BK" : "MSG";
  const reference = `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  if (inquiry.kind === "vip" && venue.features.network) {
    recordInquiry({
      id: reference,
      club: inquiry.club ?? "",
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      date: inquiry.date,
      partySize: inquiry.partySize,
      requests: inquiry.requests,
      status: "new",
      receivedAt: new Date().toISOString(),
      fromSite: true,
    });
  }
  if (inquiry.kind === "booking" && venue.features.venueDashboard) {
    const { kind: _kind, ...rest } = inquiry;
    void _kind;
    recordBooking({ ...rest, id: reference, status: "new", receivedAt: new Date().toISOString(), fromSite: true });
  }
  return { ok: true, reference, demo: true };
}

/** Basic client-side checks. Returns field → message for invalid fields. */
export function validateVip(v: Omit<VipInquiry, "kind">): Partial<Record<keyof VipInquiry, string>> {
  const errors: Partial<Record<keyof VipInquiry, string>> = {};
  if (v.name.trim().length < 2) errors.name = "Enter your name.";
  if (v.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email.";
  if (!v.date) errors.date = "Pick a preferred date.";
  if (!v.partySize) errors.partySize = "Choose a party size.";
  if (venue.features.network && !v.club) errors.club = "Choose a club.";
  return errors;
}
