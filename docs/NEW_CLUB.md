# Launching a new club

The platform is multi-tenant by configuration. Every club is one folder:

```
src/clubs/
  types.ts            ← the ClubDefinition contract (all customisable fields)
  onyx/               ← reference template club (default)
  pinups-atl/         ← Pin Ups Atlanta concept demo ("neon" style)
  vivid-atl/          ← Vivide Atlanta concept demo ("cinematic" style)
  pinkhouse-memphis/  ← Pinkhouse Memphis concept demo ("pinkhouse" style, one-page home)
  pandoras-dfw/       ← Pandora's Clubs concept demo ("luxe" style, multi-location network)
    index.ts          ← identity, contact, colors, fonts, copy, nav, feature flags
    content/*.ts      ← roster, events, weekly specials, menu, shop, jobs, VIP tables
```

## Steps

1. **Copy a club folder.** `cp -R src/clubs/pinups-atl src/clubs/<new-slug>`, then edit `index.ts` and `content/*.ts`. TypeScript (`satisfies ClubDefinition`) flags anything missing.
2. **Brand it.**
   - `colors`: `gold` is the primary accent, `accent2` the secondary, `blood` the live/alert color.
   - `theme.style`: `"classic"` (serif, gold), `"neon"` (glow wordmark, light-show hero, scroll reveals), or `"cinematic"` (monochrome luxury: monogram + wide-tracked wordmark, chrome accents, slow camera-move hero).
   - `"pinkhouse"`: black + hot pink luxury with a neon script wordmark and photo-led sections. Pair it with `home.layout: "pinkhouse"` for the single-scroll home (hero, experience, VIP request, entertainers, events, live concept, locations, contact).
   - Optional: `locations` (multi-city cards), `seo` (OG image, keywords, `noindex` for pitch builds), `demo.hidePrices` (every price reads "TBA").
   - Optional layout variations: `home.layout: "cinematic"` (full-screen cinematic home page), `nav.style: "overlay"` (transparent nav with a full-screen menu).
   - Optional content: `instagram` (feed preview + follow CTA), `vip` (the club's real VIP phone/promoter line), `highlights` (signature offerings tiles).
   - `theme.fonts`: a preset from `src/config/fonts.ts`. Add a new preset there if needed; next/font requires static declarations.
   - `theme.logoUrl`: drop a logo in `public/clubs/<slug>/` to replace the text wordmark.
   - Multi-location brands: set `features.network: true`, `home.layout: "network"`, and list every club in `locations` (see `src/clubs/pandoras-dfw/content/locations.ts`). This enables `/clubs`, `/clubs/[slug]` (generated from the location records), the club filter on `/events`, and the `/admin-demo` management dashboard. Tag events and entertainers with `locationSlug`. Each location's `verification` ("official" / "listing" / "unconfirmed") drives the badges shown to visitors.
3. **Choose modules** with `features` (live stream, webcams, messaging, kitchen, merch, parking, jobs, bookings, and the optional `adminPreview` demo dashboard at `/admin`). Disabled modules disappear from navigation and their routes show a "not available" notice.
4. **Mark demo content.** For pitch builds set `demo.ribbon`, `demo.fictionalPerformers`, and `demo.sampleContent`. These add the unofficial-demo ribbon and "Demo profile" / "Sample" badges.
5. **Run it locally.**
   ```bash
   NEXT_PUBLIC_CLUB=<new-slug> DIGITAL_STAGE_MODE=demo npm run dev
   ```
6. **Deploy as its own Vercel project.** Never reuse another club's project.
   ```bash
   vercel project add <project-name>
   vercel link --yes --project <project-name>
   cat .vercel/project.json      # confirm projectName before deploying
   vercel env add NEXT_PUBLIC_CLUB production      # <new-slug>
   vercel env add DIGITAL_STAGE_MODE production    # demo (until Supabase/IVS are set up)
   vercel deploy --prod
   ```

## Tenant data isolation

- **Build-time isolation.** `next.config.ts` aliases `@club` to the selected folder only, so a build never contains another club's configuration or content. The config throws if `NEXT_PUBLIC_CLUB` doesn't match a folder.
- **Client storage.** Demo state in localStorage and sessionStorage is namespaced by club slug (`<slug>-demo-state-v1`).
- **Digital Stage.** The stage APIs are scoped by venue slug and reject any slug other than the deployed club's. In production mode (Supabase), every table carries `venue_id` with row-level security (see `supabase/migrations`), so clubs can share one database without seeing each other's rows, or each club can have its own Supabase project.
- **Moving content to a database.** Pages read content only through `@/data/*` and `@/config/venue`. To move a club's content into a database, swap those modules to query rows filtered by the club's `venue_id`. Components don't change.
