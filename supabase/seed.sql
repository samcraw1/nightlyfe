-- Demo venue for local Supabase. All names are fictional; mirrors the mock
-- roster in src/data/entertainers.ts so profile links keep working.
-- Run with: npx supabase db reset   (applies migrations, then this file)

insert into public.venues (name, slug, city, address, primary_color, secondary_color, age_restriction)
values ('ONYX', 'onyx', 'Atlanta', '1888 Peachtree Rd NW, Atlanta, GA 30309', '#d4a94e', '#0a0808', 21)
on conflict (slug) do nothing;

with v as (select id from public.venues where slug = 'onyx')
insert into public.entertainers (venue_id, slug, stage_name, bio, placeholder_hue, featured_tonight, broadcast_consent_at, broadcast_consent_version)
select v.id, e.slug, e.name, e.bio, e.hue, e.tonight, case when e.consent then now() end, case when e.consent then 'v1' end
  from v, (values
    ('sapphire',   'Sapphire',   'Main stage headliner. Atlanta born and raised.', 210, true,  true),
    ('amber-rose', 'Amber Rose', 'Champagne hour host.',                           28,  true,  true),
    ('jade',       'Jade',       'New routine every Friday.',                      150, true,  true),
    ('phoenix',    'Phoenix',    'Fire side chat.',                                 10,  true,  true),
    ('luna',       'Luna',       'Late night with Luna.',                          260, true,  true),
    ('candy',      'Candy',      'Sweetest set in the city.',                      330, true,  true),
    ('goldie',     'Goldie',     'Gold everything.',                                45, true,  true),
    ('diamond',    'Diamond',    'Diamond''s room.',                               190, false, true),
    ('raven',      'Raven',      'No consent on file yet (demo of the gate).',     280, false, false)
  ) as e(slug, name, bio, hue, tonight, consent)
on conflict (venue_id, slug) do nothing;

insert into public.digital_stages (venue_id, next_entertainer_id, rotation_queue)
select v.id,
       (select id from public.entertainers where venue_id = v.id and slug = 'goldie'),
       array(select id from public.entertainers where venue_id = v.id and slug in ('sapphire', 'jade'))
  from public.venues v where v.slug = 'onyx'
on conflict (venue_id) do nothing;

-- Staff are added after you create an auth user (Supabase dashboard or CLI):
--   insert into public.venue_staff (venue_id, user_id, role)
--   select id, '<auth user uuid>', 'owner' from public.venues where slug = 'onyx';
