# nightlyfe

A premium nightlife-venue PWA template (Next.js App Router + TypeScript + Tailwind).
Demo brand: **ONYX — Atlanta After Dark**. All performers, events, and content are fictional mock data.

## Run it

```bash
npm install
npm run dev
```

Production build: `npm run build && npm start` (the service worker / offline fallback only registers in production).

## Clubs (multi-tenant configuration)

Each club is a folder in `src/clubs/<slug>/`: branding, contact info, colors, fonts, copy, navigation, feature flags, and seed content. A build serves one club, chosen with `NEXT_PUBLIC_CLUB` (default `onyx`). Only that club's folder is compiled in.

| Club | Command | Notes |
| --- | --- | --- |
| ONYX (template) | `npm run dev` | Fictional reference brand |
| Pin Ups Atlanta | `npm run dev:pinups` | Unofficial concept demo for a sales pitch |

See [docs/NEW_CLUB.md](docs/NEW_CLUB.md) to add a club and deploy it as its own Vercel project.

## Structure

```
src/
  clubs/<slug>/       per-club config + content (the tenant layer)
  config/venue.ts     active club's config (single import point)
  config/fonts.ts     font presets clubs choose from
  types/              shared TypeScript interfaces
  data/               active club's content + helpers (entertainers, events, menu, shop…)
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
