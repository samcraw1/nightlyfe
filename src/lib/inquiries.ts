/**
 * Inquiry submission: the single integration point for VIP and general
 * contact forms.
 *
 * DEMO BUILD: nothing leaves the browser. No network request is made and
 * nothing is stored. To go live, replace `submitInquiry` with a call to an
 * approved backend (e.g. a Route Handler that writes to the venue's
 * database and notifies the VIP host). Forms don't need to change.
 */

export type InquiryKind = "vip" | "general";

export interface VipInquiry {
  kind: "vip";
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

export type Inquiry = VipInquiry | GeneralInquiry;

export interface InquiryResult {
  ok: boolean;
  /** Reference shown to the guest. */
  reference: string;
  demo: boolean;
}

export async function submitInquiry(inquiry: Inquiry): Promise<InquiryResult> {
  // Simulated latency so the UI's sending state is visible in the demo.
  await new Promise((r) => setTimeout(r, 900));
  const prefix = inquiry.kind === "vip" ? "VIP" : "MSG";
  return {
    ok: true,
    reference: `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    demo: true,
  };
}

/** Basic client-side checks. Returns field → message for invalid fields. */
export function validateVip(v: Omit<VipInquiry, "kind">): Partial<Record<keyof VipInquiry, string>> {
  const errors: Partial<Record<keyof VipInquiry, string>> = {};
  if (v.name.trim().length < 2) errors.name = "Enter your name.";
  if (v.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email.";
  if (!v.date) errors.date = "Pick a preferred date.";
  if (!v.partySize) errors.partySize = "Choose a party size.";
  return errors;
}
