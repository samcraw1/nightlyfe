# Launching a new club

The platform is multi-tenant by configuration. Every club is one folder:

```
src/clubs/
  types.ts            ← the ClubDefinition contract (all customisable fields)
  onyx/               ← reference template club (default)
  pinups-atl/         ← Pin Ups Atlanta concept demo
    index.ts          ← identity, contact, colors, fonts, copy, nav, feature flags
    content/*.ts      ← roster, events, weekly specials, menu, shop, jobs, VIP tables
```

## Steps

1. **Copy a club folder.** `cp -R src/clubs/pinups-atl src/clubs/<new-slug>`, then edit `index.ts` and `content/*.ts`. TypeScript (`satisfies ClubDefinition`) flags anything missing.
2. **Brand it.**
   - `colors`: `gold` is the primary accent, `accent2` the secondary, `blood` the live/alert color.
   - `theme.style`: `"classic"` (serif, gold) or `"neon"` (glow wordmark, light-show hero, scroll reveals).
   - `theme.fonts`: a preset from `src/config/fonts.ts`. Add a new preset there if needed; next/font requires static declarations.
   - `theme.logoUrl`: drop a logo in `public/clubs/<slug>/` to replace the text wordmark.
3. **Choose modules** with `features` (live stream, webcams, messaging, kitchen, merch, parking, jobs, bookings). Disabled modules disappear from navigation and their routes show a "not available" notice.
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
