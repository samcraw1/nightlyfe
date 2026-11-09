"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Crown, Loader2, MapPin, Send } from "lucide-react";
import { InstagramIcon } from "@/components/layout/icons";
import { venue } from "@/config/venue";
import { submitInquiry } from "@/lib/inquiries";
import { FadeIn, SectionTitle } from "@/components/ui/motion";

const HANDLE_ROLES: Record<string, string> = {
  "@pinkhouse_memphis": "Memphis · official updates",
  "@pinkhouse_htown": "Houston location",
  "@js_mgmnt": "Booking & management",
};

export default function ContactSocial() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || form.message.trim().length < 5) {
      setError("Add your name, a valid email, and a short message.");
      return;
    }
    setError("");
    setStatus("sending");
    await submitInquiry({ kind: "general", ...form });
    setStatus("done");
  }

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionTitle
            id="contact-title"
            eyebrow="Contact & Social"
            title={
              <>
                Be first to <span className="ph-pink-text italic">know</span>.
              </>
            }
            body="Opening news, the address, and first-night details will drop on Instagram first. Follow along."
          />

          <FadeIn delay={0.1} className="mt-10 space-y-3">
            {venue.socialLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-gold/50 hover:bg-gold/[0.05]"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-bright to-gold-deep text-white">
                    <InstagramIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-bone">{s.label}</span>
                    <span className="block text-xs text-bone/50">{HANDLE_ROLES[s.label] ?? "Instagram"}</span>
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-bone/40 transition group-hover:text-gold-bright" aria-hidden />
              </a>
            ))}
          </FadeIn>

          <FadeIn delay={0.15} className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 p-5">
              <MapPin className="h-5 w-5 text-gold-bright" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-bone">Location</p>
              <p className="mt-1 text-xs leading-relaxed text-bone/55">Memphis, TN. Address to be announced.</p>
            </div>
            <a href="#vip" className="group rounded-2xl border border-gold/30 bg-gold/[0.05] p-5 transition hover:border-gold">
              <Crown className="h-5 w-5 text-gold-bright" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-bone">VIP inquiries</p>
              <p className="mt-1 text-xs leading-relaxed text-bone/55">
                Use the VIP request form <span className="text-gold-bright group-hover:underline">above</span>.
              </p>
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="glass-strong h-full rounded-[1.75rem] p-6 sm:p-8">
            <h3 className="font-display text-3xl text-bone">General contact</h3>
            <p className="mt-2 text-sm text-bone/55">Press, partnerships, and general questions.</p>
            {status === "done" ? (
              <div role="status" className="mt-8 flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white">
                  <Check className="h-6 w-6" aria-hidden />
                </span>
                <p className="mt-4 font-semibold text-bone">Message received (demo)</p>
                <p className="mt-1 text-xs text-bone/55">Nothing was sent. This form isn&rsquo;t connected to a backend.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/70">Name</label>
                  <input id="c-name" autoComplete="name" className="ph-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="c-email" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/70">Email</label>
                  <input id="c-email" type="email" autoComplete="email" inputMode="email" className="ph-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="c-msg" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/70">Message</label>
                  <textarea id="c-msg" rows={4} className="ph-field resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                {error ? <p className="text-xs text-blood" role="alert">{error}</p> : null}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/60 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-bright transition hover:bg-gold hover:text-white disabled:opacity-60"
                >
                  {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
                <p className="text-center text-[11px] text-bone/40">Demo form: nothing is sent or stored.</p>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
