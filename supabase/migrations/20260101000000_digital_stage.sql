-- Digital Stage: multi-tenant schema, Row Level Security, rotation functions,
-- audit log and Realtime publication.
--
-- Tenancy rule: every row carries venue_id. Staff membership (venue_staff)
-- is the only thing that grants write access, and it is always scoped to one
-- venue. Public visitors read through the venues_public view and a few
-- permissive SELECT policies that expose no credentials.

create type public.staff_role as enum ('owner', 'manager', 'broadcaster');
create type public.session_status as enum ('live', 'ended', 'cancelled');

-- ------------------------------------------------------------------ tables
create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{0,63}$'),
  city text,
  address text,
  logo_url text,
  primary_color text check (primary_color is null or primary_color ~ '^#[0-9a-fA-F]{6}$'),
  secondary_color text check (secondary_color is null or secondary_color ~ '^#[0-9a-fA-F]{6}$'),
  -- Viewer age gate. 21 for most US nightlife venues; null disables the gate.
  age_restriction int check (age_restriction is null or age_restriction between 13 and 25),
  -- AWS identifiers. The playback URL is public; the channel ARN and ingest
  -- endpoint are kept off the public view. Stream keys are NEVER stored here;
  -- they are fetched from IVS by the server when staff ask to reveal them.
  aws_ivs_channel_arn text,
  aws_ivs_ingest_endpoint text,
  aws_ivs_playback_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.entertainers (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{0,63}$'),
  stage_name text not null check (char_length(stage_name) between 1 and 80),
  profile_image_url text,
  bio text,
  placeholder_hue int check (placeholder_hue is null or placeholder_hue between 0 and 360),
  is_active boolean not null default true,
  featured_tonight boolean not null default false,
  -- Explicit opt-in. A performer without consent can never be put on stage.
  broadcast_consent_at timestamptz,
  broadcast_consent_version text,
  created_at timestamptz not null default now(),
  unique (venue_id, slug)
);
create index entertainers_venue_idx on public.entertainers (venue_id, is_active);

