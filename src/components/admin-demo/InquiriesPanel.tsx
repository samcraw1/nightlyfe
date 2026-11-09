"use client";

import { useState } from "react";
import { content } from "@/config/venue";
import { locationName, mergeInquiries, useLocations, useNetworkStore, type InquiryStatus } from "@/lib/network-store";
import { Panel, inputCls } from "./ui";

const STATUSES: InquiryStatus[] = ["new", "contacted", "confirmed", "declined"];
const TONE: Record<InquiryStatus, string> = {
  new: "bg-gold/15 text-gold",
  contacted: "bg-sky-400/10 text-sky-300",
  confirmed: "bg-emerald-400/10 text-emerald-300",
  declined: "bg-white/5 text-bone/50",
};

export default function InquiriesPanel() {
  const { state, update } = useNetworkStore();
  const locations = useLocations();
  const [club, setClub] = useState("all");
  const [status, setStatus] = useState<"all" | InquiryStatus>("all");
  const all = mergeInquiries(content.network?.seedInquiries ?? [], state);
  const list = all.filter((i) => (club === "all" || i.club === club) && (status === "all" || i.status === status));

  const setStatusFor = (id: string, s: InquiryStatus) =>
    update((st) => ({ ...st, inquiryStatus: { ...st.inquiryStatus, [id]: s } }));

  return (
    <Panel
      title={`VIP inquiries (${list.length})`}
      action={
        <div className="flex gap-2">
          <select aria-label="Filter by club" className={`${inputCls} w-auto py-1.5 text-xs`} value={club} onChange={(e) => setClub(e.target.value)}>
            <option value="all">All clubs</option>
            {locations.map((l) => (
              <option key={l.slug} value={l.slug}>{l.name}</option>
            ))}
          </select>
          <select aria-label="Filter by status" className={`${inputCls} w-auto py-1.5 text-xs capitalize`} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">Any status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      }
    >
      <div className="-mx-5 -my-5 overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="border-b border-white/5 text-[11px] uppercase tracking-[0.12em] text-bone/45">
            <tr>
              <th className="px-5 py-3 font-medium">Guest</th>
              <th className="px-3 py-3 font-medium">Club</th>
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Party</th>
              <th className="px-3 py-3 font-medium">Received</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {list.map((i) => (
              <tr key={i.id} className="align-top">
                <td className="px-5 py-3.5">
                  <p className="text-bone">{i.name}</p>
                  <p className="mt-0.5 text-xs text-bone/40">
                    {i.id} {i.fromSite ? <span className="ml-1 rounded bg-gold/15 px-1.5 py-0.5 text-[10px] text-gold">From site</span> : <span className="ml-1 text-bone/30">· demo</span>}
                  </p>
                  {i.requests ? <p className="mt-1 max-w-xs text-xs text-bone/50">{i.requests}</p> : null}
                </td>
                <td className="px-3 py-3.5 text-bone/75">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: locations.find((l) => l.slug === i.club)?.accent }} aria-hidden />
                  {locationName(i.club)}
                </td>
                <td className="px-3 py-3.5 tabular-nums text-bone/75">{i.date}</td>
                <td className="px-3 py-3.5 text-bone/75">{i.partySize}</td>
                <td className="px-3 py-3.5 text-xs text-bone/45">{new Date(i.receivedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</td>
                <td className="px-5 py-3.5">
                  <select
                    aria-label={`Status for ${i.name}`}
                    value={i.status}
                    onChange={(e) => setStatusFor(i.id, e.target.value as InquiryStatus)}
                    className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize focus:outline-none focus:ring-1 focus:ring-gold ${TONE[i.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-ink-2 text-bone">{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!list.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-bone/45">No inquiries match these filters.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
