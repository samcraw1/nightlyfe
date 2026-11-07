/**
 * Animated "light show" backdrop for neon-style heroes: drifting colour
 * fields in the club's two accents, sweeping stage beams, and film grain.
 * Pure CSS (see globals.css), no media files.
 */
export default function NeonBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`neon-backdrop ${className}`}>
      <div className="neon-field neon-field-a" />
      <div className="neon-field neon-field-b" />
      <div className="neon-field neon-field-c" />
      <div className="neon-beam neon-beam-1" />
      <div className="neon-beam neon-beam-2" />
      <div className="neon-beam neon-beam-3" />
      <div className="neon-floor" />
      <div className="neon-grain" />
    </div>
  );
}
