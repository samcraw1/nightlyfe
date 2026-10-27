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

## Digital Stage (livestreaming)

`/live` is the venue's **Digital Stage**: one livestream that entertainers rotate through, run
from the staff console at `/dashboard/digital-stage`. It runs in a labelled demo mode out of the
box and switches to AWS IVS (video) + Supabase (state, staff auth, realtime) when credentials
are added. See [DIGITAL_STAGE_SETUP.md](DIGITAL_STAGE_SETUP.md) for architecture, setup,
broadcasting and compliance notes. Copy `.env.example` to `.env.local` to configure.

## What's mock

Everything stateful except the Digital Stage: payments/credits, individual entertainer webcam rooms (`/webcams`), messaging, reservations, and orders are demo-only (React state + localStorage). Interfaces are kept clean so each can be swapped for a real provider later.
