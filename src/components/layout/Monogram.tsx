/**
 * Simple "V" monogram for cinematic-style clubs: an outer V with an inner
 * echo stroke. A placeholder mark until the club supplies its logo file
 * (`theme.logoUrl`). `draw` animates the strokes in once.
 */
export default function Monogram({
  className = "",
  draw = false,
  title,
}: {
  className?: string;
  draw?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${draw ? "cine-monogram" : ""} ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M14 18 L50 84 L86 18" strokeWidth="9" />
      <path d="M36 18 L50 44 L64 18" strokeWidth="5" />
    </svg>
  );
}
