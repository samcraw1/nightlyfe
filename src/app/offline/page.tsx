import type { Metadata } from "next";
import { venue } from "@/config/venue";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow mb-3">No connection</p>
      <h1 className="gold-text font-display text-4xl sm:text-5xl">
        The night can wait
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        You&apos;re offline. Reconnect to see who&apos;s working tonight and
        what&apos;s live at {venue.name}.
      </p>
      <Button href="/" className="mt-8">
        Try Again
      </Button>
    </div>
  );
}
