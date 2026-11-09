import type { ReactNode } from "react";

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-white/10 bg-ink-2/80 ${className}`}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-semibold text-bone">{title}</h2>
          {action}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-2/80 p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-bone/50">{label}</p>
      <p className="mt-2 font-sans text-3xl font-semibold tracking-tight text-bone">{value}</p>
      {sub ? <p className="mt-1 text-xs text-bone/45">{sub}</p> : null}
    </div>
  );
}

export function Bar({ label, value, max, color }: { label: string; value: number; max: number; color?: string }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span className="truncate text-bone/75">{label}</span>
        <span className="tabular-nums text-bone/50">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color ?? "var(--gold)" }} />
      </div>
    </div>
  );
}

export function Sparkline({ values }: { values: number[] }) {
  const w = 300;
  const h = 70;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 8) - 4]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full" preserveAspectRatio="none" role="img" aria-label="Daily visitors, last 14 days (demo data)">
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#spark)" />
      <path d={d} fill="none" stroke="var(--gold)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export const inputCls =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-bone placeholder:text-bone/30 focus:border-gold/60 focus:outline-none";

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition ${checked ? "bg-gold" : "bg-white/15"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${checked ? "left-[1.1rem]" : "left-0.5"}`} />
    </button>
  );
}

export function DemoPill() {
  return (
    <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
      Demo data
    </span>
  );
}
