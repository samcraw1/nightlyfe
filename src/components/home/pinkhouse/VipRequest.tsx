"use client";

import Image from "next/image";
import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, Loader2, Lock, Users, Wine } from "lucide-react";
import { submitInquiry, validateVip, type VipInquiry } from "@/lib/inquiries";
import { EASE, FadeIn, SectionTitle } from "./motion";

const PARTY_SIZES = ["2–4 guests", "5–8 guests", "9–12 guests", "13–20 guests", "20+ guests"];

type Fields = Omit<VipInquiry, "kind">;
const EMPTY: Fields = { name: "", phone: "", email: "", date: "", partySize: "", requests: "" };

function today(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function VipRequest() {
  const [fields, setFields] = useState<Fields>(EMPTY);
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
      const first = Object.keys(found)[0];
      document.getElementById(`vip-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    const res = await submitInquiry({ kind: "vip", ...fields });
    setReference(res.reference);
    setStatus("done");
  }

  return (
    <section id="vip" aria-labelledby="vip-title" className="relative">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2">
        <Image
          src="/clubs/pinkhouse-memphis/particles.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-ink/40" />

        <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:p-14">
          <div className="flex flex-col">
            <SectionTitle
              id="vip-title"
              eyebrow="VIP Reservations"
              title={
                <>
                  Request the <span className="ph-pink-text italic">VIP</span> experience.
                </>
              }
              body="Tell us about your night. A VIP host would follow up personally with sections, availability, and details once Pinkhouse Memphis opens."
            />
            <FadeIn delay={0.15} className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-auto lg:grid-cols-1">
              {[
                { Icon: Crown, t: "Priority sections", d: "Requests are reviewed before public release." },
                { Icon: Users, t: "Groups & celebrations", d: "Birthdays, bachelorette nights, crews." },
                { Icon: Wine, t: "Personal host", d: "One point of contact for your night." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold-bright">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-bone">{t}</p>
                    <p className="text-xs leading-relaxed text-bone/55">{d}</p>
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <div className="glass-strong ph-glow relative rounded-[1.5rem] p-5 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {status === "done" ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                    role="status"
                  >
                    <span className="ph-glow flex h-16 w-16 items-center justify-center rounded-full bg-gold text-white">
                      <Check className="h-7 w-7" aria-hidden />
                    </span>
                    <h3 className="mt-6 font-display text-3xl text-bone">Request received</h3>
                    <p className="mt-2 text-sm text-bone/65">
                      Thank you, {fields.name.split(" ")[0]}. Reference <span className="font-mono text-gold-bright">{reference}</span>
                    </p>
                    <p className="mt-6 max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-bone/70">
                      <Lock className="mr-1.5 inline h-3 w-3 align-[-1px]" aria-hidden />
                      Demonstration only. Nothing was sent or stored, and no reservation was made. A live version would
                      route this to Pinkhouse&rsquo;s VIP team through an approved backend.
                    </p>
                    <button
                      onClick={() => {
                        setFields(EMPTY);
                        setStatus("idle");
                      }}
                      className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold-bright hover:text-bone"
                    >
                      Start another request
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={onSubmit}
                    noValidate
                    aria-describedby="vip-demo-note"
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <Field id="vip-name" label="Full name" error={errors.name} className="sm:col-span-2">
                      <input id="vip-name" autoComplete="name" className="ph-field" placeholder="Your name"
                        value={fields.name} onChange={(e) => set("name")(e.target.value)} aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "vip-name-err" : undefined} />
                    </Field>
                    <Field id="vip-phone" label="Phone number" error={errors.phone}>
                      <input id="vip-phone" type="tel" inputMode="tel" autoComplete="tel" className="ph-field" placeholder="(901) 555-0123"
                        value={fields.phone} onChange={(e) => set("phone")(e.target.value)} aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "vip-phone-err" : undefined} />
                    </Field>
                    <Field id="vip-email" label="Email" error={errors.email}>
                      <input id="vip-email" type="email" inputMode="email" autoComplete="email" className="ph-field" placeholder="you@email.com"
                        value={fields.email} onChange={(e) => set("email")(e.target.value)} aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "vip-email-err" : undefined} />
                    </Field>
                    <Field id="vip-date" label="Preferred date" error={errors.date}>
                      <input id="vip-date" type="date" min={today()} className="ph-field"
                        value={fields.date} onChange={(e) => set("date")(e.target.value)} aria-invalid={!!errors.date}
                        aria-describedby={errors.date ? "vip-date-err" : undefined} />
                    </Field>
                    <Field id="vip-partySize" label="Party size" error={errors.partySize}>
                      <select id="vip-partySize" className="ph-field" value={fields.partySize}
                        onChange={(e) => set("partySize")(e.target.value)} aria-invalid={!!errors.partySize}
                        aria-describedby={errors.partySize ? "vip-partySize-err" : undefined}>
                        <option value="">Select</option>
                        {PARTY_SIZES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                    <Field id="vip-requests" label="Special requests" optional className="sm:col-span-2">
                      <textarea id="vip-requests" rows={3} className="ph-field resize-none" placeholder="Birthday, celebration, bottle preferences…"
                        value={fields.requests} onChange={(e) => set("requests")(e.target.value)} />
                    </Field>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                      >
                        {status === "sending" ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : (
                          <Crown className="h-4 w-4" aria-hidden />
                        )}
                        {status === "sending" ? "Sending…" : "Request VIP Experience"}
                      </button>
                      <p id="vip-demo-note" className="mt-3 text-center text-[11px] leading-relaxed text-bone/45">
                        Demo interface: nothing is sent, stored, or reserved.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/70">
        {label}
        {optional ? <span className="text-[10px] normal-case tracking-normal text-bone/35">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-blood">
          {error}
        </p>
      ) : null}
    </div>
  );
}
