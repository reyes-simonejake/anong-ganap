-- ============================================================
-- Anong Ganap? - Supabase Schema
-- Run this in your Supabase SQL editor to set up all tables.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- Users are managed by Supabase Auth. Profiles extend auth.users.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Plans
--
-- Phase 1 auth contract:
-- user_id is nullable so the backend API can create demo/unauthenticated plans
-- before full client auth is wired. Those rows must be created/read by the
-- backend with the Supabase service role. The RLS policies below do not expose
-- user_id null plans to anon/authenticated clients.
create table if not exists public.plans (
  plan_id serial primary key,
  user_id uuid references public.profiles(user_id) on delete set null,
  title text not null,
  location text not null,
  budget numeric(10, 2) not null check (budget >= 0),
  theme text not null check (theme in ('date', 'hangout', 'family', 'solo')),
  date_created timestamptz not null default now(),
  event_date date,
  weather_summary text,
  collaboration_enabled boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'sent', 'finalized'))
);

-- Activities (3 per plan + backups)
create table if not exists public.activities (
  activity_id serial primary key,
  plan_id integer not null references public.plans(plan_id) on delete cascade,
  activity_name text not null,
  place_name text,
  start_time time,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  estimated_cost numeric(10, 2) check (estimated_cost is null or estimated_cost >= 0),
  indoor_outdoor text not null default 'outdoor' check (indoor_outdoor in ('indoor', 'outdoor')),
  description text,
  is_backup boolean not null default false,
  sequence_order integer not null default 1 check (sequence_order > 0)
);

-- Outfits
create table if not exists public.outfits (
  outfit_id serial primary key,
  plan_id integer not null references public.plans(plan_id) on delete cascade,
  theme text check (theme is null or theme in ('date', 'hangout', 'family', 'solo')),
  person_a_outfit jsonb check (person_a_outfit is null or jsonb_typeof(person_a_outfit) = 'object'),
  person_b_outfit jsonb check (person_b_outfit is null or jsonb_typeof(person_b_outfit) = 'object'),
  weather_adjusted boolean not null default false,
  pinterest_search_query text,
  created_at timestamptz not null default now()
);

-- Invitations
create table if not exists public.invitations (
  invitation_id serial primary key,
  plan_id integer not null references public.plans(plan_id) on delete cascade,
  receiver_email text not null check (position('@' in receiver_email) > 1),
  invitation_message text,
  sent_status text not null default 'pending' check (sent_status in ('pending', 'sent', 'failed')),
  invite_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  responded_at timestamptz check (responded_at is null or responded_at >= created_at)
);

-- Proposals (collaborators suggest changes)
create table if not exists public.proposals (
  proposal_id serial primary key,
  plan_id integer not null references public.plans(plan_id) on delete cascade,
  invitation_id integer references public.invitations(invitation_id) on delete cascade,
  proposal_type text not null check (proposal_type in ('activity', 'outfit', 'timing')),
  proposed_value jsonb not null check (jsonb_typeof(proposed_value) = 'object'),
  reason text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  vote_count integer not null default 0 check (vote_count >= 0),
  created_at timestamptz not null default now()
);

-- Votes on proposals
create table if not exists public.votes (
  vote_id serial primary key,
  proposal_id integer not null references public.proposals(proposal_id) on delete cascade,
  voter_email text not null check (position('@' in voter_email) > 1),
  vote text not null check (vote in ('up', 'down')),
  created_at timestamptz not null default now(),
  unique (proposal_id, voter_email)
);

-- Post-event feedback
create table if not exists public.feedback (
  feedback_id serial primary key,
  plan_id integer not null references public.plans(plan_id) on delete cascade,
  activity_rating integer check (activity_rating between 1 and 5),
  outfit_rating integer check (outfit_rating between 1 and 5),
  weather_accuracy integer check (weather_accuracy between 1 and 5),
  notes text,
  photo_urls jsonb check (photo_urls is null or jsonb_typeof(photo_urls) = 'array'),
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_plans_user_id on public.plans(user_id);
create index if not exists idx_plans_status on public.plans(status);
create index if not exists idx_plans_theme on public.plans(theme);
create index if not exists idx_plans_event_date on public.plans(event_date);

create index if not exists idx_activities_plan_id on public.activities(plan_id);
create index if not exists idx_activities_sequence on public.activities(plan_id, sequence_order);

create index if not exists idx_outfits_plan_id on public.outfits(plan_id);

create index if not exists idx_invitations_plan_id on public.invitations(plan_id);
create unique index if not exists idx_invitations_invite_token on public.invitations(invite_token);
create index if not exists idx_invitations_receiver_email on public.invitations(lower(receiver_email));
create index if not exists idx_invitations_sent_status on public.invitations(sent_status);

create index if not exists idx_proposals_plan_id on public.proposals(plan_id);
create index if not exists idx_proposals_invitation_id on public.proposals(invitation_id);
create index if not exists idx_proposals_status on public.proposals(status);
create index if not exists idx_proposals_type on public.proposals(proposal_type);

create index if not exists idx_votes_proposal_id on public.votes(proposal_id);
create index if not exists idx_votes_voter_email on public.votes(lower(voter_email));

create index if not exists idx_feedback_plan_id on public.feedback(plan_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.activities enable row level security;
alter table public.outfits enable row level security;
alter table public.invitations enable row level security;
alter table public.proposals enable row level security;
alter table public.votes enable row level security;
alter table public.feedback enable row level security;

-- Idempotent policy creation. Default RLS behavior remains deny-all unless a
-- row matches one of the explicit policies below.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profile_owner_all'
  ) then
    create policy "profile_owner_all" on public.profiles
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'plans' and policyname = 'plan_owner_all'
  ) then
    create policy "plan_owner_all" on public.plans
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'activities' and policyname = 'activity_owner_all'
  ) then
    create policy "activity_owner_all" on public.activities
      for all
      using (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      )
      with check (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'outfits' and policyname = 'outfit_owner_all'
  ) then
    create policy "outfit_owner_all" on public.outfits
      for all
      using (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      )
      with check (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'invitations' and policyname = 'invitation_owner_all'
  ) then
    create policy "invitation_owner_all" on public.invitations
      for all
      using (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      )
      with check (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'invitations' and policyname = 'invitation_recipient_read'
  ) then
    create policy "invitation_recipient_read" on public.invitations
      for select
      using (lower(receiver_email) = lower(auth.email()));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'proposals' and policyname = 'proposal_owner_all'
  ) then
    create policy "proposal_owner_all" on public.proposals
      for all
      using (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      )
      with check (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'votes' and policyname = 'vote_owner_all'
  ) then
    create policy "vote_owner_all" on public.votes
      for all
      using (
        proposal_id in (
          select proposal_id
          from public.proposals
          where plan_id in (
            select plan_id from public.plans
            where user_id = auth.uid()
          )
        )
      )
      with check (
        proposal_id in (
          select proposal_id
          from public.proposals
          where plan_id in (
            select plan_id from public.plans
            where user_id = auth.uid()
          )
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'feedback' and policyname = 'feedback_owner_all'
  ) then
    create policy "feedback_owner_all" on public.feedback
      for all
      using (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      )
      with check (
        plan_id in (
          select plan_id from public.plans
          where user_id = auth.uid()
        )
      );
  end if;
end $$;
