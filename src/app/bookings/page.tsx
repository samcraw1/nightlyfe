import { venue } from "@/config/venue";
import MockImage from "@/components/ui/MockImage";
import Button from "@/components/ui/Button";


export default function BookingsPage() {
    return (
      <section className="relative -mt-16 flex min-h-[92svh] items-end overflow-hidden pt-16">
            <div className="absolute inset-0">
              <MockImage hue={40} className="drift h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(90% 60% at 50% 100%, rgba(193,20,48,0.12), transparent 60%)",
                }}
              />
            </div>
            <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <p className="fade-up fade-up-2 mt-4 max-w-xl text-sm leading-relaxed text-bone/80 sm:text-base">
                {venue.eventsBooking.description}
              </p>
              <div className="fade-up fade-up-3 mt-8 flex flex-wrap gap-3">
                <Button href="/event" size="lg">
                  Event Booking
                </Button>
                 <Button href="/talent" size="lg">
                 Talent Booking
                </Button>
              </div>
            </div>
          </section>
    );
}