"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  Check,
  Clapperboard,
  Loader2,
  MessageCircle,
  PartyPopper,
  ShieldCheck,
} from "lucide-react";
import type { BookingCategory } from "@/clubs/types";
import { content, venue } from "@/config/venue";
import { submitInquiry } from "@/lib/inquiries";
import { EASE, SectionTitle } from "@/components/ui/motion";
import { StatusBadge, onBookingRequest } from "./shared";

const ICONS: Record<BookingCategory, typeof PartyPopper> = {
  "private-event": PartyPopper,
  "music-video": Clapperboard,
  photoshoot: Camera,
  "venue-rental": Building2,
  general: MessageCircle,
};

const STEPS = ["Type", "Details", "Contact", "Review"] as const;
const GUESTS = ["1–10", "11–25", "26–50", "51–100", "100+"];

/** Category-specific prompts for the details step. */
const DETAIL_COPY: Record<BookingCategory, { guestsLabel: string; detailsLabel: string; placeholder: string; extra?: { key: string; label: string; options: string[] } }> = {
  "private-event": {
    guestsLabel: "Number of guests",
    detailsLabel: "Tell us about the event",
    placeholder: "Occasion, the vibe you want, music, sections, timing…",
    extra: { key: "Occasion", label: "Occasion", options: ["Birthday", "Celebration", "Corporate", "Release party", "Other"] },
  },
  "music-video": {
    guestsLabel: "Cast & crew on set",
    detailsLabel: "Project details",
    placeholder: "Artist, director, concept, scenes, lighting needs, extras…",
    extra: { key: "Duration", label: "Time on location", options: ["2–4 hours", "Half day", "Full day", "Overnight"] },
  },
  photoshoot: {
    guestsLabel: "People on set",
    detailsLabel: "Shoot details",
    placeholder: "Photographer, concept, looks, references, deliverables…",
    extra: { key: "Duration", label: "Session length", options: ["1–2 hours", "2–4 hours", "Half day", "Full day"] },
  },
  "venue-rental": {
    guestsLabel: "Expected attendance",
    detailsLabel: "What's the rental for?",
    placeholder: "Launch, screening, rehearsal, pop-up… and the hours you need.",
    extra: { key: "Timing", label: "Preferred timing", options: ["Daytime", "Evening", "Late night", "Flexible"] },
  },
  general: {
    guestsLabel: "Party size",
    detailsLabel: "How can we help?",
    placeholder: "Sections, upcoming nights, partnerships, anything else…",
  },
};

interface Form {
  category: BookingCategory | "";
  date: string;
  guests: string;
  extra: string;
  details: string;
  requests: string;
  name: string;
  phone: string;
  email: string;
}

const EMPTY: Form = { category: "", date: "", guests: "", extra: "", details: "", requests: "", name: "", phone: "", email: "" };

type Errors = Partial<Record<keyof Form, string>>;

function validate(step: number, f: Form): Errors {
  const e: Errors = {};
  if (step === 0 && !f.category) e.category = "Choose what you'd like to book.";
  if (step === 1) {
    if (!f.date) e.date = "Pick a requested date.";
    else if (f.date < new Date().toISOString().slice(0, 10)) e.date = "Choose a date in the future.";
    if (!f.guests) e.guests = "Choose a number.";
    if (f.details.trim().length < 10) e.details = "Add a few more details (10+ characters).";
  }
  if (step === 2) {
    if (f.name.trim().length < 2) e.name = "Enter your full name.";
    if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email.";
  }
  return e;
}

/**
 * The flagship multi-step booking inquiry. Demo only: submissions go through
 * the simulated `submitInquiry` (nothing leaves the browser) and appear in
 * the /admin-demo inbox in this browser.
 */
