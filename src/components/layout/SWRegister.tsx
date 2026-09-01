"use client";

import { useEffect } from "react";

/** Registers the offline-fallback service worker in production builds. */
export default function SWRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // registration failure is non-fatal for the demo
    });
  }, []);
  return null;
}
