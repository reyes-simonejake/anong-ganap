-- ============================================================
-- Anong Ganap? — Supabase Schema
-- Run this in your Supabase SQL editor to set up all tables.
-- ============================================================

-- Users (managed by Supabase Auth, this extends it)
create table if not exists public.profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Plans
create table if not exists public.plans (
  plan_id serial primary key,
  user_id uuid references public.profiles(user_id) on delete set null,
  title text not null,
  location text not null,
  budget numeric(10, 2) not null,
  theme text not null,                      -- 'date' | 'hangout' | 'family' | 'solo'
  date_created timestamptz default now(),
  event_date date,
  weather_summary text,
  collaboration_enabled boolean default true,
  status text default 'draft'               -- 'draft' | 'sent' | 'finalized'
);

-- Activities (3 per plan + backups)
create table if not exists public.activities (
  activity_id serial primary key,
  plan_id integer references public.plans(plan_id) on delete cascade,
  activity_name text not null,
  place_name text,
  start_time time,
  duration_minutes integer,
  estimated_cost numeric(10, 2),
  indoor_outdoor text default 'outdoor',    -- 'indoor' | 'outdoor'
  description text,
  is_backup boolean default false,
  sequence_order integer default 1
);

-- Outfits
create table if not exists public.outfits (
  outfit_id serial primary key,
  plan_id integer references public.plans(plan_id) on delete cascade,
  theme text,
  person_a_outfit jsonb,
  person_b_outfit jsonb,
  weather_adjusted boolean default false,
  pinterest_search_query text,
  created_at timestamptz default now()
);

-- Invitations
create table if not exists public.invitations (
  invitation_id serial primary key,
  plan_id integer references public.plans(plan_id) on delete cascade,
  receiver_email text not null,
  invitation_message text,
  sent_status text default 'pending',       -- 'pending' | 'sent' | 'failed'
  invite_token uuid default gen_random_uuid(),
  created_at timestamptz default now(),
  responded_at timestamptz
);

-- Proposals (collaborators suggest changes)
create table if not exists public.proposals (
  proposal_id serial primary key,
  plan_id integer references public.plans(plan_id) on delete cascade,
  invitation_id integer references public.invitations(invitation_id) on delete cascade,
  proposal_type text not null,              -- 'activity' | 'outfit' | 'timing'
  proposed_value jsonb not null,
  reason text,
  status text default 'pending',           -- 'pending' | 'accepted' | 'rejected'
  vote_count integer default 0,
  created_at timestamptz default now()
);

-- Votes on proposals
create table if not exists public.votes (
  vote_id serial primary key,
  proposal_id integer references public.proposals(proposal_id) on delete cascade,
  voter_email text not null,
  vote text not null,                       -- 'up' | 'down'
  created_at timestamptz default now(),
  unique(proposal_id, voter_email)
);

-- Post-event feedback
create table if not exists public.feedback (
  feedback_id serial primary key,
  plan_id integer references public.plans(plan_id) on delete cascade,
  activity_rating integer check (activity_rating between 1 and 5),
  outfit_rating integer check (outfit_rating between 1 and 5),
  weather_accuracy integer check (weather_accuracy between 1 and 5),
  notes text,
  photo_urls jsonb,
  created_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.plans enable row level security;
alter table public.activities enable row level security;
alter table public.outfits enable row level security;
alter table public.invitations enable row level security;
alter table public.proposals enable row level security;
alter table public.votes enable row level security;
alter table public.feedback enable row level security;

-- Plans: owner can do everything
create policy "plan_owner_all" on public.plans
  for all using (auth.uid() = user_id);

-- Activities: accessible if user owns the parent plan
create policy "activity_owner_all" on public.activities
  for all using (
    plan_id in (select plan_id from public.plans where user_id = auth.uid())
  );

-- Invitations: accessible by plan owner
create policy "invitation_owner_all" on public.invitations
  for all using (
    plan_id in (select plan_id from public.plans where user_id = auth.uid())
  );
