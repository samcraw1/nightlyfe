"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, LayoutDashboard, Loader2, Lock } from "lucide-react";
import { submitInquiry, validateVip, type VipInquiry } from "@/lib/inquiries";
import { locationName, useLocations } from "@/lib/network-store";
import { EASE } from "@/components/ui/motion";

const PARTY_SIZES = ["2–4 guests", "5–8 guests", "9–12 guests", "13–20 guests", "20+ guests"];

type Fields = Omit<VipInquiry, "kind">;

function today(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/**
 * VIP reservation inquiry across the network: club → date → party size →
 * contact → requests → confirmation. Simulated: nothing is transmitted.
 */
export default function VipInquiryForm({ defaultClub = "" }: { defaultClub?: string }) {
  const locations = useLocations();
  const empty: Fields = { club: defaultClub, name: "", phone: "", email: "", date: "", partySize: "", requests: "" };
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [reference, setReference] = useState("");

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateVip(fields);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`vip-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    const res = await submitInquiry({ kind: "vip", ...fields });
    setReference(res.reference);
    setStatus("done");
  }

  const err = (k: keyof Fields) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `vip-${k}-err` : undefined,
  });

  return (
    <div className="glass-strong relative rounded-[1.5rem] p-5 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-[30rem] flex-col items-center justify-center text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink">
              <Check className="h-7 w-7" aria-hidden />
            </span>
            <p className="eyebrow mt-6">Request received</p>
            <h3 className="mt-2 font-display text-4xl text-bone">{locationName(fields.club)}</h3>
            <dl className="mt-6 grid w-full max-w-sm grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 text-left text-xs">
              {[
                ["Reference", reference],
                ["Date", fields.date],
                ["Party", fields.partySize],
                ["Guest", fields.name.split(" ")[0]],
              ].map(([k, v]) => (
                <div key={k} className="bg-ink-2 px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-bone/45">{k}</dt>
                  <dd className="mt-0.5 font-medium text-bone">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-bone/65">
              <Lock className="mr-1.5 inline h-3 w-3 align-[-1px]" aria-hidden />
              Demonstration only. Nothing was sent and no reservation was made. A copy stays in this browser so you can see it in the management dashboard.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/admin-demo?tab=inquiries" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-bone">
                <LayoutDashboard className="h-4 w-4" aria-hidden /> See it in the dashboard
              </Link>
              <button
                onClick={() => {
                  setFields(empty);
                  setStatus("idle");
                }}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-bone/60 hover:text-bone"
              >
                New request
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
            <Field id="vip-club" step="1" label="Club" error={errors.club} className="sm:col-span-2">
              <select id="vip-club" className="lx-field" value={fields.club} onChange={(e) => set("club")(e.target.value)} {...err("club")}>
                <option value="">Select a club</option>
                {locations.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.name}, {l.city}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="vip-date" step="2" label="Preferred date" error={errors.date}>
              <input id="vip-date" type="date" min={today()} className="lx-field" value={fields.date} onChange={(e) => set("date")(e.target.value)} {...err("date")} />
            </Field>
            <Field id="vip-partySize" step="3" label="Party size" error={errors.partySize}>
              <select id="vip-partySize" className="lx-field" value={fields.partySize} onChange={(e) => set("partySize")(e.target.value)} {...err("partySize")}>
                <option value="">Select</option>
                {PARTY_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field id="vip-name" step="4" label="Full name" error={errors.name} className="sm:col-span-2">
              <input id="vip-name" autoComplete="name" className="lx-field" placeholder="Your name" value={fields.name} onChange={(e) => set("name")(e.target.value)} {...err("name")} />
            </Field>
            <Field id="vip-phone" label="Phone" error={errors.phone}>
              <input id="vip-phone" type="tel" inputMode="tel" autoComplete="tel" className="lx-field" placeholder="(214) 555-0123" value={fields.phone} onChange={(e) => set("phone")(e.target.value)} {...err("phone")} />
            </Field>
            <Field id="vip-email" label="Email" error={errors.email}>
              <input id="vip-email" type="email" inputMode="email" autoComplete="email" className="lx-field" placeholder="you@email.com" value={fields.email} onChange={(e) => set("email")(e.target.value)} {...err("email")} />
            </Field>
            <Field id="vip-requests" step="5" label="Special requests" optional className="sm:col-span-2">
              <textarea id="vip-requests" rows={3} className="lx-field resize-none" placeholder="Birthday, bachelor party, section preference…" value={fields.requests} onChange={(e) => set("requests")(e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-8 py-4 text-xs font-bold uppercase disabled:opacity-70"
              >
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Crown className="h-4 w-4" aria-hidden />}
                {status === "sending" ? "Sending…" : "Request VIP Experience"}
              </button>
              <p className="mt-3 text-center text-[11px] text-bone/40">Demo interface. Nothing is transmitted or reserved.</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  id,
  label,
  step,
  error,
  optional,
  className = "",
  children,
}: {
  id: string;
  label: string;
  step?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone/70">
        {step ? <span className="text-gold">{step.padStart(2, "0")}</span> : null}
        {label}
        {optional ? <span className="ml-auto text-[10px] normal-case tracking-normal text-bone/35">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-[#e0475a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
