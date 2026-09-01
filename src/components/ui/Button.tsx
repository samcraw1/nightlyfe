import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "outline" | "ghost" | "blood";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide uppercase rounded-full transition-all duration-200 whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  gold: "bg-gradient-to-b from-gold-bright via-gold to-gold-deep text-ink shadow-[0_0_24px_rgba(212,169,78,0.25)] hover:shadow-[0_0_36px_rgba(212,169,78,0.45)] hover:brightness-110 active:scale-[0.98]",
  outline:
    "border border-gold/40 text-gold hover:border-gold hover:bg-gold/10 active:scale-[0.98]",
  ghost: "text-bone/80 hover:text-gold hover:bg-white/5 active:scale-[0.98]",
  blood:
    "bg-gradient-to-b from-[#e0203f] to-blood text-white shadow-[0_0_24px_rgba(193,20,48,0.3)] hover:brightness-110 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "text-[11px] px-4 py-2",
  md: "text-xs px-6 py-3",
  lg: "text-sm px-8 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps & { href: string };

export default function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "gold",
    size = "md",
    className = "",
    children,
    ...rest
  } = props;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
