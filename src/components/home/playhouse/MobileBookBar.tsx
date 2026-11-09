"use client";

import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { openBooking } from "./shared";

/** Phone-only floating "Book" button, shown after the hero and hidden while the form is on screen. */
export default function MobileBookBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById("book");
    let pastHero = false;
    let formVisible = false;
    const sync = () => setShow(pastHero && !formVisible);
    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      sync();
    };
    const io = form
      ? new IntersectionObserver(([e]) => {
          formVisible = e.isIntersecting;
          sync();
        })
      : null;
    if (form) io!.observe(form);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-40 transition duration-500 md:hidden ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        onClick={() => openBooking()}
        tabIndex={show ? 0 : -1}
        className="pl-btn-gold flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase shadow-2xl"
      >
        <CalendarCheck className="h-4 w-4" aria-hidden />
        Booking Inquiry
      </button>
    </div>
  );
}
