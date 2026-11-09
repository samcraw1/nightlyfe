"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

/** Shared easing: a long, soft "luxury" deceleration. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Fades + lifts its children in once, when scrolled into view.
 * Opacity/transform only (GPU-cheap); a plain fade with reduced motion.
 */
export function FadeIn({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0.3 : 0.9, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Section heading block used across the Pinkhouse home. */
export function SectionTitle({
  eyebrow,
  title,
  body,
  align = "left",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  id?: string;
}) {
  const center = align === "center";
  return (
    <FadeIn className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow mb-4 flex items-center gap-3" style={center ? { justifyContent: "center" } : undefined}>
        <span className="h-px w-8 bg-gold" aria-hidden />
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-4xl font-medium leading-[1.02] text-bone sm:text-6xl">
        {title}
      </h2>
      {body ? <p className="mt-5 text-base leading-relaxed text-bone/65 sm:text-lg">{body}</p> : null}
    </FadeIn>
  );
}
