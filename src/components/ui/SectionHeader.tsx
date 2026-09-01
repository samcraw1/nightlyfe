import Link from "next/link";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h2 className="font-display text-2xl text-bone sm:text-3xl">{title}</h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-gold transition hover:text-gold-bright"
        >
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