create table public.digital_stages (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null unique references public.venues (id) on delete cascade, -- one stage per venue (for now)
  is_live boolean not null default false,
  active_entertainer_id uuid references public.entertainers (id) on delete set null,
  next_entertainer_id uuid references public.entertainers (id) on delete set null,
  rotation_queue uuid[] not null default '{}',
  stream_started_at timestamptz,
  stream_ended_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.stream_sessions (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues (id) on delete cascade,
  digital_stage_id uuid not null references public.digital_stages (id) on delete cascade,
  entertainer_id uuid references public.entertainers (id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  status public.session_status not null default 'live',
  check (ended_at is null or ended_at >= started_at)
);
create index stream_sessions_stage_idx on public.stream_sessions (digital_stage_id, started_at desc);
create index stream_sessions_entertainer_idx on public.stream_sessions (entertainer_id);

create table public.venue_staff (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.staff_role not null default 'broadcaster',
  created_at timestamptz not null default now(),
  unique (venue_id, user_id)
);
create index venue_staff_user_idx on public.venue_staff (user_id);

create table public.stage_audit_log (
  id bigint generated always as identity primary key,
  venue_id uuid not null references public.venues (id) on delete cascade,
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index stage_audit_log_venue_idx on public.stage_audit_log (venue_id, created_at desc);

-- --------------------------------------------------------------- helpers
create function public.my_venue_role(p_venue uuid) returns public.staff_role
language sql stable security definer set search_path = public as $$
  select role from public.venue_staff where venue_id = p_venue and user_id = auth.uid()
$$;

-- Used by public policies: anon cannot read venues directly, so this runs as definer.
create function public.venue_is_active(p_venue uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.venues where id = p_venue and is_active)
$$;

create function public.is_venue_staff(p_venue uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.venue_staff where venue_id = p_venue and user_id = auth.uid())
$$;

create function public.log_stage_action(
  p_venue uuid, p_action text, p_entity text, p_entity_id text, p_detail jsonb default '{}'::jsonb
) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.stage_audit_log (venue_id, actor_id, action, entity, entity_id, detail)
  values (p_venue, auth.uid(), p_action, p_entity, p_entity_id, coalesce(p_detail, '{}'::jsonb));
end $$;

revoke execute on function public.log_stage_action(uuid, text, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.my_venue_role(uuid), public.is_venue_staff(uuid) from public, anon;
grant execute on function public.my_venue_role(uuid), public.is_venue_staff(uuid) to authenticated;
grant execute on function public.venue_is_active(uuid) to anon, authenticated;

-- audit log is append-only, even for the table owner
create function public.stage_audit_immutable() returns trigger language plpgsql as $$
begin
  raise exception 'stage_audit_log is append-only';
end $$;
create trigger stage_audit_no_update before update or delete on public.stage_audit_log
  for each row execute function public.stage_audit_immutable();
create trigger stage_audit_no_truncate before truncate on public.stage_audit_log
  for each statement execute function public.stage_audit_immutable();

create function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;
create trigger digital_stages_touch before update on public.digital_stages
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------- public view
-- What anonymous visitors may read about a venue. No AWS identifiers except
-- the playback URL, which has to be public for the player anyway.
create view public.venues_public with (security_invoker = false) as
  select id, name, slug, city, address, logo_url, primary_color, secondary_color,
         age_restriction, aws_ivs_playback_url
    from public.venues
   where is_active;

-- ------------------------------------------------------------------- RLS
alter table public.venues enable row level security;
alter table public.entertainers enable row level security;
alter table public.digital_stages enable row level security;
alter table public.stream_sessions enable row level security;
alter table public.venue_staff enable row level security;
alter table public.stage_audit_log enable row level security;

-- venues: only staff read the full row (incl. channel ARN); everyone else uses the view
create policy venues_select_staff on public.venues for select to authenticated
  using (public.is_venue_staff(id));
create policy venues_update_owner on public.venues for update to authenticated
  using (public.my_venue_role(id) in ('owner', 'manager'))
  with check (public.my_venue_role(id) in ('owner', 'manager'));

-- entertainers: public sees active, consenting performers of active venues; staff see all of theirs
create policy entertainers_select_public on public.entertainers for select to anon, authenticated
  using (is_active and broadcast_consent_at is not null and public.venue_is_active(venue_id));
create policy entertainers_select_staff on public.entertainers for select to authenticated
  using (public.is_venue_staff(venue_id));
create policy entertainers_write_staff on public.entertainers for all to authenticated
  using (public.my_venue_role(venue_id) in ('owner', 'manager'))
  with check (public.my_venue_role(venue_id) in ('owner', 'manager'));

-- digital stages: public read (no secrets in this table); writes only through functions
create policy stages_select_public on public.digital_stages for select to anon, authenticated
  using (public.venue_is_active(venue_id));

-- sessions and audit: staff of that venue only
create policy sessions_select_staff on public.stream_sessions for select to authenticated
  using (public.is_venue_staff(venue_id));
create policy audit_select_staff on public.stage_audit_log for select to authenticated
  using (public.is_venue_staff(venue_id));

-- staff: see yourself and your co-workers; owners manage the roster
create policy staff_select_self on public.venue_staff for select to authenticated
  using (user_id = auth.uid() or public.is_venue_staff(venue_id));
create policy staff_manage_owner on public.venue_staff for all to authenticated
  using (public.my_venue_role(venue_id) = 'owner')
  with check (public.my_venue_role(venue_id) = 'owner');

-- Table grants: nothing is writable by clients except what policies above
-- allow; stages/sessions/audit change only through the functions below.
revoke all on public.venues, public.entertainers, public.digital_stages, public.stream_sessions,
  public.venue_staff, public.stage_audit_log from anon, authenticated;
grant select on public.venues_public to anon, authenticated;
grant select on public.entertainers, public.digital_stages to anon, authenticated;
grant select on public.venues, public.stream_sessions, public.venue_staff, public.stage_audit_log to authenticated;
grant update (name, city, address, logo_url, primary_color, secondary_color, age_restriction) on public.venues to authenticated;
grant insert, update, delete on public.entertainers, public.venue_staff to authenticated;

-- ------------------------------------------------------- stage functions
-- All stage mutations go through these so the rules (staff only, same venue,
-- consent required, audit every change) cannot be bypassed by a client.

create function public.assert_stage_entertainer(p_venue uuid, p_entertainer uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v public.entertainers;
begin
  if p_entertainer is null then return; end if;
  select * into v from public.entertainers where id = p_entertainer and venue_id = p_venue;
  if v.id is null then
    raise exception 'entertainer not found for this venue' using errcode = 'P0002';
  end if;
  if not v.is_active then
    raise exception '% is not active', v.stage_name using errcode = 'P0001';
  end if;
  if v.broadcast_consent_at is null then
    raise exception '% has no broadcast consent on file', v.stage_name using errcode = 'P0001';
  end if;
end $$;

-- Close the live session (if any) and open one for the new performer while live.
create function public.rotate_stage_session(p_stage public.digital_stages, p_entertainer uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.stream_sessions set status = 'ended', ended_at = now()
   where digital_stage_id = p_stage.id and status = 'live';
  if p_stage.is_live then
    insert into public.stream_sessions (venue_id, digital_stage_id, entertainer_id)
    values (p_stage.venue_id, p_stage.id, p_entertainer);
  end if;
end $$;

create function public.set_stage_rotation(p_stage uuid, p_active uuid, p_next uuid, p_queue uuid[])
returns void
language plpgsql security definer set search_path = public as $$
declare
  s public.digital_stages;
  q uuid[] := coalesce(p_queue, '{}');
  member uuid;
begin
  select * into s from public.digital_stages where id = p_stage for update;
  if s.id is null then raise exception 'stage not found' using errcode = 'P0002'; end if;
  if not public.is_venue_staff(s.venue_id) then
    raise exception 'not staff of this venue' using errcode = '42501';
  end if;

  perform public.assert_stage_entertainer(s.venue_id, p_active);
  perform public.assert_stage_entertainer(s.venue_id, p_next);
  foreach member in array q loop
    perform public.assert_stage_entertainer(s.venue_id, member);
  end loop;

  if s.active_entertainer_id is distinct from p_active then
    s.active_entertainer_id := p_active;
    perform public.rotate_stage_session(s, p_active);
  end if;
  s.next_entertainer_id := case when p_next = p_active then null else p_next end;
  s.rotation_queue := array(select x from unnest(q) x where x <> p_active and x is distinct from s.next_entertainer_id);

  update public.digital_stages
     set active_entertainer_id = s.active_entertainer_id,
         next_entertainer_id = s.next_entertainer_id,
         rotation_queue = s.rotation_queue
   where id = s.id;

  perform public.log_stage_action(s.venue_id, 'stage.rotation', 'digital_stage', s.id::text,
    jsonb_build_object('active', p_active, 'next', s.next_entertainer_id, 'queue', s.rotation_queue));
end $$;

create function public.start_stage_broadcast(p_stage uuid, p_entertainer uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  s public.digital_stages;
  chosen uuid;
begin
  select * into s from public.digital_stages where id = p_stage for update;
  if s.id is null then raise exception 'stage not found' using errcode = 'P0002'; end if;
  if not public.is_venue_staff(s.venue_id) then
    raise exception 'not staff of this venue' using errcode = '42501';
  end if;
  if s.is_live then raise exception 'the stage is already live' using errcode = 'P0001'; end if;

  chosen := coalesce(p_entertainer, s.active_entertainer_id, s.next_entertainer_id);
  perform public.assert_stage_entertainer(s.venue_id, chosen);

  s.is_live := true;
  if chosen is not null and s.next_entertainer_id = chosen then
    s.next_entertainer_id := s.rotation_queue[1];
    s.rotation_queue := s.rotation_queue[2:];
  end if;
  update public.digital_stages
     set is_live = true, stream_started_at = now(), stream_ended_at = null,
         active_entertainer_id = chosen, next_entertainer_id = s.next_entertainer_id,
         rotation_queue = s.rotation_queue
   where id = s.id;
  perform public.rotate_stage_session(s, chosen);
  perform public.log_stage_action(s.venue_id, 'stage.start', 'digital_stage', s.id::text,
    jsonb_build_object('active', chosen));
end $$;

create function public.end_stage_broadcast(p_stage uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  s public.digital_stages;
begin
  select * into s from public.digital_stages where id = p_stage for update;
  if s.id is null then raise exception 'stage not found' using errcode = 'P0002'; end if;
  if not public.is_venue_staff(s.venue_id) then
    raise exception 'not staff of this venue' using errcode = '42501';
  end if;
  if not s.is_live then raise exception 'the stage is not live' using errcode = 'P0001'; end if;

  update public.digital_stages
     set is_live = false, stream_ended_at = now(), active_entertainer_id = null
   where id = s.id;
  s.is_live := false;
  perform public.rotate_stage_session(s, null);
  perform public.log_stage_action(s.venue_id, 'stage.end', 'digital_stage', s.id::text, '{}'::jsonb);
end $$;

-- Staff reveal of the IVS stream key happens in the app server (AWS SDK); the
-- server records it here so the audit trail is complete.
create function public.log_stream_key_reveal(p_venue uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_venue_staff(p_venue) then
    raise exception 'not staff of this venue' using errcode = '42501';
  end if;
  perform public.log_stage_action(p_venue, 'stage.stream_key_reveal', 'venue', p_venue::text, '{}'::jsonb);
end $$;

revoke execute on function public.assert_stage_entertainer(uuid, uuid),
  public.rotate_stage_session(public.digital_stages, uuid) from public, anon, authenticated;
revoke execute on function public.set_stage_rotation(uuid, uuid, uuid, uuid[]),
  public.start_stage_broadcast(uuid, uuid), public.end_stage_broadcast(uuid),
  public.log_stream_key_reveal(uuid) from public, anon;
grant execute on function public.set_stage_rotation(uuid, uuid, uuid, uuid[]),
  public.start_stage_broadcast(uuid, uuid), public.end_stage_broadcast(uuid),
  public.log_stream_key_reveal(uuid) to authenticated;

-- ---------------------------------------------------------------- realtime
-- Viewers subscribe to digital_stages changes for their venue so performer
-- swaps and live/offline flips arrive without a reload.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.digital_stages;
  end if;
end $$;