export default function BookingWizard() {
  const reduce = useReducedMotion();
  const uid = useId();
  const options = content.playhouse?.bookingOptions ?? [];
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [reference, setReference] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // CTAs elsewhere on the page preselect a category and jump here.
  useEffect(
    () =>
      onBookingRequest((type) => {
        setForm((f) => ({ ...f, category: type }));
        setErrors({});
        setStatus("idle");
        setDir(1);
        setStep(1);
      }),
    [],
  );

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
  };

  const next = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length) return;
    go(step + 1);
  };

  const submit = async () => {
    for (const s of [0, 1, 2]) {
      const e = validate(s, form);
      if (Object.keys(e).length) {
        setErrors(e);
        go(s);
        return;
      }
    }
    setStatus("sending");
    const copy = form.category ? DETAIL_COPY[form.category] : undefined;
    const details = copy?.extra && form.extra ? `${copy.extra.key}: ${form.extra}. ${form.details.trim()}` : form.details.trim();
    const res = await submitInquiry({
      kind: "booking",
      category: form.category as BookingCategory,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      date: form.date,
      guests: form.guests,
      details,
      requests: form.requests.trim() || undefined,
    });
    setReference(res.reference);
    setStatus("done");
  };

  const restart = () => {
    setForm(EMPTY);
    setErrors({});
    setStatus("idle");
    setDir(-1);
    setStep(0);
  };

  const chosen = options.find((o) => o.id === form.category);
  const copy = form.category ? DETAIL_COPY[form.category] : DETAIL_COPY.general;
  const today = new Date().toISOString().slice(0, 10);
  const err = (k: keyof Form) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-1.5 text-xs text-blood">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Form) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -40 }),
  };

  return (
    <section id="book" aria-labelledby="book-title" className="relative">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <SectionTitle
            id="book-title"
            eyebrow="Booking Inquiries"
            title={
              <>
                Reserve the room. <span className="pl-gold-text italic">Set the scene.</span>
              </>
            }
            body="Private events, music video shoots, photoshoots and venue rentals, all from one inquiry. Four quick steps, and management follows up to confirm the details."
          />
          <ul className="mt-8 space-y-3 text-sm text-bone/70">
            {[
              "Tell us what you're planning",
              "Pick a date and group size",
              "Leave your contact details",
              "Get a reference number instantly",
            ].map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gold/40 text-[11px] font-bold text-gold">{i + 1}</span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-bone/60">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" aria-hidden />
            Demonstration form. Nothing is sent to Bibs Playhouse and no booking is made. Inquiries stay in this browser so the management demo can show them.
          </p>
        </div>

        <div className="pl-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2/80 backdrop-blur-xl">
          <div className="pl-grain" aria-hidden />
          {status !== "done" ? (
            <>
              {/* progress */}
              <div className="relative border-b border-white/5 px-5 pb-5 pt-6 sm:px-8">
                <ol className="flex items-center justify-between gap-2" aria-label="Booking steps">
                  {STEPS.map((label, i) => {
                    const done = i < step;
                    const current = i === step;
                    return (
                      <li key={label} className="flex flex-1 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => (i < step ? go(i) : undefined)}
                          disabled={i >= step}
                          aria-current={current ? "step" : undefined}
                          className="flex items-center gap-2 disabled:cursor-default"
                        >
                          <span
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                              done ? "bg-gold text-ink" : current ? "border border-gold text-gold" : "border border-white/15 text-bone/40"
                            }`}
                          >
                            {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                          </span>
                          <span className={`hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:inline ${current ? "text-bone" : "text-bone/45"}`}>{label}</span>
                        </button>
                        {i < STEPS.length - 1 ? <span className={`h-px flex-1 ${done ? "bg-gold/60" : "bg-white/10"}`} aria-hidden /> : null}
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--accent-2), var(--gold))" }}
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </div>
              </div>

              <div ref={panelRef} tabIndex={-1} className="relative min-h-[28rem] px-5 py-7 outline-none sm:px-8">
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {step === 0 ? (
                      <fieldset>
                        <legend className="font-display text-2xl text-bone sm:text-3xl">What would you like to book?</legend>
                        <p className="mt-2 text-sm text-bone/55">Choose a category. You can change it later.</p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Booking type" {...aria("category")}>
                          {options.map((o) => {
                            const Icon = ICONS[o.id];
                            const active = form.category === o.id;
                            return (
                              <button
                                key={o.id}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => set("category", o.id)}
                                onDoubleClick={() => {
                                  set("category", o.id);
                                  go(1);
                                }}
                                className={`group relative flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
                                  active ? "border-gold bg-gold/10" : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]"
                                } ${o.id === "general" ? "sm:col-span-2" : ""}`}
                              >
                                <span
                                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition ${
                                    active ? "bg-gold text-ink" : "bg-accent-2/25 text-bone group-hover:bg-accent-2/40"
                                  }`}
                                >
                                  <Icon className="h-5 w-5" aria-hidden />
                                </span>
                                <span className="min-w-0">
                                  <span className="block font-semibold text-bone">{o.label}</span>
                                  <span className="mt-0.5 block text-xs text-bone/55">{o.blurb}</span>
                                </span>
                                {active ? <Check className="absolute right-4 top-4 h-4 w-4 text-gold" aria-hidden /> : null}
                              </button>
                            );
                          })}
                        </div>
                        {err("category")}
                      </fieldset>
                    ) : null}

                    {step === 1 ? (
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-display text-2xl text-bone sm:text-3xl">{chosen?.label ?? "Details"}</h3>
                          {chosen ? <StatusBadge status={chosen.status} /> : null}
                        </div>
                        <p className="mt-2 text-sm text-bone/55">The basics management needs to check availability.</p>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-bone/60">Requested date</span>
                            <input type="date" min={today} value={form.date} onChange={(e) => set("date", e.target.value)} className="pl-field" {...aria("date")} />
                            {err("date")}
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-bone/60">{copy.guestsLabel}</span>
                            <select value={form.guests} onChange={(e) => set("guests", e.target.value)} className="pl-field" {...aria("guests")}>
                              <option value="">Select…</option>
                              {GUESTS.map((g) => (
                                <option key={g} value={g}>
                                  {g}
                                </option>
                              ))}
                            </select>
                            {err("guests")}
                          </label>
                          {copy.extra ? (
                            <div className="sm:col-span-2">
                              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-bone/60">{copy.extra.label}</span>
                              <div className="flex flex-wrap gap-2">
                                {copy.extra.options.map((o) => (
                                  <button
                                    key={o}
                                    type="button"
                                    aria-pressed={form.extra === o}
                                    onClick={() => set("extra", form.extra === o ? "" : o)}
                                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                      form.extra === o ? "border-gold bg-gold text-ink" : "border-white/15 text-bone/75 hover:border-white/35"
                                    }`}
                                  >
                                    {o}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : null}
                          <label className="block sm:col-span-2">
                            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-bone/60">{copy.detailsLabel}</span>
                            <textarea rows={4} value={form.details} onChange={(e) => set("details", e.target.value)} placeholder={copy.placeholder} className="pl-field resize-none" {...aria("details")} />
                            {err("details")}
                          </label>
                          <label className="block sm:col-span-2">
                            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-bone/60">
                              Special requests <span className="normal-case tracking-normal text-bone/35">(optional)</span>
                            </span>
                            <input value={form.requests} onChange={(e) => set("requests", e.target.value)} placeholder="Decor, accessibility, load-in, dietary…" className="pl-field" />
                          </label>
                        </div>
                      </div>
                    ) : null}

                    {step === 2 ? (
                      <div>
                        <h3 className="font-display text-2xl text-bone sm:text-3xl">How do we reach you?</h3>
                        <p className="mt-2 text-sm text-bone/55">Used only to follow up on this inquiry.</p>
                        <div className="mt-6 grid gap-5">
                          <label className="block">
                            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-bone/60">Full name</span>
                            <input autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className="pl-field" {...aria("name")} />
                            {err("name")}
                          </label>
                          <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block">
                              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-bone/60">Phone number</span>
                              <input type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(501) 555-0123" className="pl-field" {...aria("phone")} />
                              {err("phone")}
                            </label>
                            <label className="block">
                              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-bone/60">Email</span>
                              <input type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className="pl-field" {...aria("email")} />
                              {err("email")}
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {step === 3 ? (
                      <div>
                        <h3 className="font-display text-2xl text-bone sm:text-3xl">Review your inquiry</h3>
                        <p className="mt-2 text-sm text-bone/55">Check everything, then send.</p>
                        <dl className="mt-6 divide-y divide-white/5 rounded-2xl border border-white/10 bg-black/20">
                          {[
                            ["Booking type", chosen?.label ?? "—", 0],
                            ["Requested date", form.date ? new Date(form.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "—", 1],
                            [copy.guestsLabel, form.guests || "—", 1],
                            ...(copy.extra && form.extra ? [[copy.extra.label, form.extra, 1] as const] : []),
                            [copy.detailsLabel, form.details || "—", 1],
                            ...(form.requests ? [["Special requests", form.requests, 1] as const] : []),
                            ["Name", form.name, 2],
                            ["Phone", form.phone, 2],
                            ["Email", form.email, 2],
                          ].map(([k, v, s]) => (
                            <div key={k as string} className="flex items-start justify-between gap-4 px-4 py-3">
                              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-bone/45">{k}</dt>
                              <dd className="flex min-w-0 items-start gap-3 text-right text-sm text-bone">
                                <span className="break-words">{v}</span>
                                <button type="button" onClick={() => go(s as number)} className="flex-shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-gold hover:text-gold-bright">
                                  Edit
                                </button>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative flex items-center justify-between gap-3 border-t border-white/5 px-5 py-5 sm:px-8">
                {step > 0 ? (
                  <button type="button" onClick={() => go(step - 1)} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-bone/70 transition hover:text-bone">
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back
                  </button>
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.18em] text-bone/40">Step 1 of 4</span>
                )}
                {step < 3 ? (
                  <button type="button" onClick={next} className="pl-btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[11px] font-bold uppercase transition hover:brightness-110 active:scale-[0.98]">
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      type="button"
                      onClick={submit}
                      disabled={status === "sending"}
                      className="pl-btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[11px] font-bold uppercase transition hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
                    >
                      {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
                      {status === "sending" ? "Sending…" : "Send inquiry"}
                    </button>
                    <span className="text-[10px] text-bone/40">Demo: no information is sent.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="relative flex min-h-[36rem] flex-col items-center justify-center px-6 py-12 text-center"
              role="status"
              aria-live="polite"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
                className="pl-btn-gold flex h-20 w-20 items-center justify-center rounded-full"
              >
                <Check className="h-9 w-9" aria-hidden />
              </motion.span>
              <p className="eyebrow mt-8">Inquiry received</p>
              <h3 className="mt-3 font-display text-4xl text-bone sm:text-5xl">Thank you, {form.name.split(" ")[0]}.</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/65">
                Your {chosen?.label.toLowerCase()} inquiry for{" "}
                {new Date(form.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })} is logged. In a live site, the {venue.shortName} team would follow up by phone or email.
              </p>
              <p className="mt-6 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 font-mono text-sm tracking-[0.2em] text-gold">{reference}</p>
              <p className="mt-6 max-w-sm text-[11px] leading-relaxed text-bone/45">{venue.demo.transactionNote} It now appears in the management demo in this browser.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={restart} className="rounded-full border border-white/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-bone transition hover:border-gold hover:text-gold">
                  New inquiry
                </button>
                <a href="/admin-demo?tab=bookings" className="pl-btn-gold rounded-full px-6 py-3 text-[11px] font-bold uppercase transition hover:brightness-110">
                  See it in the dashboard
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
