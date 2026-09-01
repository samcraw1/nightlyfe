# nightlyfe

A premium nightlife-venue PWA template (Next.js App Router + TypeScript + Tailwind).
Demo brand: **ONYX — Atlanta After Dark**. All performers, events, and content are fictional mock data.

## Run it

```bash
npm install
npm run dev
```

Production build: `npm run build && npm start` (the service worker / offline fallback only registers in production).

## Rebranding for a new venue

Edit `src/config/venue.ts` — name, tagline, address, colors, and feature flags. Colors flow into CSS variables in the root layout; feature flags (`webcams`, `messaging`, `kitchen`, `merch`, `parking`, `jobs`) gate nav links, home cards, and modules. Placeholder art is generated locally by `src/components/ui/MockImage.tsx` — swap it for real photography per venue.

## Structure

```
src/
  config/venue.ts     central branding + feature flags
  types/              shared TypeScript interfaces
  data/               mock data (entertainers, events, webcams, menu, messages, shop…)
  lib/store.tsx       demo client state (credits, favorites, cart…) in localStorage
  components/         ui primitives + feature components (layout, girls, live, messages…)
  app/                routes (girls, live, webcams, messages, reserve, events, kitchen, jobs, shop, account)
public/               PWA manifest, icons, offline service worker
```

## What's mock

Everything stateful: auth, payments/credits, streaming, messaging, reservations, and orders are demo-only (React state + localStorage). Interfaces are kept clean so each can be swapped for a real provider later.
