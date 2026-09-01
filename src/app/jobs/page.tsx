"use client";

import { useState } from "react";
import { jobRoles } from "@/data/jobs";
import { venue } from "@/config/venue";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

export default function JobsPage() {
  const [role, setRole] = useState(jobRoles[0].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim() && phone.trim() && email.trim();
  const selectedRole = jobRoles.find((r) => r.id === role)!;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <PageHeader
        eyebrow="We're hiring"
        title="Join the Team"
        description={`${venue.name} runs on great people. Pick a role and tell us about yourself — a manager will reach out.`}
      />

      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="grid content-start gap-3 sm:grid-cols-2 md:grid-cols-1">
          {jobRoles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                role === r.id
                  ? "border-gold bg-gold/10"
                  : "border-white/10 hover:border-gold/40"
              }`}
            >
              <p className="font-display text-lg text-bone">{r.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{r.blurb}</p>
            </button>
          ))}
        </div>

        <div className="glass h-fit rounded-3xl p-6 sm:p-8">
          {submitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
                ✨
              </div>
              <p className="eyebrow mb-2">Application received</p>
              <h2 className="font-display text-2xl text-bone">
                Thanks, {name.split(" ")[0]}
              </h2>
              <p className="mt-3 text-sm text-muted">
                We&apos;ll reach out about the {selectedRole.title.toLowerCase()}{" "}
                role within a few days. (Demo — nothing was actually sent.)
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setSubmitted(false)}
              >
                Submit another
              </Button>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-5">
                Applying for: <span className="text-bone">{selectedRole.title}</span>
              </p>
              <div className="space-y-4">
                {[
                  { id: "job-name", label: "Name", value: name, set: setName, type: "text", placeholder: "Full name" },
                  { id: "job-phone", label: "Phone", value: phone, set: setPhone, type: "tel", placeholder: "(404) 555-0123" },
                  { id: "job-email", label: "Email", value: email, set: setEmail, type: "email", placeholder: "you@email.com" },
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="eyebrow mb-2 block">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type}
                      value={f.value}
                      placeholder={f.placeholder}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="job-about" className="eyebrow mb-2 block">
                    About you
                  </label>
                  <textarea
                    id="job-about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={4}
                    placeholder="Experience, availability, anything we should know…"
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!canSubmit}
                  onClick={() => setSubmitted(true)}
                >
                  Submit Application
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
