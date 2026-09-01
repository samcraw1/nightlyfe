"use client";


import { entertainers } from "@/data/entertainers";
import PageHeader from "@/components/ui/PageHeader";
import TalentCard from "@/components/talent/TalentCard";
import { useState } from "react";

type Tab = 'models' | 'djs';


export default function TalentBookingPage() {
    const [tab, setTab] = useState<Tab>("models");

    const filtered = entertainers.filter(entertainer => {
        if(tab === 'models') return entertainer.type === 'model';
        if(tab === 'djs') return entertainer.type === 'dj';
        return false;
    });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
         <PageHeader
          eyebrow="Talent"
            title="Talent Booking"
           description="Our talent has performed on world stages, been featured in major productions, and appeared alongside hip-hop's biggest names. We work with artists, labels, and brands on large-scale productions that match our caliber, reach out via our booking inquiry form and we'll be in touch."
         />
         <div
           role="tablist"
           aria-label="Filter entertainers"
           className="mb-8 flex gap-2 overflow-x-auto no-scrollbar"
         >
           {(['models', 'djs'] as Tab[]).map((t) => (
             <button
               key={t}
               role="tab"
               aria-selected={tab === t}
               onClick={() => setTab(t)}
               className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition ${
                 tab === t
                   ? "bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink"
                   : "border border-white/10 text-bone/60 hover:border-gold/40 hover:text-gold"
               }`}
             >
               {t.charAt(0).toUpperCase() + t.slice(1)}
             </button>
           ))}
         </div>

         <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
           {filtered.map((talent) => (
             <TalentCard key={talent.id} talent={talent} />
           ))}
         </div>
   
         {filtered.length === 0 ? (
           <p className="py-20 text-center text-sm text-muted">
             No one matches this filter right now — check the full roster.
           </p>
         ) : null}
       </div>
  );
}