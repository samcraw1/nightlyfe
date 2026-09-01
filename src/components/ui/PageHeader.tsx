import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="fade-up mb-8 pt-8 sm:pt-12">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h1 className="gold-text font-display text-4xl leading-tight sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}
